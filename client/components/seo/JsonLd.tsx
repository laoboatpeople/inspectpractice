/**
 * JSON-LD structured data components for AI-friendly pages.
 * These help AI systems (LLMs, RAG, Perplexity, AI Overviews)
 * discover, parse, extract, and cite content accurately.
 */

/** Organization schema — placed on every page via root layout */
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Inspect Practice',
    url: 'https://inspectpractice.com',
    description:
      'AI-powered exam preparation platform for ICC building inspector certifications (B1, B2, E1, P1 & M1) covering the International Residential Code, International Building Code, NEC, IPC, and IMC.',
    areaServed: 'US',
    knowsAbout: [
      'ICC Certification Exam',
      'ICC B1 Exam',
      'ICC B2 Exam',
      'IRC Preparation',
      'IBC Preparation',
      'Building Inspection',
      'Code Enforcement',
      'Residential Building Inspector',
      'Commercial Building Inspector',
      'Means of Egress',
      'Foundations & Framing',
    ],
    sameAs: [
      'https://twitter.com/inspectpractice',
      'https://linkedin.com/company/inspectpractice',
      'https://www.iccsafe.org',
      'https://en.wikipedia.org/wiki/International_Code_Council',
      'https://en.wikipedia.org/wiki/International_Residential_Code',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** WebSite schema — helps AI understand the site's search and purpose */
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Inspect Practice',
    url: 'https://inspectpractice.com',
    description:
      'AI-powered exam preparation for ICC building inspector certifications — B1, B2, E1, P1 & M1.',
    inLanguage: ['en', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://inspectpractice.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Article schema — for guides and non-blog content */
export function ArticleJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  authorName = 'Inspect Practice Team',
  image,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string[];
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Inspect Practice',
    },
    datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://inspectpractice.com',
    },
  };

  if (image) {
    schema.image = image;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** BlogPosting schema — for blog posts (more specific than Article) */
export function BlogPostingJsonLd({
  headline,
  description,
  datePublished,
  dateModified,
  authorName = 'Inspect Practice Team',
  image,
  url,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string[];
  url?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Inspect Practice',
    },
    datePublished,
    dateModified: dateModified || datePublished,
    ...(url ? { mainEntityOfPage: { '@type': 'WebPage', '@id': url } } : {}),
  };

  if (image) {
    schema.image = image;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** FAQPage schema — makes Q&A pairs directly extractable by AI */
export function FAQPageJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Product schema — for subscription plans (FREE / MONTHLY / YEARLY / LIFETIME) */
export function ProductJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Inspect Practice ICC Exam Prep',
    description: 'AI-powered exam preparation for ICC building inspector certifications — B1, B2, E1, P1 & M1',
    url: 'https://inspectpractice.com',
    image: 'https://inspectpractice.com/images/og/home.jpg',
    brand: {
      '@type': 'Brand',
      name: 'Inspect Practice',
    },
    sku: 'INSPECTPRACTICE-ICC',
    mpn: 'INSPECTPRACTICE01',
    category: 'Education/Exam Preparation',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0.00',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31T23:59:59Z',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: 'https://inspectpractice.com/#pricing',
        sku: 'INSPECTPRACTICE-FREE',
      },
      {
        '@type': 'Offer',
        name: 'Monthly Plan',
        price: '29.99',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31T23:59:59Z',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: 'https://inspectpractice.com/#pricing',
        sku: 'INSPECTPRACTICE-MONTHLY',
      },
      {
        '@type': 'Offer',
        name: 'Yearly Plan',
        price: '99.00',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31T23:59:59Z',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: 'https://inspectpractice.com/#pricing',
        sku: 'INSPECTPRACTICE-YEARLY',
      },
      {
        '@type': 'Offer',
        name: 'Lifetime Plan',
        price: '199.00',
        priceCurrency: 'USD',
        priceValidUntil: '2027-12-31T23:59:59Z',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: 'https://inspectpractice.com/#pricing',
        sku: 'INSPECTPRACTICE-LIFETIME',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '3',
      reviewCount: '3',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Marc Tremblay' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: "J'étais perdu dans ma préparation aux examens ICC jusqu'à ce que je trouve Inspect Practice. Les explications IA ont tout rendu clair. Réussi du premier coup !",
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Sophie Martin' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: "Entre mon emploi du temps chargé et mes études, je n'avais jamais le temps de m'asseoir pour réviser. Maintenant je fais des questions sur mon téléphone pendant mes pauses.",
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Jean-François Côté' },
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        reviewBody: "Les analyses ont montré que j'étais faible en matière de fondations du CRI. J'ai concentré mes révisions là-dessus et j'ai commencé à voir de vraies améliorations.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Course schema — for the ICC certification study program */
export function CourseJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'ICC Building Inspector Certification Exam Preparation Course',
    description:
      'Comprehensive exam preparation for ICC building inspector certifications (B1, B2, E1, P1 & M1) — covering the International Residential Code (IRC), International Building Code (IBC), NEC, IPC, and IMC. Topics include building planning, foundations, walls, roofing, means of egress, and trade inspections.',
    provider: {
      '@type': 'Organization',
      name: 'Inspect Practice',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Review schema — for testimonials and ratings */
export function ReviewJsonLd({
  reviewRating,
  reviewBody,
  authorName = 'Inspect Practice Student',
}: {
  reviewRating: number;
  reviewBody: string;
  authorName?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: 'Inspect Practice ICC Exam Prep',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating,
    },
    reviewBody,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Inspect Practice',
    },
    award: 'Ratings',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** BreadcrumbList schema — for navigation */
export function BreadcrumbListJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** VideoObject schema — for the Watch Demo section */
export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  embedUrl,
  uploadDate,
  duration,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
  embedUrl?: string;
  uploadDate?: string;
  duration?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    contentUrl: contentUrl || undefined,
    embedUrl: embedUrl || undefined,
    uploadDate: uploadDate || undefined,
    duration: duration || undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * QAPage schema — for exam practice questions.
 * Makes individual Q&A pairs directly extractable by AI search engines.
 * Place on pages that contain exam questions with answers.
 */
export function QAPageJsonLd({
  questions,
}: {
  questions: {
    question: string;
    answer: string;
    answerExplanation?: string;
    difficulty?: string;
    examCategory?: string;
  }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      text: q.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answerExplanation
          ? `${q.answer}\n\nExplanation: ${q.answerExplanation}`
          : q.answer,
      },
      ...(q.difficulty ? { eduQuestionType: q.difficulty } : {}),
      ...(q.examCategory ? { about: q.examCategory } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * HowTo schema — for study guides and exam preparation steps.
 * Helps AI systems extract step-by-step instructions for exam prep.
 */
export function HowToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
  totalTime?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.image ? { image: step.image } : {}),
    })),
    ...(totalTime ? { totalTime } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * LearningResource schema — for theory/educational content.
 * Helps AI systems identify this as authoritative educational material.
 */
export function LearningResourceJsonLd({
  name,
  description,
  educationalLevel,
  teaches,
  resourceType = 'StudyGuide',
}: {
  name: string;
  description: string;
  educationalLevel?: string;
  teaches?: string[];
  resourceType?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name,
    description,
    educationalResourceType: resourceType,
    ...(educationalLevel ? { educationalLevel } : {}),
    ...(teaches ? { teaches } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
