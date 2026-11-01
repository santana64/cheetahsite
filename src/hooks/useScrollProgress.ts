'use client';

/**
 * Progression de défilement d'un élément, de 0 (son haut atteint le haut du
 * viewport) à 1 (son bas quitte le viewport par le haut).
 *
 * Volontairement sans bibliothèque : une seule écoute `scroll` passive,
 * échantillonnée par requestAnimationFrame, et un callback qui écrit
 * directement dans le DOM ou dans l'état de la scène. Aucun re-render React
 * n'est déclenché pendant le défilement.
 */

import { RefObject, useEffect } from 'react';

export function useScrollProgress(
  ref: RefObject<HTMLElement>,
  onProgress: (p: number) => void,
  enabled = true
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span <= 0 ? (rect.top <= 0 ? 1 : 0) : Math.min(Math.max(-rect.top / span, 0), 1);
      if (Math.abs(p - last) < 0.0004) return;
      last = p;
      onProgress(p);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, onProgress, enabled]);
}
