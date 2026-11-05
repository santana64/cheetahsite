import Image from 'next/image';
import styles from './ui.module.css';
import Link from 'next/link';
import { CONTACT } from '@/content/cheetah';

const COLONNES: { titre: string; liens: { label: string; href: string }[] }[] = [
  {
    titre: 'Produits',
    liens: [
      { label: 'Cheetah Cost', href: '/cheetah-cost/' },
      { label: 'Cheetah Time', href: '/cheetah-time/' },
      { label: 'Cheetah Doc', href: '/cheetah-doc/' },
      { label: 'Vue d’ensemble', href: '/solutions/' },
      { label: 'Feuille de route', href: '/roadmap/' },
    ],
  },
  {
    titre: 'Comprendre',
    liens: [
      { label: 'Méthode de pilotage', href: '/methodologie/' },
      { label: 'Plateforme et sécurité', href: '/plateforme/' },
      { label: 'Tarifs', href: '/tarifs/' },
    ],
  },
  {
    titre: 'Entreprise',
    liens: [
      { label: 'Contact', href: '/contact/' },
      { label: 'Mentions légales', href: '/mentions-legales/' },
      { label: 'Conditions générales', href: '/cgv/' },
      { label: 'Confidentialité', href: '/confidentialite/' },
    ],
  },
];

export function Footer() {
  return (
    <footer className={`${styles.footer} relative border-t border-white/[0.07] bg-ink-900`}>
      <div className={`shell ${styles.footerRibbon}`}><span>CHEETAHSOFT / CONTROL FIELD</span><span>COST · TIME · DOC</span></div>

      <div className={`shell relative grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-20 ${styles.footerGrid}`}>
        <div className={styles.footerBrand}>
          <div className="flex items-center gap-3">
            <span className="block h-10 w-10 overflow-hidden rounded-full bg-white ring-1 ring-white/15">
              <Image src="/logo-cheetah-128.webp" alt="" width={40} height={40} className="h-full w-full object-cover" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-paper">CheetahSoft</span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel-400">
            Suite de pilotage de projets complexes. Les coûts, les délais et les pièces
            justificatives dans un seul système cohérent.
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-5 inline-flex min-h-[36px] items-center font-mono text-sm text-volt underline-offset-4 hover:underline"
          >
            {CONTACT.email}
          </a>
        </div>

        {COLONNES.map((col) => (
          <nav key={col.titre} aria-label={col.titre}>
            <h2 className="eyebrow mb-5">{col.titre}</h2>
            <ul className="space-y-1">
              {col.liens.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-[32px] items-center text-sm text-steel-300 transition-colors hover:text-volt"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="shell relative flex flex-col gap-3 border-t border-white/[0.06] py-6 text-xs text-steel-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} CheetahSoft. Tous droits réservés.</p>
        <p className="font-mono uppercase tracking-[0.18em]">Precision in motion</p>
      </div>
    </footer>
  );
}

export default Footer;
