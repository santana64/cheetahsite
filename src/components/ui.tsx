import Link from 'next/link';
import { ReactNode } from 'react';
import { PREUVE_LABEL, type Preuve } from '@/content/cheetah';

/* ── En-tête de section éditoriale ──────────────────────────────────── */

export function SectionHead({
  acte,
  titre,
  chapeau,
  align = 'left',
  tone = 'dark',
}: {
  acte: string;
  titre: ReactNode;
  chapeau?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
}) {
  return (
    <div
      className={`reveal ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}
    >
      <p className={`eyebrow ${tone === 'light' ? '!text-ink-500' : ''}`}>{acte}</p>
      <h2
        className={`display-lg mt-6 ${tone === 'light' ? 'text-ink-900' : 'text-paper'}`}
      >
        {titre}
      </h2>
      {chapeau && (
        <div className={`lede mt-6 ${tone === 'light' ? '!text-ink-700' : ''} ${align === 'center' ? 'mx-auto' : ''}`}>
          {chapeau}
        </div>
      )}
    </div>
  );
}

/* ── Marqueur de fiabilité ──────────────────────────────────────────── */

const PREUVE_STYLE: Record<Preuve, string> = {
  demontre: 'border-volt/35 text-volt',
  decrit: 'border-steel-400/35 text-steel-300',
  roadmap: 'border-amber/35 text-amber',
};

export function ProofTag({ preuve, compact = false }: { preuve: Preuve; compact?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] ${PREUVE_STYLE[preuve]}`}
      title={PREUVE_LABEL[preuve]}
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {compact
        ? preuve === 'demontre'
          ? 'Démontré'
          : preuve === 'decrit'
            ? 'Décrit'
            : 'À venir'
        : PREUVE_LABEL[preuve]}
    </span>
  );
}

/* ── Bandeau de conversion ──────────────────────────────────────────── */

export function CtaBand({
  titre,
  texte,
  primaire = { label: 'Demander une démonstration', href: '/contact/' },
  secondaire,
}: {
  titre: string;
  texte: string;
  primaire?: { label: string; href: string };
  secondaire?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-ink-900">
      <div className="techgrid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-full h-[26rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(205,245,100,0.14), transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="shell relative py-24 text-center md:py-32">
        <h2 className="display-lg reveal mx-auto max-w-3xl text-paper">{titre}</h2>
        <p className="lede reveal mx-auto mt-6">{texte}</p>
        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href={primaire.href} className="btn btn-primary">
            {primaire.label}
          </Link>
          {secondaire && (
            <Link href={secondaire.href} className="btn btn-ghost">
              {secondaire.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Fil d'ariane simple ────────────────────────────────────────────── */

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d’ariane" className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
      <ol className="flex flex-wrap items-center gap-2 text-steel-500">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-[26px] items-center transition-colors hover:text-volt">
                {item.label}
              </Link>
            ) : (
              <span className="text-steel-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── En-tête de page intérieure ─────────────────────────────────────── */

export function PageHero({
  fil,
  eyebrow,
  titre,
  chapeau,
  accent = '#cdf564',
  children,
}: {
  fil: { label: string; href?: string }[];
  eyebrow: string;
  titre: ReactNode;
  chapeau: ReactNode;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07] bg-ink-900 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="techgrid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.55]"
        style={{ background: `radial-gradient(circle, ${accent}22, transparent 68%)` }}
        aria-hidden="true"
      />
      <div className="shell relative">
        <Breadcrumb items={fil} />
        <p className="eyebrow mt-8" style={{ color: accent }}>
          {eyebrow}
        </p>
        <h1 className="display-xl mt-6 max-w-[16ch] text-paper">{titre}</h1>
        <div className="lede mt-7 max-w-2xl">{chapeau}</div>
        {children}
      </div>
    </section>
  );
}
