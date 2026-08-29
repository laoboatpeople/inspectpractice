import { env } from '../config/env';
import { settings } from '../routes/settings';

const ADMIN_NOTIFICATION_EMAIL = () => settings.notifications?.adminNotificationEmail || 'chuck.onekeo@gmail.com';

const FROM_EMAIL = 'InspectPractice <info@inspectpractice.com>';

function getSubject(lang: string): string {
  switch (lang) {
    case 'en':
      return 'Welcome to InspectPractice — Your account is ready!';
    case 'es':
      return '¡Bienvenido a InspectPractice — Tu cuenta está lista!';
    default:
      return 'Bienvenue sur InspectPractice — Votre compte est prêt !';
  }
}

function getBody(userName: string, lang: string): string {
  const fr = [
    `Bonjour ${userName},`,
    '',
    'Merci de vous être inscrit sur InspectPractice !',
    "Vous avez désormais accès à votre compte et pouvez commencer à vous entraîner pour l'examen de certification ICC.",
    '',
    '── Votre abonnement actuel ──',
    'Forfait : Gratuit',
    'Examen inclus : ICC B1 (résidentiel)',
    '',
    '── Prochaines étapes ──',
    "• Téléchargez l'application pour étudier où que vous soyez",
    '• Commencez par les examens ICC B1',
    "• Passez à Pro pour débloquer tous les examens ICC",
    "• Activez les simulations chronométrées pour vous préparer en conditions réelles",
    '',
    '── Contact et assistance ──',
    'Site web : https://inspectpractice.com',
    'Courriel : info@inspectpractice.com',
    '',
    'À très bientôt sur InspectPractice.',
    '',
    "L'équipe InspectPractice",
  ].join('\n');

  const en = [
    `Hello ${userName},`,
    '',
    'Thank you for signing up for InspectPractice!',
    'Your account is now active and you can start preparing for your ICC certification exam.',
    '',
    '── Your Current Plan ──',
    'Plan: Free',
    'Included exam: ICC B1 (Residential)',
    '',
    '── Next Steps ──',
    '• Download the app to study anywhere',
    '• Start with the ICC B1 exam',
    '• Upgrade to Pro to unlock all ICC certification exams',
    '• Enable timed simulations to prepare under real exam conditions',
    '',
    '── Contact & Support ──',
    'Website: https://inspectpractice.com',
    'Email: info@inspectpractice.com',
    '',
    'See you soon on InspectPractice.',
    '',
    'The InspectPractice Team',
  ].join('\n');

  const es = [
    `Hola ${userName},`,
    '',
    '¡Gracias por registrarte en InspectPractice!',
    'Tu cuenta ya está activa y puedes empezar a prepararte para el examen de certificación ICC.',
    '',
    '── Tu Plan Actual ──',
    'Plan: Gratuito',
    'Examen incluido: ICC B1 (Residencial)',
    '',
    '── Próximos Pasos ──',
    '• Descarga la app para estudiar desde cualquier lugar',
    '• Empieza con los exámenes ICC',
    '• Actualiza a Pro para desbloquear todos los exámenes ICC',
    '• Activa las simulaciones cronometradas para prepararte en condiciones reales',
    '',
    '── Contacto y Soporte ──',
    'Sitio web: https://inspectpractice.com',
    'Correo: info@inspectpractice.com',
    '',
    '¡Hasta pronto en InspectPractice!',
    '',
    'El equipo de InspectPractice',
  ].join('\n');

  switch (lang) {
    case 'en': return en;
    case 'es': return es;
    default: return fr;
  }
}

