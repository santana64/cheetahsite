import type { Metadata } from 'next';
import Link from 'next/link';
import CoreFallback from '@/components/CoreFallback';

// Sans ce titre, la page d'erreur héritait de celui de l'accueil : un
// visiteur arrivé sur une adresse morte lisait dans son onglet le titre
// d'une page qu'il n'avait pas sous les yeux.
export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink-900 pt-24">
      <CoreFallback className="pointer-events-none absolute inset-0 opacity-35" />
      <div className="shell relative">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="display-lg mt-6 max-w-[18ch] text-paper">
          Cette page n’existe pas — ou plus.
        </h1>
        <p className="lede mt-6">
          Le site a été restructuré. Les anciennes adresses de pages produits, de tarifs et de
          contact ont changé.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Retour à l’accueil
          </Link>
          <Link href="/solutions/" className="btn btn-ghost">
            Voir les produits
          </Link>
          <Link href="/contact/" className="btn btn-ghost">
            Nous écrire
          </Link>
        </div>
      </div>
    </section>
  );
}
