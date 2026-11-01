'use client';

/**
 * Enveloppe de la scène signature.
 *
 * Responsabilités : détection WebGL, mouvement réduit, budget GPU selon
 * l'appareil, mise en pause hors écran et onglet inactif, perte de contexte
 * WebGL, et repli visuel sans WebGL.
 */

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Scene } from '@/three/Scene';
import { coreState, hasWebGL } from '@/three/coreState';
import { CoreFallback } from './CoreFallback';

function Invalidator({ reduced }: { reduced: boolean }) {
  const { invalidate } = useThree();
  useEffect(() => {
    if (!reduced) return;
    // Un seul rendu : la scène s'affiche dans son état stable, sans animation.
    const id = window.setTimeout(() => invalidate(), 50);
    return () => window.clearTimeout(id);
  }, [reduced, invalidate]);
  return null;
}

export function ControlCore({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [support, setSupport] = useState<'pending' | 'ok' | 'none'>('pending');
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqSize = window.matchMedia('(max-width: 820px)');

    const syncMotion = () => {
      setReduced(mqMotion.matches);
      coreState.reducedMotion = mqMotion.matches;
      if (mqMotion.matches) {
        coreState.order = 1;
        coreState.orderTarget = 1;
        coreState.focus = 0.5;
        coreState.focusTarget = 0.5;
      }
    };
    const syncSize = () => setSmall(mqSize.matches);

    syncMotion();
    syncSize();
    mqMotion.addEventListener('change', syncMotion);
    mqSize.addEventListener('change', syncSize);
    setSupport(hasWebGL() ? 'ok' : 'none');

    return () => {
      mqMotion.removeEventListener('change', syncMotion);
      mqSize.removeEventListener('change', syncSize);
    };
  }, []);

  // Rendu uniquement quand la scène est visible et l'onglet actif.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let onScreen = true;
    const update = () => {
      const on = onScreen && !document.hidden;
      coreState.active = on;
      setActive(on);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        update();
      },
      { rootMargin: '120px' }
    );
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  // Parallaxe pointeur, bornée et désactivée en mouvement réduit.
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      coreState.pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      coreState.pointerY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  if (support === 'none') return <CoreFallback className={className} />;
  if (support === 'pending') return <div className={className} aria-hidden="true" />;

  const strands = small ? 13 : 20;
  const segments = small ? 30 : 54;

  return (
    <div ref={host} className={className} aria-hidden="true">
      <Canvas
        dpr={small ? [1, 1.4] : [1, 1.75]}
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        gl={{
          antialias: !small,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ fov: small ? 56 : 42, near: 0.1, far: 90, position: [1.6, 2.0, 11.8] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.setClearColor('#06080a', 1);
          const canvas = gl.domElement;
          canvas.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault();
              setSupport('none');
            },
            { once: true }
          );
        }}
      >
        <Invalidator reduced={reduced} />
        <Scene strands={strands} segments={segments} />
      </Canvas>
    </div>
  );
}

export default ControlCore;
