import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import { sendSubscriptionNotification, sendPlanChangeConfirmation } from '../services/email';
import { settings } from '../routes/settings';
import stripe, { Stripe } from '../config/stripe';

const router = Router();

const PLAN_TO_PRICE: Record<string, string | undefined> = {
  MONTHLY: env.STRIPE_MONTHLY_PRICE_ID,
  YEARLY: env.STRIPE_YEARLY_PRICE_ID,
  LIFETIME: env.STRIPE_LIFETIME_PRICE_ID,
};

async function logActivity(
  userId: string,
  action: string,
  details: Record<string, unknown> | null,
  ipAddress: string | undefined
): Promise<void> {
  await prisma.activityLog.create({
    data: { userId, action, details: details as any, ipAddress },
  });
}

/**
 * POST /api/stripe/create-checkout-session
 * Creates a Stripe Checkout session for the authenticated user.
 * Body: { plan: "MONTHLY" | "YEARLY" | "LIFETIME" }
 */
router.post('/create-checkout-session', authenticate, async (req: Request, res: Response): Promise<void> => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe not configured' });
    return;
  }

  const { plan } = req.body;
  if (plan !== 'MONTHLY' && plan !== 'YEARLY' && plan !== 'LIFETIME') {
    res.status(400).json({ message: 'Invalid plan. Use MONTHLY, YEARLY or LIFETIME.' });
    return;
  }

  const priceId = PLAN_TO_PRICE[plan];
  if (!priceId) {
    res.status(500).json({ message: `No Stripe price configured for plan ${plan}` });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  // Reuse existing Stripe customer if available
  let existingSub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: 'ACTIVE' },
  });

  try {
    const isSubscription = plan === 'MONTHLY' || plan === 'YEARLY';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: isSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      metadata: { userId: user.id, plan },
      success_url: `${env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
    };

    if (existingSub?.stripeCustomerId) {
      sessionParams.customer = existingSub.stripeCustomerId;
    } else {
      sessionParams.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    await logActivity(
      user.id,
      'CHECKOUT_SESSION_CREATED',
      { sessionId: session.id, plan },
      req.socket.remoteAddress
    );

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] create-checkout-session error:', err);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/stripe/webhook
 * Handles Stripe events: checkout.session.completed, customer.subscription.updated, etc.
 * NOTE: This route MUST use raw body parser — configured in index.ts.
 */
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe not configured' });
    return;
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Stripe] Webhook signature verification failed:', err.message);
    res.status(400).json({ message: 'Invalid signature' });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan as 'MONTHLY' | 'YEARLY' | 'LIFETIME';

        if (!userId || !plan) {
          console.warn('[Stripe] Webhook: missing userId or plan in session metadata');
          break;
        }

        const now = new Date();
        const periodEnd =
          plan === 'MONTHLY'
            ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            : plan === 'YEARLY'
              ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
              : new Date(now.getTime() + 365 * 365 * 24 * 60 * 60 * 1000); // ~365 years for lifetime

        // Upsert subscription
        const existing = await prisma.subscription.findFirst({
          where: { userId, status: 'ACTIVE' },
        });

        const oldPlan = existing?.plan ?? null;

        const data = {
          userId,
          plan,
          status: 'ACTIVE' as const,
          stripeCustomerId: session.customer as string,
          stripeSubId: plan === 'MONTHLY' || plan === 'YEARLY' ? (session.subscription as string) : null,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        };

        const subscription = existing
          ? await prisma.subscription.update({ where: { id: existing.id }, data })
          : await prisma.subscription.create({ data });

        await logActivity(
          userId,
          'PAYMENT_SUCCEEDED',
          { subscriptionId: subscription.id, plan, amount: session.amount_total },
          undefined
        );

        // Send email notification to admin
        const subscriber = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
        if (subscriber) {
          sendSubscriptionNotification(
            settings.notifications?.adminNotificationEmail || 'chuck.onekeo@gmail.com',
            { name: subscriber.name, email: subscriber.email, id: userId },
            plan,
            session.amount_total
          ).catch(() => {});

          // Send confirmation email to the user
          sendPlanChangeConfirmation(subscriber.email, subscriber.name, plan, oldPlan).catch(() => {});
        }

        console.log(`[Stripe] Subscription created/updated for user ${userId}: ${plan}`);
        break;
      }

      case 'invoice.paid': {
        // Recurring monthly renewal — extend the billing period.
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string | null;
        if (!subId) {
          // One-time payments (LIFETIME) have no subscription — nothing to extend.
          break;
        }

        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubId: subId },
        });
        if (!existingSub) {
          console.warn(`[Stripe] invoice.paid for unknown subscription ${subId}`);
          break;
        }

        const period = invoice.lines?.data?.[0]?.period;
        if (!period?.end) {
          console.warn(`[Stripe] invoice.paid ${invoice.id}: no period on lines[0]`);
          break;
        }

        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: {
            status: 'ACTIVE',
            currentPeriodStart: new Date(period.start * 1000),
            currentPeriodEnd: new Date(period.end * 1000),
          },
        });

        console.log(
          `[Stripe] Invoice ${invoice.id} paid for ${subId} — period extended to ${new Date(period.end * 1000).toISOString()}`
        );
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubId: sub.id },
        });
        if (existingSub) {
          const status = sub.status === 'active' ? 'ACTIVE' : sub.status === 'past_due' ? 'PAST_DUE' : 'CANCELLED';
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status,
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
              currentPeriodStart: new Date(sub.current_period_start * 1000),
            },
          });
          console.log(`[Stripe] Subscription ${sub.id} updated to ${status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deletedSub = event.data.object as Stripe.Subscription;
        const existing = await prisma.subscription.findFirst({
          where: { stripeSubId: deletedSub.id },
        });
        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { status: 'CANCELLED' },
          });
          console.log(`[Stripe] Subscription ${deletedSub.id} cancelled`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const failedSub = await prisma.subscription.findFirst({
          where: { stripeSubId: invoice.subscription as string },
        });
        if (failedSub) {
          await prisma.subscription.update({
            where: { id: failedSub.id },
            data: { status: 'PAST_DUE' },
          });
          console.log(`[Stripe] Payment failed for subscription ${invoice.subscription}`);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe] Webhook handler error:', err);
    res.status(500).json({ message: 'Webhook handler error' });
  }
});

/**
 * GET /api/stripe/portal
 * Redirects the user to Stripe Customer Portal to manage their subscription.
 * LIFETIME users get a message instead (no recurring billing to manage).
 */
router.get('/portal', authenticate, async (req: Request, res: Response): Promise<void> => {
  if (!stripe) {
    res.status(500).json({ message: 'Stripe not configured' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const sub = await prisma.subscription.findFirst({
    where: { userId: user.id, status: 'ACTIVE' },
  });

  if (!sub?.stripeCustomerId) {
    if (sub?.plan === 'LIFETIME') {
      res.json({ url: null, message: "Votre plan à vie n'a pas de facturation à gérer." });
      return;
    }
    res.status(400).json({ message: 'No Stripe customer found' });
    return;
  }

  // LIFETIME users have no recurring billing to manage
  if (sub.plan === 'LIFETIME') {
    res.json({ url: null, message: 'Lifetime plan — no billing to manage.' });
    return;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${env.FRONTEND_URL}/profile`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error('[Stripe] portal error:', err);
    res.status(500).json({ message: 'Failed to create portal session' });
  }
});

export default router;