function getHtmlBody(userName: string, lang: string): string {
  const ctas: Record<string, { btn: string; hero: string; sub: string; steps: string[]; upsell: string; footer: string }> = {
    fr: {
      btn: 'Commencer mon premier quiz',
      hero: 'Bienvenue sur InspectPractice,',
      sub: 'Votre compte est prêt. Vous pouvez dès maintenant vous entraîner pour l\'examen ICC avec des questions réalistes générées par IA.',
      steps: [
        'Connectez-vous à votre tableau de bord',
        'Choisissez un examen (B1, B2, E1, P1 ou M1)',
        'Répondez à 10 questions — sans pression',
        'Consultez vos résultats et identifiez vos points faibles',
      ],
      upsell: '💡 Le forfait gratuit inclut un examen. Débloquez tous les examens ICC pour maximiser vos chances de réussite.',
      footer: 'L\'équipe InspectPractice',
    },
    en: {
      btn: 'Start My First Quiz',
      hero: 'Welcome to InspectPractice,',
      sub: 'Your account is ready. Start practicing with AI-powered ICC certification exam questions immediately.',
      steps: [
        'Log in to your dashboard',
        'Choose an exam (B1, B2, E1, P1, or M1)',
        'Answer 10 questions — no pressure',
        'Review your results and identify weak areas',
      ],
      upsell: '💡 The free plan includes one exam. Unlock all ICC certification exams to maximize your chances of passing.',
      footer: 'The InspectPractice Team',
    },
    es: {
      btn: 'Comenzar mi primer quiz',
      hero: 'Bienvenido a InspectPractice,',
      sub: 'Tu cuenta está lista. Empieza a practicar con preguntas realistas al estilo ICC generadas por IA.',
      steps: [
        'Inicia sesión en tu panel',
        'Elige un examen (B1, B2, E1, P1 o M1)',
        'Responde 10 preguntas — sin presión',
        'Revisa tus resultados e identifica áreas débiles',
      ],
      upsell: '💡 El plan gratuito incluye un examen. Desbloquea todos los exámenes ICC para maximizar tus posibilidades de éxito.',
      footer: 'El equipo de InspectPractice',
    },
  };

  const cta = ctas[lang] || ctas.fr;
  const stepsHtml = cta.steps.map((s, i) => `<tr><td style="padding:6px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;color:#CBD5E1;"><span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#1E293B;color:#3B82F6;font-size:12px;font-weight:700;margin-right:10px;">${i + 1}</span>${s}</td></tr>`).join('');
  const url = 'https://inspectpractice.com/app';
  const siteUrl = 'https://inspectpractice.com';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#0B1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B1120;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="color:#3B82F6;font-size:20px;font-weight:700;letter-spacing:-0.5px;">🏠 InspectPractice</span>
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid #1E293B;border-radius:16px;padding:40px;">
              
              <!-- Hero text -->
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#F1F5F9;text-align:center;">${cta.hero}</h1>
              <p style="font-size:14px;color:#94A3B8;text-align:center;margin:12px 0 24px;line-height:1.6;">${cta.sub}</p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" style="background:#3B82F6;border-radius:10px;padding:14px 32px;">
                    <a href="${url}" target="_blank" style="color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;display:block;">${cta.btn}</a>
                  </td>
                </tr>
              </table>

              <!-- Quick steps -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${stepsHtml}
              </table>

              <!-- Divider -->
              <div style="height:1px;background:#1E293B;margin:24px 0;"></div>

              <!-- Upsell -->
              <p style="font-size:13px;color:#CBD5E1;line-height:1.5;margin:0;text-align:center;">
                ${cta.upsell}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="font-size:12px;color:#475569;margin:0;">
                <a href="${siteUrl}" style="color:#3B82F6;text-decoration:none;">InspectPractice</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}/faq" style="color:#64748B;text-decoration:none;">FAQ</a>
                &nbsp;·&nbsp;
                <a href="${siteUrl}/contact" style="color:#64748B;text-decoration:none;">Support</a>
              </p>
              <p style="font-size:12px;color:#334155;margin:8px 0 0;">
                ${cta.footer}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendWelcomeEmail(
  toEmail: string,
  userName: string,
  lang: string = 'fr'
): Promise<boolean> {
  return sendEmail(toEmail, getSubject(lang), getBody(userName, lang), getHtmlBody(userName, lang));
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetLink: string,
  lang: string = 'fr'
): Promise<boolean> {
  const subject: Record<string, string> = {
    en: 'Reset your InspectPractice password',
    fr: 'Réinitialisation de votre mot de passe InspectPractice',
    es: 'Restablece tu contraseña de InspectPractice',
  };
  const body: Record<string, string> = {
    en: [
      'Hello,',
      '',
      'A password reset was requested for your InspectPractice account.',
      '',
      `Reset link (valid for 1 hour):`,
      resetLink,
      '',
      'If you did not request this, please ignore this email.',
      '',
      'The InspectPractice Team',
    ].join('\n'),
    fr: [
      'Bonjour,',
      '',
      'Une réinitialisation de mot de passe a été demandée pour votre compte InspectPractice.',
      '',
      `Lien de réinitialisation (valide 1 heure) :`,
      resetLink,
      '',
      'Si vous n\'avez pas demandé cela, ignorez cet email.',
      '',
      'L\'équipe InspectPractice',
    ].join('\n'),
    es: [
      'Hola,',
      '',
      'Se solicitó un restablecimiento de contraseña para tu cuenta de InspectPractice.',
      '',
      `Enlace de restablecimiento (válido por 1 hora):`,
      resetLink,
      '',
      'Si no solicitaste esto, ignora este correo.',
      '',
      'El equipo de InspectPractice',
    ].join('\n'),
  };

  return sendEmail(toEmail, subject[lang] || subject.fr, body[lang] || body.fr);
}

