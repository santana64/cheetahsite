/**
 * LA CAPTURE D'ORIGINE, REPLIÉE.
 *
 * La grille et la fiche produit sont reconstituées nativement pour tenir dans
 * la direction artistique du site. La capture brute reste accessible d'un clic :
 * sans elle, la mention « démontré par capture » ne serait plus vérifiable par
 * le visiteur. Elle est fermée par défaut et ne s'impose à personne.
 */

import Image from 'next/image';

export function PreuveCapture({
  src,
  alt,
  width,
  height,
  legende,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  legende: string;
}) {
  return (
    <details className="group mt-8 border-t border-white/[0.08]">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-steel-400 transition-colors hover:text-volt [&::-webkit-details-marker]:hidden">
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center border border-current transition-transform duration-300 group-open:rotate-45"
          aria-hidden="true"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M4.5 0v9M0 4.5h9" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </span>
        Vérifier : afficher la capture d’écran d’origine
      </summary>

      <figure className="pb-6">
        <div className="overflow-x-auto rounded-sm border border-white/[0.09]">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(max-width: 1280px) 100vw, 1180px"
            loading="lazy"
            className="h-auto w-full min-w-[860px]"
          />
        </div>
        <figcaption className="mt-3 max-w-2xl text-xs leading-relaxed text-steel-500">
          {legende} C’est la source des valeurs affichées plus haut : elles ont été relevées une à
          une, sans arrondi ni retouche.
        </figcaption>
      </figure>
    </details>
  );
}

export default PreuveCapture;
