'use client';

/**
 * Révélation progressive au défilement.
 *
 * Un seul IntersectionObserver pour toute la page, réappliqué à chaque
 * changement de route. En mouvement réduit, tout est révélé immédiatement —
 * aucun contenu ne dépend d'une animation pour être lisible.
 */

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // L'état de révélation est porté par un attribut de données et non par
    // une classe : React réécrit `className` à chaque rendu et effacerait
    // une classe ajoutée hors de son contrôle.
    const montrer = (el: HTMLElement) => el.setAttribute('data-revealed', '');

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (nodes.length === 0) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      nodes.forEach(montrer);
      return;
    }

    let pending = nodes;
    let frame = 0;
    const timers: number[] = [];

    const check = () => {
      frame = 0;
      const limit = window.innerHeight * 0.92;
      const reste: HTMLElement[] = [];
      for (const el of pending) {
        const rect = el.getBoundingClientRect();
        // Visible dès que le haut de l'élément entre dans la fenêtre, ou
        // qu'une partie de l'élément est déjà à l'écran.
        if (rect.top < limit && rect.bottom > 0) {
          const delay = Number(el.dataset.revealDelay ?? 0);
          if (delay > 0) timers.push(window.setTimeout(() => montrer(el), delay));
          else montrer(el);
        } else if (rect.top >= limit) {
          reste.push(el);
        } else {
          // Déjà dépassé vers le haut : révélé sans animation d'entrée.
          montrer(el);
        }
      }
      pending = reste;
      if (pending.length === 0) detach();
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    const detach = () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };

    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      detach();
    };
  }, [pathname]);

  return null;
}

export default ScrollReveal;
