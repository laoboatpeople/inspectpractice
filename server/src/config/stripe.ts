import Stripe from 'stripe';
import { env } from './env';

let stripe: Stripe | null = null;

try {
  if (env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }
} catch {
  console.warn('[Stripe] Failed to initialize — check STRIPE_SECRET_KEY');
}

export default stripe;
export { Stripe };
