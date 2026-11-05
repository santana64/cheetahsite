import type { Metadata } from "next";

/** Public origin only: never place credentials in NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://cheetahsite.vercel.app"
).replace(/\/$/, "");
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const root =
    BASE_PATH && !SITE_URL.endsWith(BASE_PATH)
      ? SITE_URL + BASE_PATH
      : SITE_URL;
  const url = `${root}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "CheetahSoft",
      title: `${title} · CheetahSoft`,
      description,
      url,
    },
    twitter: { card: "summary", title: `${title} · CheetahSoft`, description },
  };
}
