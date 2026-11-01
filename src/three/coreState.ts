/**
 * État partagé de la scène « Noyau de contrôle ».
 *
 * Un objet mutable unique, écrit par le scroll (GSAP ScrollTrigger) et le
 * pointeur, lu par la boucle de rendu. Volontairement hors de React : la
 * scène ne doit déclencher aucun re-render pendant le défilement.
 */

export type CoreState = {
  /** 0 = désordre (les lignes dérivent) · 1 = maîtrise (la structure tient). */
  order: number;
  /** Cible vers laquelle `order` est interpolé. */
  orderTarget: number;
  /** 0 = plan large · 1 = plan rapproché sur la porte de convergence. */
  focus: number;
  focusTarget: number;
  /** Parallaxe pointeur, normalisée et bornée. */
  pointerX: number;
  pointerY: number;
  /** Module mis en avant : -1 aucun, 0 Cost, 1 Time, 2 Doc. */
  highlight: number;
  /** Le rendu est-il autorisé (section visible, onglet actif) ? */
  active: boolean;
  /** Mouvement réduit demandé par l’utilisateur. */
  reducedMotion: boolean;
};

export const coreState: CoreState = {
  order: 0,
  orderTarget: 0,
  focus: 0,
  focusTarget: 0,
  pointerX: 0,
  pointerY: 0,
  highlight: -1,
  active: true,
  reducedMotion: false,
};

export function resetCoreState() {
  coreState.order = 0;
  coreState.orderTarget = 0;
  coreState.focus = 0;
  coreState.focusTarget = 0;
  coreState.pointerX = 0;
  coreState.pointerY = 0;
  coreState.highlight = -1;
}

/** Interpolation image-rate indépendante du framerate. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}


/** Détection WebGL non destructive — le contexte de test est libéré. */
export function hasWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}
