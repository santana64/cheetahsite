import type { MetadataRoute } from 'next';

const ORIGINE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://site-vitrine-six-pi.vercel.app').replace(
  /\/$/,
  ''
);

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/mentions-legales/', '/confidentialite/', '/cgv/'] }],
    sitemap: ORIGINE + '/sitemap.xml',
  };
}