export async function sendSubscriptionNotification(
  toEmail: string,
  user: { name: string; email: string; id: string },
  plan: string,
  amount: number | null
): Promise<boolean> {
  const subject = `🛒 Nouvel abonnement — ${plan} — ${user.name}`;

  const text = [
    `━━━ Nouvel Abonnement InspectPractice ━━━`,
    '',
    `Plan : ${plan}`,
    amount !== null && amount > 0 ? `Montant : $${((amount ?? 0) / 100).toFixed(2)}` : 'Montant : —',
    '',
    `━━━ Utilisateur ━━━`,
    `Nom      : ${user.name}`,
    `Email    : ${user.email}`,
    `ID       : ${user.id}`,
    '',
    `Admin : https://inspectpractice.com/admin/users`,
    `Stripe : https://dashboard.stripe.com`,
    '',
  ].filter(Boolean).join('\n');

  return sendEmail(toEmail, subject, text);
}

export async function sendNewsletterNotification(email: string): Promise<boolean> {
  const subject = `New Newsletter Subscriber: ${email}`;

  const now = new Date().toISOString();
  const text = [
    `━━━ New Newsletter Subscriber ━━━`,
    '',
    `Email     : ${email}`,
    `Timestamp : ${now}`,
    '',
    `Manage subscribers: https://inspectpractice.com/admin/newsletter`,
    '',
  ].join('\n');

  return sendEmail(ADMIN_NOTIFICATION_EMAIL(), subject, text);
}

export interface TutorFeedbackNotificationParams {
  siteName: string;
  adminUrl: string;
  rating: 'up' | 'down';
  comment: string | null;
  userEmail: string;
  userName: string | null;
  messagePreview: string;
  sessionTopic: string | null;
}

export interface TheoryFeedbackNotificationParams {
  siteName: string;
  adminUrl: string;
  rating: 'up' | 'down';
  comment: string | null;
  userEmail: string;
  userName: string | null;
  chapterName: string;
  chapterId: string;
}

export async function sendTheoryFeedbackNotification(
  params: TheoryFeedbackNotificationParams
): Promise<boolean> {
  const emoji = params.rating === 'up' ? '👍' : '👎';
  const subject = `${emoji} Theory Feedback — ${params.siteName} — ${params.userName || params.userEmail}`;
  const sectionUrl = `${params.adminUrl}/theory?chapterId=${params.chapterId}`;
  const text = [
    `━━━ Theory Feedback — ${params.siteName} ━━━`,
    '',
    `Rating    : ${params.rating === 'up' ? 'Up 👍' : 'Down 👎'}`,
    `Comment   : ${params.comment || '—'}`,
    '',
    `━━━ Utilisateur ━━━`,
    `Nom       : ${params.userName || '—'}`,
    `Email     : ${params.userEmail}`,
    '',
    `━━━ Chapitre ━━━`,
    `Chapitre  : ${params.chapterName}`,
    `Section   : ${sectionUrl}`,
    '',
    `Admin     : ${params.adminUrl}/admin/feedback`,
    `Date      : ${new Date().toISOString()}`,
    '',
  ].filter(Boolean).join('\n');

  return sendEmail(ADMIN_NOTIFICATION_EMAIL(), subject, text);
}

