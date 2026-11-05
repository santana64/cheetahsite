import type { MetadataRoute } from 'next';

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const ORIGINE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cheetahsite.vercel.app').replace(
  /\/$/,
  ''
);

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    // Legal pages carry noindex metadata; crawlers must be allowed to read it.
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: (BASE_PATH && !ORIGINE.endsWith(BASE_PATH) ? ORIGINE + BASE_PATH : ORIGINE) + '/sitemap.xml',
  };
}
