import { FAQPageJsonLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — Inspect Practice ICC Exam Prep',
  description:
    'Choose your Inspect Practice plan: Free (basic stats), Monthly $29.99/mo, Yearly $99/yr, or Lifetime $199 (everything). Start ICC prep today.',
  alternates: {
    canonical: 'https://inspectpractice.com/pricing',
    languages: {
      en: 'https://inspectpractice.com/pricing',
    },
  },
  openGraph: {
    title: 'Pricing — Inspect Practice ICC Exam Prep',
    description:
      'Flexible plans for ICC exam prep: Free, Monthly $29.99/mo, Yearly $99/yr, or Lifetime $199. AI-powered study with 2,500+ questions. Start free, upgrade anytime.',
    url: 'https://inspectpractice.com/pricing',
    type: 'website',
    images: [
      {
        url: 'https://inspectpractice.com/images/og/pricing.jpg',
        width: 1200,
        height: 630,
        alt: 'Inspect Practice ICC Exam Prep Pricing Plans',
      },
    ],
  },
  twitter: {
    title: 'Pricing — Inspect Practice ICC Exam Prep',
  },
  other: {
    'article:published_time': '2025-01-15',
    'article:modified_time': '2026-05-18',
  },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Try before you commit. Get a feel for the platform with limited access.',
    features: [
      { included: true, text: '1 exam category' },
      { included: true, text: 'Basic progress stats' },
      { included: true, text: 'Limited question pool' },
      { included: false, text: 'All exam categories' },
      { included: false, text: 'AI adaptive difficulty' },
      { included: false, text: 'Unlimited practice exams' },
      { included: true, text: '50 messages AI Tutor' },
      { included: false, text: 'Detailed analytics' },
      { included: false, text: 'Priority support' },
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Monthly',
    price: '$29.99',
    period: '/month',
    description: 'Full access to everything Inspect Practice offers. Cancel anytime.',
    features: [
      { included: true, text: 'All exam categories' },
      { included: true, text: 'AI adaptive difficulty' },
      { included: true, text: 'Unlimited practice exams' },
      { included: true, text: 'Unlimited AI Tutor' },
      { included: true, text: 'Detailed analytics' },
      { included: true, text: 'Full question bank (2,500+)' },
      { included: true, text: 'Progress tracking' },
      { included: false, text: 'Lifetime updates' },
    ],
    cta: 'Start Monthly',
    highlighted: false,
  },
  {
    name: 'Yearly',
    price: '$99',
    period: '/year',
    description: '2 months free vs Monthly. Best value for serious ICC candidates.',
    features: [
      { included: true, text: 'All exam categories' },
      { included: true, text: 'AI adaptive difficulty' },
      { included: true, text: 'Unlimited practice exams' },
      { included: true, text: 'Unlimited AI Tutor' },
      { included: true, text: 'Detailed analytics' },
      { included: true, text: 'Full question bank (2,500+)' },
      { included: true, text: 'Progress tracking' },
      { included: false, text: 'Lifetime updates' },
    ],
    cta: 'Start Yearly',
    highlighted: true,
  },
  {
    name: 'Lifetime',
    price: '$199',
    period: 'one-time',
    description: 'Pay once, own forever.',
    features: [
      { included: true, text: 'All exam categories' },
      { included: true, text: 'AI adaptive difficulty' },
      { included: true, text: 'Unlimited practice exams' },
      { included: true, text: 'Unlimited AI Tutor' },
      { included: true, text: 'Detailed analytics' },
      { included: true, text: 'Full question bank (2,500+)' },
      { included: true, text: 'Progress tracking' },
      { included: true, text: 'All future updates' },
    ],
    cta: 'Get Lifetime Access',
    highlighted: false,
  },
];

const pricingFaqs = [
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes. You can upgrade from Free to Monthly, Yearly, or Lifetime at any time. If you are on Monthly or Yearly and decide you want Lifetime, you can upgrade and only pay the difference. Your progress and data are preserved across all plan changes.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'The Free plan is our trial. You can use it indefinitely with access to one exam category and basic features. When you are ready for full access, upgrade to Monthly, Yearly, or Lifetime. No credit card is required to start with the Free plan.',
  },
  {
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. All payments are processed securely through our payment provider. Your card information is never stored on our servers.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Yes. If you are not satisfied with Inspect Practice, contact us within 14 days of your purchase for a full refund. We stand behind our platform and want you to be confident in your investment.',
  },
  {
    question: 'Does the Lifetime plan include all future updates?',
    answer:
      'Yes. The Lifetime plan includes all current content and all future updates. As we add new questions, features, and exam categories, your Lifetime access covers everything. This is the best value for candidates who plan to study over an extended period.',
  },
  {
    question: 'Is there a discount for students or groups?',
    answer:
      'We occasionally offer promotional pricing. Contact us if you are representing an educational institution or a group of students — we can discuss custom pricing for bulk or institutional licenses.',
  },
];

