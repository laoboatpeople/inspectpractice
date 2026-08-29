/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://inspectpractice.com https://api.deepseek.com https://api.mymemory.translated.net https://plausible.io; frame-src 'self' https://challenges.cloudflare.com https://www.google.com/recaptcha/; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
];

async function headers() {
  return [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ];
}

module.exports = { ...nextConfig, headers };
