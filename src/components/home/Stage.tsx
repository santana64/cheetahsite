'use client';

/**
 * ACTES 01 → 03 — la séquence signature.
 *
 * Une scène WebGL fixe, trois temps narratifs qui se relaient au défilement :
 *   01 · l'impact — la promesse, les accès
 *   02 · le désordre — pourquoi la dérive échappe au suivi comptable
 *   03 · la convergence — ce que Cheetah remet en ordre
 *
 * Le défilement reste natif : rien n'est capturé, rien n'est accéléré. La
 * progression ne fait que piloter l'opacité des temps et les uniformes de la
 * scène. En mouvement réduit, les trois temps sont empilés en flux normal et
 * la scène est rendue une seule fois, dans son état stable.
 */

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { coreState } from '@/three/coreState';
import CoreFallback from '../CoreFallback';

const ControlCore = dynamic(() => import('../ControlCore').then((m) => m.ControlCore), {
  ssr: false,
  loading: () => <CoreFallback className="h-full w-full" />,
});

type Beat = { eyebrow: string; lignes: React.ReactNode[]; texte: string };

const BEATS: Beat[] = [
  {
    eyebrow: 'Cheetah · Cost · Time · Doc',
    lignes: [
      <>La dérive se voit</>,
      <>
        <span className="text-volt">avant</span> de se payer.
      </>,
    ],
    texte:
      'Cheetah tient la chaîne complète du contrôle de projet : budget à date, avancement physique, valeur acquise, reste à faire, coût prévisionnel, écart. Ligne budgétaire par ligne budgétaire, arrêté après arrêté.',
  },
  {
    eyebrow: 'Acte 02 — Le désordre',
    lignes: [
      <>Les dépenses sont à jour.</>,
      <>
        <span className="text-amber">L’avancement ne l’est pas.</span>
      </>,
    ],
    texte:
      'Un projet qui consomme son budget au rythme prévu peut être très en retard sur ce qu’il produit. Sans mesure d’avancement physique, l’écart reste invisible jusqu’au moment où il n’est plus rattrapable.',
  },
  {
    eyebrow: 'Acte 03 — La convergence',
    lignes: [
      <>Une référence. Une mesure.</>,
      <>
        <span className="text-volt">Une projection.</span>
      </>,
    ],
    texte:
      'Chaque ligne budgétaire porte sa cible, son avancement réel et sa prévision de coût final. Le faisceau se referme sur le budget à date — et l’écart devient une décision, pas une surprise de fin de chantier.',
  },
];

/** Titre découpé en lignes, chacune découverte derrière son masque. */
function TitreMasque({ lignes, className }: { lignes: React.ReactNode[]; className: string }) {
  return (
    <span className={`mask-lines ${className}`}>
      {lignes.map((l, i) => (
        <span key={i}>
          <span>{l}</span>
        </span>
      ))}
    </span>
  );
}