export async function sendTutorFeedbackNotification(
  params: TutorFeedbackNotificationParams
): Promise<boolean> {
  const emoji = params.rating === 'up' ? '👍' : '👎';
  const subject = `${emoji} Tutor Feedback — ${params.siteName} — ${params.userName || params.userEmail}`;
  const text = [
    `━━━ Tutor Feedback — ${params.siteName} ━━━`,
    '',
    `Rating    : ${params.rating === 'up' ? 'Up 👍' : 'Down 👎'}`,
    `Comment   : ${params.comment || '—'}`,
    '',
    `━━━ Utilisateur ━━━`,
    `Nom       : ${params.userName || '—'}`,
    `Email     : ${params.userEmail}`,
    '',
    `━━━ Message tutor ━━━`,
    params.sessionTopic ? `Sujet     : ${params.sessionTopic}` : '',
    `Extrait   : ${params.messagePreview.slice(0, 400)}`,
    '',
    `Admin     : ${params.adminUrl}/admin/tutor`,
    `Date      : ${new Date().toISOString()}`,
    '',
  ].filter(Boolean).join('\n');

  return sendEmail(ADMIN_NOTIFICATION_EMAIL(), subject, text);
}

// ── Plan change confirmation email (sent to user) ──

const PLAN_LABELS: Record<string, { fr: string; en: string }> = {
  FREE: { fr: 'Gratuit', en: 'Free' },
  MONTHLY: { fr: 'Mensuel (Pro)', en: 'Monthly (Pro)' },
  LIFETIME: { fr: 'À vie (Pro)', en: 'Lifetime (Pro)' },
};

const PLAN_FEATURES: Record<string, { fr: string[]; en: string[] }> = {
  FREE: {
    fr: ['Accès à l\'examen ICC B1', 'Questions d\'entraînement limitées'],
    en: ['ICC B1 exam access', 'Limited practice questions'],
  },
  MONTHLY: {
    fr: ['Accès aux tous les examens ICC', 'Questions illimitées', 'Simulations chronométrées', 'Tuteur IA', 'Annulable en tout temps'],
    en: ['All ICC certification exams', 'Unlimited questions', 'Timed simulations', 'AI Tutor', 'Cancel anytime'],
  },
  LIFETIME: {
    fr: ['Accès aux tous les examens ICC', 'Questions illimitées', 'Simulations chronométrées', 'Tuteur IA', 'Accès à vie — paiement unique'],
    en: ['All ICC certification exams', 'Unlimited questions', 'Timed simulations', 'AI Tutor', 'Lifetime access — one-time payment'],
  },
};

