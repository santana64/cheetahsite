'use client';

/**
 * LA SCÈNE SIGNATURE, DÉCLINÉE PAR MODULE.
 *
 * Même faisceau que sur l'accueil, mais figé dans son état maîtrisé et
 * concentré sur le tiers de brins qui correspond au module affiché : Cost,
 * Time ou Doc. Les deux autres tiers s'effacent sans disparaître — le propos
 * est qu'un module est une vue sur un système, pas un produit isolé.
 */

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { coreState, resetCoreState } from '@/three/coreState';
import CoreFallback from '../CoreFallback';

const ControlCore = dynamic(() => import('../ControlCore').then((m) => m.ControlCore), {
  ssr: false,
  loading: () => <CoreFallback className="h-full w-full" />,
});

const INDEX: Record<string, number> = { cost: 0, time: 1, doc: 2 };

export function ModuleCore({ slug, className = '' }: { slug: string; className?: string }) {
  useEffect(() => {
    coreState.orderTarget = 1;
    coreState.focusTarget = 0.62;
    coreState.highlight = INDEX[slug] ?? -1;
    return () => resetCoreState();
  }, [slug]);

  return <ControlCore className={className} />;
}

export default ModuleCore;