export default function PricingPage() {
  return (
    <>
      <FAQPageJsonLd questions={pricingFaqs} />
      <BreadcrumbListJsonLd
        items={[
          { name: 'Home', url: 'https://inspectpractice.com' },
          { name: 'Pricing', url: 'https://inspectpractice.com/pricing' },
        ]}
      />
      <div className="min-h-screen bg-[#F4F7F8] text-[#102631]">
        {/* Nav */}
        <nav className="border-b border-[#DCE4E7] bg-[#071D2B]/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img src="/logo/logo-main-light.png?v=4" alt="Inspect Practice" className="h-7 w-auto" />
            </a>
            <a href="/" className="text-sm text-[#586A73] hover:text-[#CBEA32] transition-colors">
              ← Back to Home
            </a>
          </div>
        </nav>

        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center mb-16">
            <span className="text-[11px] font-medium text-[#176B87] bg-[#176B87]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-[#586A73] max-w-2xl mx-auto leading-relaxed">
              Start free, upgrade when you are ready. No hidden fees, no surprise charges.
              Every plan gives you access to Inspect Practice&apos;s AI-powered ICC exam preparation platform.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-[#176B87]/10 to-[#176B87]/10 border-2 border-[#176B87]/40'
                    : 'bg-white border border-[#DCE4E7]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider px-4 py-1 rounded-full border border-white/20 bg-white text-[#102631] backdrop-blur-sm">
                      🏆 Best Value
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-[#586A73]">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-[#586A73]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                        <svg className="w-5 h-5 text-[#176B87] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-[#7A8B94] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={feature.included ? 'text-[#DCE4E7]' : 'text-[#7A8B94] line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/auth/login"
                  className="inline-flex items-center justify-center w-full py-3 rounded-lg text-sm font-medium transition-colors bg-[#CBEA32] hover:bg-[#B5D51F] text-[#071D2B] font-semibold"
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-10">Compare Plans in Detail</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#DCE4E7]">
                    <th className="text-left py-4 pr-6 text-sm font-medium text-[#586A73]">Feature</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#586A73]">Free</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#176B87]">Monthly</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#176B87]">Yearly</th>
                    <th className="text-center py-4 px-4 text-sm font-medium text-[#586A73]">Lifetime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { feature: 'Exam categories', free: '1', monthly: 'All', yearly: 'All', lifetime: 'All' },
                    { feature: 'Question bank access', free: 'Limited', monthly: '2,500+', yearly: '2,500+', lifetime: '2,500+' },
                    { feature: 'AI adaptive difficulty', free: '—', monthly: '✓', yearly: '✓', lifetime: '✓' },
                    { feature: 'Unlimited practice exams', free: '—', monthly: '✓', yearly: '✓', lifetime: '✓' },
                    { feature: 'AI Tutor', free: '50 msgs', monthly: 'Unlimited', yearly: 'Unlimited', lifetime: 'Unlimited' },
                    { feature: 'Detailed analytics', free: 'Basic', monthly: 'Full', yearly: 'Full', lifetime: 'Full' },
                    { feature: 'Progress tracking', free: 'Basic', monthly: 'Full', yearly: 'Full', lifetime: 'Full' },
                    { feature: 'Priority support', free: '—', monthly: '✓', yearly: '✓', lifetime: '✓' },
                    { feature: 'Future updates', free: '—', monthly: 'While subscribed', yearly: 'While subscribed', lifetime: '✓' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white transition-colors">
                      <td className="py-4 pr-6 text-sm text-[#DCE4E7]">{row.feature}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#586A73]">{row.free}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#102631]">{row.monthly}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#102631]">{row.yearly}</td>
                      <td className="py-4 px-4 text-center text-sm text-[#102631]">{row.lifetime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-0 divide-y divide-white/5">
              {pricingFaqs.map((faq, i) => (
                <details key={i} className="group py-5 cursor-pointer">
                  <summary className="flex items-start justify-between gap-4 list-none">
                    <span className="text-base font-medium text-[#102631] group-hover:text-[#176B87] transition-colors">
                      {faq.question}
                    </span>
                    <svg
                      className="w-5 h-5 text-[#7A8B94] mt-0.5 shrink-0 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[#586A73] leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pb-20">
            <div className="bg-gradient-to-r from-[#176B87]/10 to-[#176B87]/10 rounded-2xl p-10">
              <h2 className="text-2xl font-bold mb-3">Still Not Sure?</h2>
              <p className="text-[#586A73] mb-6 max-w-xl mx-auto">
                Start with the Free plan — no credit card required. Experience Inspect Practice
                for yourself and upgrade when you are ready.
              </p>
              <a
                href="/auth/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#176B87] hover:bg-[#176B87] rounded-lg text-sm font-medium transition-colors"
              >
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