export async function sendPlanChangeConfirmation(
  toEmail: string,
  userName: string,
  newPlan: string,
  oldPlan: string | null,
  lang: string = 'fr'
): Promise<boolean> {
  const isFr = lang !== 'en';
  const l = isFr ? 'fr' : 'en';

  const newLabel = PLAN_LABELS[newPlan]?.[l] ?? newPlan;
  const oldLabel = oldPlan ? (PLAN_LABELS[oldPlan]?.[l] ?? oldPlan) : null;

  const isUpgrade = newPlan !== 'FREE';
  const isDowngrade = newPlan === 'FREE';

  const subject = isFr
    ? (isUpgrade
        ? `✅ Abonnement confirmé — ${newLabel} — InspectPractice`
        : `Votre abonnement a été modifié — InspectPractice`)
    : (isUpgrade
        ? `✅ Subscription Confirmed — ${newLabel} — InspectPractice`
        : `Your Subscription Has Been Updated — InspectPractice`);

  const features = PLAN_FEATURES[newPlan]?.[l] ?? [];
  const featuresHtml = features.map((f) =>
    `<li style="font-size:14px;color:#CBD5E1;padding:4px 0;">✅ ${f}</li>`
  ).join('');

  const changeLine = oldLabel
    ? (isFr
        ? `Votre forfait est passé de <strong style="color:#94A3B8;">${oldLabel}</strong> à <strong style="color:#3B82F6;">${newLabel}</strong>.`
        : `Your plan has changed from <strong style="color:#94A3B8;">${oldLabel}</strong> to <strong style="color:#3B82F6;">${newLabel}</strong>.`)
    : (isFr
        ? `Votre forfait <strong style="color:#3B82F6;">${newLabel}</strong> est maintenant actif.`
        : `Your <strong style="color:#3B82F6;">${newLabel}</strong> plan is now active.`);

  const heroTitle = isFr
    ? (isUpgrade ? 'Abonnement confirmé !' : isDowngrade ? 'Abonnement modifié' : 'Abonnement mis à jour')
    : (isUpgrade ? 'Subscription Confirmed!' : isDowngrade ? 'Subscription Updated' : 'Subscription Updated');

  const heroSub = isFr
    ? (isUpgrade
        ? `Merci ${userName} ! Vous avez maintenant accès à toutes les fonctionnalités Pro.`
        : `Bonjour ${userName}, votre abonnement a été mis à jour.`)
    : (isUpgrade
        ? `Thanks ${userName}! You now have access to all Pro features.`
        : `Hello ${userName}, your subscription has been updated.`);

  const ctaLabel = isFr ? 'Accéder à mon tableau de bord' : 'Go to My Dashboard';
  const footerTeam = isFr ? 'L\'équipe InspectPractice' : 'The InspectPractice Team';
  const supportLine = isFr
    ? 'Des questions ? Écrivez-nous à info@inspectpractice.com'
    : 'Questions? Email us at info@inspectpractice.com';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#0B1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B1120;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="color:#3B82F6;font-size:20px;font-weight:700;letter-spacing:-0.5px;">🏠 InspectPractice</span>
            </td>
          </tr>
          <tr>
            <td style="background:linear-gradient(135deg,#0F172A,#1E293B);border:1px solid #1E293B;border-radius:16px;padding:40px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#F1F5F9;text-align:center;">${heroTitle}</h1>
              <p style="font-size:14px;color:#94A3B8;text-align:center;margin:12px 0 24px;line-height:1.6;">${heroSub}</p>

              <div style="background:#0B1120;border:1px solid #1E293B;border-radius:12px;padding:20px;margin-bottom:24px;">
                <p style="font-size:14px;color:#94A3B8;margin:0 0 8px;text-align:center;">${changeLine}</p>
                ${features.length > 0 ? `
                <div style="border-top:1px solid #1E293B;margin-top:12px;padding-top:12px;">
                  <p style="font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">${isFr ? 'Ce qui est inclus' : 'What\'s included'}</p>
                  <ul style="list-style:none;padding:0;margin:0;">
                    ${featuresHtml}
                  </ul>
                </div>` : ''}
              </div>

              <table cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px;">
                <tr>
                  <td align="center" style="background:#3B82F6;border-radius:10px;padding:14px 32px;">
                    <a href="https://inspectpractice.com/app" target="_blank" style="color:#FFFFFF;font-size:15px;font-weight:600;text-decoration:none;display:block;">${ctaLabel}</a>
                  </td>
                </tr>
              </table>

              <p style="font-size:13px;color:#64748B;text-align:center;margin:0;">${supportLine}</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="font-size:12px;color:#475569;margin:0;">
                <a href="https://inspectpractice.com" style="color:#3B82F6;text-decoration:none;">InspectPractice</a>
                &nbsp;·&nbsp;
                <a href="https://inspectpractice.com/faq" style="color:#64748B;text-decoration:none;">FAQ</a>
                &nbsp;·&nbsp;
                <a href="https://inspectpractice.com/contact" style="color:#64748B;text-decoration:none;">Support</a>
              </p>
              <p style="font-size:12px;color:#334155;margin:8px 0 0;">${footerTeam}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = isFr
    ? [
        `Bonjour ${userName},`,
        '',
        oldLabel
          ? `Votre forfait est passé de ${oldLabel} à ${newLabel}.`
          : `Votre forfait ${newLabel} est maintenant actif.`,
        '',
        ...(features.length > 0 ? ['Ce qui est inclus :', ...features.map((f) => `  ✅ ${f}`), ''] : []),
        'Accédez à votre tableau de bord : https://inspectpractice.com/app',
        '',
        supportLine,
        '',
        footerTeam,
      ].join('\n')
    : [
        `Hello ${userName},`,
        '',
        oldLabel
          ? `Your plan has changed from ${oldLabel} to ${newLabel}.`
          : `Your ${newLabel} plan is now active.`,
        '',
        ...(features.length > 0 ? ['What\'s included:', ...features.map((f) => `  ✅ ${f}`), ''] : []),
        'Go to your dashboard: https://inspectpractice.com/app',
        '',
        supportLine,
        '',
        footerTeam,
      ].join('\n');

  return sendEmail(toEmail, subject, text, html);
}

