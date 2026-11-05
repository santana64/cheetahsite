'use client';

/**
 * LA GRILLE CHEETAH COST — reconstitution native.
 *
 * Mêmes colonnes, mêmes valeurs et mêmes groupes d'en-tête que l'écran de
 * travail du produit, relevés sur la capture versionnée dans ce dépôt. Seul
 * l'habillage appartient à ce site.
 *
 * Le mouvement se limite strictement au décoratif : seules les barres de
 * magnitude se déploient. Les lignes, elles, sont rendues visibles d'emblée.
 *
 * Règle apprise à la dure : aucun contenu ne doit dépendre de l'achèvement
 * d'une transition CSS. Une timeline d'animation ralentie — onglet en arrière-
 * plan, capture automatisée, appareil throttlé — laisse la transition bloquée
 * à son état de départ, et le tableau reste vide. Une barre figée à zéro ne
 * cache rien ; une ligne figée à opacité zéro cache tout.
 */

import { useEffect, useRef, useState } from 'react';
import { sumVisibleCostRows } from '@/lib/finance';
import { COST_ARRETE, COST_LIGNES, type LigneBudgetaire } from '@/content/cheetah';

const nf = (n: number, d = 0) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

const cell = (v: number | null, d = 0) => (v === null ? '—' : nf(v, d));

function tonEcart(e: number) {
  if (e > 0) return { couleur: 'var(--drift)', libelle: 'dépassement' };
  if (e < 0) return { couleur: 'var(--volt)', libelle: 'économie' };
  return { couleur: 'var(--steel-400)', libelle: 'à la cible' };
}

/** Barre de magnitude de l'écart, centrée sur zéro. */
function BarreEcart({ ratio, actif, ordre }: { ratio: number; actif: boolean; ordre: number }) {
  const amplitude = Math.min(Math.abs(ratio) / 20, 1) * 50;
  const { couleur } = tonEcart(ratio);
  return (
    <span className="relative ml-2 hidden h-3 w-16 shrink-0 align-middle sm:inline-block" aria-hidden="true">
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
      <span
        className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-sm transition-[width] duration-700 ease-cheetah"
        style={{
          width: actif ? `${amplitude}%` : 0,
          transitionDelay: `${120 + ordre * 70}ms`,
          background: couleur,
          left: ratio >= 0 ? '50%' : undefined,
          right: ratio < 0 ? '50%' : undefined,
        }}
      />
    </span>
  );
}

const GROUPES: { titre: string; colonnes: string[]; accent?: boolean }[] = [
  { titre: 'Budget', colonnes: ['BI', 'Variation', 'BàD'] },
  { titre: 'Travail effectué', colonnes: ['Dépenses', 'Avancement', 'Val. acquise'] },
  { titre: 'Prévision', colonnes: ['RàF', 'CP', 'E', 'E/BàD', 'E préc.', 'D'], accent: true },
];

