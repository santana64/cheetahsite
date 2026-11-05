import type { MetadataRoute } from 'next';

/**
 * L'origine publique est fournie par NEXT_PUBLIC_SITE_URL au moment du build.
 * La valeur par défaut correspond à la prévisualisation actuelle.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const ORIGINE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cheetahsite.vercel.app').replace(
  /\/$/,
  ''
);

const PAGES: { chemin: string; priorite: number }[] = [
  { chemin: '/', priorite: 1 },
  { chemin: '/solutions/', priorite: 0.9 },
  { chemin: '/cheetah-cost/', priorite: 0.9 },
  { chemin: '/cheetah-time/', priorite: 0.8 },
  { chemin: '/cheetah-doc/', priorite: 0.8 },
  { chemin: '/methodologie/', priorite: 0.8 },
  { chemin: '/plateforme/', priorite: 0.6 },
  { chemin: '/tarifs/', priorite: 0.8 },
  { chemin: '/roadmap/', priorite: 0.4 },
  { chemin: '/contact/', priorite: 0.9 },
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: (BASE_PATH && !ORIGINE.endsWith(BASE_PATH) ? ORIGINE + BASE_PATH : ORIGINE) + p.chemin,
    changeFrequency: 'monthly' as const,
    priority: p.priorite,
  }));
}