export async function sendNewsletterConfirmation(email: string, locale: 'en' | 'fr' = 'en'): Promise<boolean> {
  const isFr = locale === 'fr';
  const pdfUrl = isFr
    ? 'https://inspectpractice.com/study-checklist-30-day-fr.pdf'
    : 'https://inspectpractice.com/study-checklist-30-day.pdf';

  const subject = isFr
    ? 'Checklist de préparation aux examens ICC 30 jours — Inspect Practice'
    : 'Your 30-Day ICC Exam Prep Checklist — Inspect Practice';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0E1A; color: #F8FAFC; padding: 40px 20px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto;">
    <tr>
      <td style="text-align: center; padding-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #3B82F6, #06B6D4); text-align: center; line-height: 48px; font-size: 24px;">🏠</div>
        <h1 style="font-size: 24px; margin: 16px 0 4px;">Inspect Practice</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #1A2035; border: 1px solid #2D3A52; border-radius: 16px; padding: 32px;">
        <h2 style="font-size: 20px; margin: 0 0 12px; color: #F8FAFC;">${isFr ? 'Votre checklist ICC 30 jours' : 'Your 30-Day ICC Checklist'}</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
          ${isFr
            ? 'Merci de vous être abonné à l\'infolettre Inspect Practice ! Voici votre checklist de préparation aux examens ICC de 30 jours.'
            : 'Thanks for subscribing to the Inspect Practice newsletter! Here\'s your 30-day ICC exam prep checklist.'}
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
          ${isFr
            ? 'Cette checklist couvre le programme ICC B1 — administration du code, planification du bâtiment, fondations, charpente et simulations chronométrées. Suivez une tâche par jour pour rester sur la bonne voie.'
            : 'This checklist covers the ICC B1 Residential Building Inspector curriculum — IRC code administration, building planning, foundations, framing, and timed simulations. Follow one task per day to stay on track.'}
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${pdfUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3B82F6, #06B6D4); color: #fff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 600;">
            ${isFr ? '📄 Télécharger votre PDF gratuit' : '📄 Download Your Free PDF Checklist'}
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #64748B; margin: 24px 0 0;">
          ${isFr
            ? 'Vous recevrez également des conseils d\'examen, des ressources d\'étude et des mises à jour de fonctionnalités dans les courriels à venir. Vous pouvez vous désabonner à tout moment.'
            : 'You\'ll also receive exam tips, study resources, and feature updates in future emails. Unsubscribe anytime.'}
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-top: 24px; font-size: 12px; color: #64748B;">
        <p style="margin: 0;">${isFr ? 'Inspect Practice — Préparation aux examens ICC' : 'Inspect Practice &mdash; ICC Building Inspector Exam Prep'}</p>
        <p style="margin: 4px 0 0;"><a href="https://inspectpractice.com" style="color: #3B82F6; text-decoration: none;">inspectpractice.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = isFr
    ? [
        'Checklist de préparation aux examens ICC 30 jours — Inspect Practice',
        '',
        'Merci de vous être abonné à l\'infolettre Inspect Practice !',
        '',
        'Consultez et imprimez votre checklist ici :',
        'https://inspectpractice.com/study-checklist-30-day-fr.pdf',
        '',
        'Vous recevrez également des conseils d\'examen, des ressources d\'étude et des mises à jour.',
        '— L\'équipe Inspect Practice',
      ].join('\n')
    : [
        'Your 30-Day ICC Exam Prep Checklist — Inspect Practice',
        '',
        'Thanks for subscribing to the Inspect Practice newsletter!',
        '',
        'View and print your checklist here:',
        'https://inspectpractice.com/study-checklist-30-day.pdf',
        '',
        'You\'ll also receive exam tips, study resources, and feature updates.',
        '— Inspect Practice Team',
      ].join('\n');

  return sendEmail(email, subject, text, html);
}

export async function sendSampleQuestionsConfirmation(email: string, locale: 'en' | 'fr' = 'en'): Promise<boolean> {
  const isFr = locale === 'fr';
  const subject = isFr
    ? 'Questions pratiques ICC gratuites — Inspect Practice'
    : 'Your Free ICC Sample Questions — Inspect Practice';
  const pdfUrl = isFr
    ? 'https://inspectpractice.com/icc-sample-questions-fr.pdf'
    : 'https://inspectpractice.com/icc-sample-questions.pdf';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0E1A; color: #F8FAFC; padding: 40px 20px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto;">
    <tr>
      <td style="text-align: center; padding-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #3B82F6, #06B6D4); text-align: center; line-height: 48px; font-size: 24px;">🏠</div>
        <h1 style="font-size: 24px; margin: 16px 0 4px;">Inspect Practice</h1>
      </td>
    </tr>
    <tr>
      <td style="background: #1A2035; border: 1px solid #2D3A52; border-radius: 16px; padding: 32px;">
        <h2 style="font-size: 20px; margin: 0 0 12px; color: #F8FAFC;">${isFr ? 'Vos questions pratiques ICC gratuites' : 'Your Free ICC Sample Questions'}</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
          ${isFr
            ? 'Merci de vous être abonné à l\'infolettre Inspect Practice ! Voici 10 questions pratiques ICC gratuites avec explications détaillées.'
            : 'Thanks for subscribing to the Inspect Practice newsletter! Here are your 10 free ICC sample practice questions with detailed explanations.'}
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
          ${isFr
            ? 'Ces questions couvrent les codes IRC et IBC — administration du code, planification du bâtiment, fondations, charpente, égress et sécurité incendie — le même style que vous verrez aux examens ICC.'
            : 'These questions cover IRC and IBC topics — code administration, building planning, foundations, framing, egress, and fire safety — the same style you\'ll see on ICC certification exams.'}
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${pdfUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3B82F6, #06B6D4); color: #fff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 600;">
            ${isFr ? '📄 Télécharger vos questions pratiques PDF' : '📄 Download Your Free Sample Questions PDF'}
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.5; color: #64748B; margin: 24px 0 0;">
          ${isFr
            ? 'Vous voulez l\'ensemble complet ? Inspect Practice propose 2 500+ questions avec difficulté adaptative, examens chronométrés et explications par l\'IA. <a href="https://inspectpractice.com/fr/auth/register" style="color: #3B82F6; text-decoration: underline;">Créez votre compte gratuit</a> pour commencer.'
            : 'Want the full set? Inspect Practice has 2,500+ questions with adaptive difficulty, timed exams, and AI Tutor explanations. <a href="https://inspectpractice.com/auth/register" style="color: #3B82F6; text-decoration: underline;">Create your free account</a> to get started.'}
        </p>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-top: 24px; font-size: 12px; color: #64748B;">
        <p style="margin: 0;">${isFr ? 'Inspect Practice — Préparation aux examens ICC' : 'Inspect Practice &mdash; ICC Building Inspector Exam Prep'}</p>
        <p style="margin: 4px 0 0;"><a href="https://inspectpractice.com" style="color: #3B82F6; text-decoration: none;">inspectpractice.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = isFr
    ? [
        'Questions pratiques ICC gratuites — Inspect Practice',
        '',
        'Merci de vous être abonné à l\'infolettre Inspect Practice !',
        '',
        'Téléchargez vos 10 questions pratiques ICC gratuites ici :',
        'https://inspectpractice.com/icc-sample-questions-fr.pdf',
        '',
        'Vous voulez l\'ensemble complet ? Créez votre compte gratuit sur https://inspectpractice.com/fr/auth/register',
        '— L\'équipe Inspect Practice',
      ].join('\n')
    : [
        'Your Free ICC Sample Questions — Inspect Practice',
        '',
        'Thanks for subscribing to the Inspect Practice newsletter!',
        '',
        'Download your 10 free ICC sample practice questions here:',
        'https://inspectpractice.com/icc-sample-questions.pdf',
        '',
        'Want the full set? Create your free account at https://inspectpractice.com/auth/register',
        '— Inspect Practice Team',
      ].join('\n');

  return sendEmail(email, subject, text, html);
}

export async function sendEmail(toEmail: string, subject: string, text: string, html?: string): Promise<boolean> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return false;

  try {
    const body: Record<string, unknown> = {
      from: FROM_EMAIL,
      to: [toEmail],
      subject,
      text,
    };
    if (html) body.html = html;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Email] Resend error:', res.status, errBody);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Email] Network error:', err);
    return false;
  }
}
