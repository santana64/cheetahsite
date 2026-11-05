'use client';

/**
 * Composition de la scène signature.
 *
 * Le sujet est l'écart entre le budget à date et le coût prévisionnel, lu
 * ligne budgétaire par ligne budgétaire à des dates d'arrêté successives.
 * Voir `Ecarts.tsx` pour la construction et la provenance des valeurs.
 *
 * La caméra part d'une vue de profil — l'écart s'y lit comme sur un relevé,
 * en hauteur pure — et bascule vers un trois-quarts où les cinq couloirs se
 * séparent en profondeur. Rien n'est animé par React.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Ecarts } from './Ecarts';
import { coreState, damp } from './coreState';

/* ── Sol technique ───────────────────────────────────────────────────── */

function TechFloor() {
  const mesh = useMemo(() => {
    const geo = new THREE.PlaneGeometry(70, 70, 1, 1);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uOrder: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vDist;
        void main(){
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uOrder;
        varying vec2 vUv;
        varying float vDist;
        float axis(float c, float div, float w){
          float f = abs(fract(c * div - 0.5) - 0.5);
          return 1.0 - smoothstep(0.0, w, f);
        }
        float grid(vec2 uv, float div, float w){
          return max(axis(uv.x, div, w), axis(uv.y, div, w));
        }
        void main(){
          float fine = grid(vUv, 96.0, 0.05) * 0.26;
          float coarse = grid(vUv, 20.0, 0.02) * 0.62;
          float l = max(fine, coarse);
          float fade = 1.0 - smoothstep(10.0, 36.0, vDist);
          float centre = 1.0 - smoothstep(0.0, 0.6, distance(vUv, vec2(0.5)));
          float a = l * fade * centre * (0.07 + uOrder * 0.08);
          if (a < 0.003) discard;
          gl_FragColor = vec4(vec3(0.33, 0.39, 0.47), a);
        }
      `,
    });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = -3.4;
    return m;
  }, []);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    },
    [mesh]
  );

  useFrame(() => {
    (mesh.material as THREE.ShaderMaterial).uniforms.uOrder.value = coreState.order;
  });

  return <primitive object={mesh} />;
}

/* ── Chorégraphie de caméra ──────────────────────────────────────────── */

function Rig({ compact }: { compact: boolean }) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    // En mouvement réduit la scène ne s'anime pas : on se place d'emblée
    // dans l'état cible, sur l'unique image rendue.
    const lambda = coreState.reducedMotion ? 1e4 : 2.6;
    coreState.order = damp(coreState.order, coreState.orderTarget, lambda, dt);
    coreState.focus = damp(coreState.focus, coreState.focusTarget, lambda, dt);

    const f = coreState.focus;
    const px = coreState.reducedMotion ? 0 : coreState.pointerX;
    const py = coreState.reducedMotion ? 0 : coreState.pointerY;

    // De profil vers le trois-quarts. En compact la fenêtre est bien plus
    // étroite : on réduit le débattement latéral pour que le sujet reste
    // centré, plutôt que de reculer — reculer le rendait minuscule.
    const x = compact
      ? THREE.MathUtils.lerp(-0.4, 1.2, f) + px * 0.25
      : THREE.MathUtils.lerp(0.2, 4.4, f) + px * 0.55;
    const y = compact
      ? THREE.MathUtils.lerp(0.9, 2.1, f)
      : THREE.MathUtils.lerp(1.05, 2.5, f) + py * 0.34;
    const z = compact
      ? THREE.MathUtils.lerp(11.2, 9.8, f)
      : THREE.MathUtils.lerp(12.9, 9.8, f);
    const cam = coreState.reducedMotion ? 1e4 : 3.2;

    camera.position.set(
      damp(camera.position.x, x, cam, dt),
      damp(camera.position.y, y, cam, dt),
      damp(camera.position.z, z, cam, dt)
    );

    camera.lookAt(
      compact ? THREE.MathUtils.lerp(-0.3, 0.5, f) : THREE.MathUtils.lerp(-0.4, 1.3, f),
      THREE.MathUtils.lerp(-0.15, -0.4, f) + (compact ? 0 : py * 0.16),
      0
    );
  });

  return null;
}

/* ── Scène ───────────────────────────────────────────────────────────── */

export function Scene({ compact }: { compact: boolean }) {
  return (
    <>
      <color attach="background" args={['#06080a']} />
      <fog attach="fog" args={['#06080a', 17, 40]} />

      <Rig compact={compact} />
      <TechFloor />
      <Ecarts compact={compact} />
    </>
  );
}