export function Stage() {
  const stage = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    setReady(true);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const onProgress = useCallback((p: number) => {
    // Pilotage de la scène : le faisceau se met en ordre entre 18 % et 78 %.
    coreState.orderTarget = Math.min(Math.max((p - 0.18) / 0.6, 0), 1);
    coreState.focusTarget = Math.min(Math.max((p - 0.1) / 0.78, 0), 1);

    // Relais des temps narratifs — fenêtres qui se recouvrent légèrement.
    const windows: [number, number][] = [
      [-0.2, 0.3],
      [0.26, 0.64],
      [0.6, 1.2],
    ];
    beatRefs.current.forEach((el, i) => {
      if (!el) return;
      const [a, b] = windows[i];
      const mid = (a + b) / 2;
      const half = (b - a) / 2;
      const dist = Math.abs(p - mid) / half;
      const o = Math.min(Math.max(1 - (dist - 0.52) / 0.42, 0), 1);
      el.style.opacity = String(o);
      el.style.transform = `translate3d(0, ${(1 - o) * 26}px, 0)`;
      el.style.pointerEvents = o > 0.55 ? 'auto' : 'none';
      el.setAttribute('aria-hidden', o > 0.2 ? 'false' : 'true');
    });

    if (railRef.current) railRef.current.style.transform = `scaleY(${p})`;
  }, []);

  useScrollProgress(stage, onProgress, ready && !reduced);

  /* ── Variante mouvement réduit : flux normal, aucun recouvrement ──── */
  if (ready && reduced) {
    return (
      <section className="relative overflow-hidden border-b border-white/[0.07] bg-ink-900">
        <div className="shell relative pb-16 pt-32 md:pt-40">
          <p className="eyebrow">{BEATS[0].eyebrow}</p>
          <h1 className="display-xl mt-6 max-w-[20ch]">
            <TitreMasque lignes={BEATS[0].lignes} className="" />
          </h1>
          <p className="lede mt-6">{BEATS[0].texte}</p>
          <Actions />
        </div>

        {/* Scène rendue une seule fois, dans son état stable. */}
        <div className="relative h-[42vh] min-h-[260px] w-full">
          <ControlCore className="absolute inset-0" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,10,0.9) 0%, rgba(6,8,10,0.1) 35%, rgba(6,8,10,0.1) 65%, rgba(6,8,10,0.95) 100%)',
            }}
          />
        </div>

        <div className="shell relative space-y-20 pb-24">
          {BEATS.slice(1).map((b, i) => (
            <div key={i} className="max-w-3xl">
              <p className="eyebrow">{b.eyebrow}</p>
              <h2 className="display-lg mt-6">
                <TitreMasque lignes={b.lignes} className="" />
              </h2>
              <p className="lede mt-6">{b.texte}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={stage}
      className="relative h-[320vh] border-b border-white/[0.07] bg-ink-900"
      aria-label="Présentation de Cheetah"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Recomposition mobile : la scène occupe le bas de l'écran, le texte
            le haut. Sur grand écran, la scène occupe tout le cadre. */}
        <div className="absolute inset-x-0 bottom-0 h-[56%] md:inset-0 md:h-full">
          <ControlCore className="h-full w-full" />
        </div>

        {/* Lisibilité du texte au-dessus de la scène */}
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,8,10,0.97) 0%, rgba(6,8,10,0.92) 42%, rgba(6,8,10,0.45) 62%, rgba(6,8,10,0.2) 78%, rgba(6,8,10,0.8) 100%)',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              'linear-gradient(100deg, rgba(6,8,10,0.94) 0%, rgba(6,8,10,0.74) 32%, rgba(6,8,10,0.1) 62%, rgba(6,8,10,0.55) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="shell relative flex h-full items-start pt-[6.25rem] md:items-center md:pt-0">
          <div className="relative min-h-[30rem] w-full max-w-[44rem] md:min-h-[27rem] md:pt-10">
            {BEATS.map((b, i) => (
              <div
                key={i}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center"
                /* Temps narratifs : leur opacité est pilotée par la
                   progression du défilement, pas par un effet d'entrée. */
                data-sequence=""
                style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
              >
                <p className="eyebrow">{b.eyebrow}</p>
                {i === 0 ? (
                  <h1 className="display-xl mt-6">
                    <TitreMasque lignes={b.lignes} className="" />
                  </h1>
                ) : (
                  <p className="display-lg mt-6" role="heading" aria-level={2}>
                    <TitreMasque lignes={b.lignes} className="" />
                  </p>
                )}
                <p className="lede mt-6">{b.texte}</p>
                {i === 0 && <Actions />}
              </div>
            ))}
          </div>
        </div>

        {/* Indicateur de progression de la séquence */}
        <div className="absolute bottom-10 right-[var(--gutter)] hidden items-center gap-3 md:flex">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-steel-500">
            Séquence
          </span>
          <span className="relative block h-16 w-px bg-white/15">
            <span
              ref={railRef}
              className="absolute inset-x-0 top-0 block h-full origin-top bg-volt"
              style={{ transform: 'scaleY(0)' }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function Actions() {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <Link href="/contact/" className="btn btn-primary">
        Demander une démonstration
      </Link>
      <Link href="#produit" className="btn btn-ghost">
        Voir le produit
      </Link>
    </div>
  );
}

export default Stage;
