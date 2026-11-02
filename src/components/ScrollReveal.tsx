'use client';

/**
 * Révélation progressive au défilement.
 *
 * Deux effets partagent le même déclencheur : `.reveal` (fondu et montée) et
 * `.reveal-mask` (la ligne se découvre derrière un masque, réservé aux titres).
 *
 * Un seul IntersectionObserver pour toute la page, réarmé à chaque changement
 * de route. L'état est porté par l'attribut `data-revealed` et non par une
 * classe : React réécrit `className` à chaque rendu et effacerait une classe
 * posée hors de son contrôle — c'était la cause du premier bug de révélation.
 *
 * En mouvement réduit, tout est révélé immédiatement : aucun contenu ne dépend
 * d'une animation pour être lisible.
 */

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const timers: number[] = [];

    /**
     * Révèle l'élément, puis verrouille son état visible après l'échéance de
     * l'effet. L'animation est un agrément ; la lisibilité, elle, ne dépend
     * d'aucune transition menée à son terme.
     */
    const montrer = (el: HTMLElement) => {
      el.setAttribute('data-revealed', '');
      timers.push(window.setTimeout(() => el.setAttribute('data-settled', ''), 1000));
    };

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .reveal-mask'));
    if (nodes.length === 0) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach(montrer);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const delay = Number(el.dataset.revealDelay ?? 0);
          if (delay > 0) timers.push(window.setTimeout(() => montrer(el), delay));
          else montrer(el);
        }
      },
      // Seuil nul : un bloc plus haut que la fenêtre n'atteindrait jamais un
      // ratio d'intersection élevé. La marge basse déclenche juste avant
      // l'entrée dans le champ.
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );

    for (const el of nodes) {
      // Ce qui est déjà passé au-dessus du pli est montré sans entrée animée.
      if (el.getBoundingClientRect().bottom < 0) montrer(el);
      else io.observe(el);
    }

    // Garde-fou : si l'onglet passe en arrière-plan, la timeline d'animation
    // est ralentie et les transitions en cours peuvent rester bloquées. On
    // retire alors le masquage : mieux vaut perdre l'effet que le contenu.
    const secours = () => {
      if (document.visibilityState !== 'hidden') return;
      document.documentElement.classList.remove('js-reveal');
      nodes.forEach(montrer);
      io.disconnect();
    };
    document.addEventListener('visibilitychange', secours);

    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
      document.removeEventListener('visibilitychange', secours);
    };
  }, [pathname]);

  return null;
}

export default ScrollReveal;