export function CostGrid({ focus = false }: { focus?: boolean }) {
  const hote = useRef<HTMLDivElement>(null);
  const [actif, setActif] = useState(false);

  useEffect(() => {
    const el = hote.current;
    if (!el) return;
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setActif(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setActif(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActif(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const subtotal = sumVisibleCostRows(COST_LIGNES);

  const ligne = (l: LigneBudgetaire, i: number) => {
    const t = tonEcart(l.e);
    return (
      <tr key={l.code} className="group">
        <th
          scope="row"
          className="sticky left-0 z-10 whitespace-nowrap bg-ink-800 py-3 pl-4 pr-5 text-left font-mono text-[0.6875rem] font-medium text-steel-300 group-hover:bg-ink-700 sm:pl-6"
        >
          <span className="text-volt/70">{l.code}</span>
          <span className="ml-3 text-paper">{l.intitule}</span>
        </th>

        <td className="num px-3 py-3 text-right text-steel-300">{cell(l.bi)}</td>
        <td className="num px-3 py-3 text-right text-steel-400">{cell(l.variation)}</td>
        <td className="num px-3 py-3 text-right font-medium text-paper">{cell(l.bad)}</td>

        <td className="num border-l border-white/[0.06] px-3 py-3 text-right text-steel-300">
          {cell(l.depenses, l.depenses !== null && !Number.isInteger(l.depenses) ? 1 : 0)}
        </td>
        <td className="num px-3 py-3 text-right text-steel-300">
          {l.avancement === null ? '—' : `${nf(l.avancement)} %`}
        </td>
        <td className="num px-3 py-3 text-right text-champagne">{cell(l.valeurAcquise)}</td>

        <td
          className={`num border-l px-3 py-3 text-right text-steel-300 ${
            focus ? 'border-volt/30 bg-volt/[0.04]' : 'border-white/[0.06]'
          }`}
        >
          {cell(l.raf)}
        </td>
        <td className={`num px-3 py-3 text-right font-medium text-paper ${focus ? 'bg-volt/[0.04]' : ''}`}>
          {cell(l.cp)}
        </td>
        <td
          className={`num whitespace-nowrap px-3 py-3 text-right font-semibold ${focus ? 'bg-volt/[0.04]' : ''}`}
          style={{ color: t.couleur }}
        >
          {l.e > 0 ? '+' : ''}
          {nf(l.e)}
          <BarreEcart ratio={l.eRatio} actif={actif} ordre={i} />
        </td>
        <td
          className={`num px-3 py-3 text-right ${focus ? 'bg-volt/[0.04]' : ''}`}
          style={{ color: t.couleur }}
        >
          {l.eRatio > 0 ? '+' : ''}
          {nf(l.eRatio)} %
        </td>
        <td className={`num px-3 py-3 text-right text-steel-400 ${focus ? 'bg-volt/[0.04]' : ''}`}>
          {nf(l.ePrec)}
        </td>
        <td
          className={`num px-3 py-3 pr-4 text-right font-medium sm:pr-6 ${focus ? 'bg-volt/[0.04]' : ''}`}
          style={{ color: l.d === 0 ? 'var(--steel-400)' : tonEcart(l.d).couleur }}
        >
          {l.d > 0 ? '+' : ''}
          {nf(l.d)}
        </td>
      </tr>
    );
  };

  return (
    <div ref={hote} className="panel corner-ticks overflow-hidden">
      <div className="border-b border-amber/30 bg-amber/[0.05] px-4 py-4 text-xs leading-relaxed text-steel-200 sm:px-6">
        <p className="font-semibold text-amber">Reconstitution d’une capture réelle · synthèse source non réconciliée</p>
        <p className="mt-2">Les cinq lignes visibles donnent un sous-total de {nf(subtotal.budget)} k€ de budget à date,
          {nf(subtotal.forecast)} k€ de coût prévisionnel et {nf(subtotal.variance)} k€ d’écart.
          Le bandeau de la capture indique 800 / 798 / −3 k€ : son périmètre et son calcul ne sont pas documentés
          (798 − 800 = −2 k€). Aucune ligne masquée n’est attestée. Ces valeurs historiques sont conservées, sans les présenter comme un total validé.</p>
      </div>
      {/* Barre d'arrêté */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="rounded-sm border border-volt/40 px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-volt">
            FGF
          </span>
          <span className="font-mono text-xs text-paper">{COST_ARRETE.tableau}</span>
          <span className="font-mono text-xs text-steel-500">{COST_ARRETE.projet}</span>
          <span className="font-mono text-xs text-steel-500">{COST_ARRETE.date}</span>
        </div>
        <dl className="flex flex-wrap items-baseline gap-x-7 gap-y-1">
          {[
            { k: 'BàD source', v: `${nf(COST_ARRETE.bad)}`, c: 'text-paper' },
            { k: 'CP source', v: `${nf(COST_ARRETE.cp)}`, c: 'text-paper' },
            { k: 'Écart source', v: `${nf(COST_ARRETE.ecart)}`, c: 'text-volt' },
          ].map((x) => (
            <div key={x.k} className="flex items-baseline gap-2">
              <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-steel-500">
                {x.k}
              </dt>
              <dd className={`num text-sm font-semibold ${x.c}`}>{x.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Grille */}
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Grille budgétaire, défilement horizontal">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <caption className="sr-only">
            Arrêté {COST_ARRETE.date} du tableau {COST_ARRETE.tableau}, projet {COST_ARRETE.projet}.
            Montants en {COST_ARRETE.unite}. Cinq lignes budgétaires, de la référence au budget
            initial jusqu’à la dérive depuis l’arrêté précédent.
          </caption>

          <thead>
            <tr>
              <td className="sticky left-0 z-10 bg-ink-800" />
              {GROUPES.map((g) => (
                <th
                  key={g.titre}
                  scope="colgroup"
                  colSpan={g.colonnes.length}
                  className={`border-l px-3 pb-2 pt-4 text-center font-mono text-[0.5625rem] uppercase tracking-[0.2em] ${
                    g.accent
                      ? 'border-volt/30 text-volt'
                      : 'border-white/[0.06] text-steel-500'
                  }`}
                >
                  {g.titre}
                </th>
              ))}
            </tr>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-10 bg-ink-800 py-2 pl-4 pr-5 text-left font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-steel-500 sm:pl-6"
              >
                Ligne budgétaire
              </th>
              {GROUPES.flatMap((g, gi) =>
                g.colonnes.map((c, ci) => (
                  <th
                    key={g.titre + c}
                    scope="col"
                    className={`whitespace-nowrap px-3 py-2 text-right font-mono text-[0.5625rem] uppercase tracking-[0.16em] ${
                      ci === 0 ? (g.accent ? 'border-l border-volt/30' : 'border-l border-white/[0.06]') : ''
                    } ${g.accent ? 'text-volt/70' : 'text-steel-500'} ${
                      gi === GROUPES.length - 1 && ci === g.colonnes.length - 1 ? 'pr-4 sm:pr-6' : ''
                    }`}
                  >
                    {c}
                  </th>
                ))
              )}
            </tr>
          </thead>

          <tbody className="border-t border-white/[0.09]">{COST_LIGNES.map(ligne)}</tbody>
        </table>
      </div>

      <p className="border-t border-white/10 px-4 py-3 text-xs leading-relaxed text-steel-300 sm:px-6">
        Sous-total des valeurs affichées : BàD {nf(subtotal.budget)} k€ · CP {nf(subtotal.forecast)} k€ · E {nf(subtotal.variance)} k€.
        LB02 : 78,5 + 210 = 288,5 k€, affiché 289 dans la source ; 11 % est un ratio arrondi.
        La convention d’arrondi d’origine n’est pas documentée. Aucune donnée de la capture n’a été retouchée.
      </p>
      <p className="border-t border-white/[0.07] px-4 py-3 font-mono text-[0.625rem] leading-relaxed text-steel-500 sm:px-6">
        Unités : {COST_ARRETE.unite}. {COST_ARRETE.source}
      </p>
    </div>
  );
}

export default CostGrid;
