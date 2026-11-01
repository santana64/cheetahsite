'use client';

/**
 * Composition de la scène « Noyau de contrôle ».
 *
 * Trois éléments narratifs :
 *   · le faisceau de lignes budgétaires (Strands)
 *   · la porte de fin de projet — le budget à date, cible de la convergence
 *   · trois anneaux de pilotage — Cost, Time, Doc — qui encadrent le faisceau
 *
 * La caméra est chorégraphiée depuis `coreState`, lui-même piloté par le
 * défilement. Rien n'est animé par React.
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Strands } from './Strands';
import { coreState, damp } from './coreState';

const VOLT = '#cdf564';
const AMBER = '#f2a93b';
const CHAMPAGNE = '#e9c9a0';

/* ── Porte de fin de projet ──────────────────────────────────────────── */

function Gate() {
  const group = useRef<THREE.Group>(null);

  const { frame, glow } = useMemo(() => {
    const g = new THREE.Group();
    const h = 1.28;
    const w = 0.92;
    const th = 0.022;
    const mat = new THREE.MeshStandardMaterial({
      color: '#0d1116',
      emissive: new THREE.Color(VOLT),
      emissiveIntensity: 1.5,
      roughness: 0.35,
      metalness: 0.8,
    });
    const bars: [number, number, number, number, number, number][] = [
      [0, h, 0, w * 2 + th, th, th],
      [0, -h, 0, w * 2 + th, th, th],
      [-w, 0, 0, th, h * 2, th],
      [w, 0, 0, th, h * 2, th],
    ];
    bars.forEach(([x, y, z, sx, sy, sz]) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
      bar.position.set(x, y, z);
      g.add(bar);
    });

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 2, h * 2),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(VOLT),
        transparent: true,
        opacity: 0.045,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    g.add(plane);
    g.rotation.y = Math.PI / 2;
    return { frame: g, glow: plane };
  }, []);

  useEffect(
    () => () => {
      frame.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mm = m.material as THREE.Material | undefined;
        mm?.dispose?.();
      });
    },
    [frame]
  );

  useFrame((_, dt) => {
    if (!group.current) return;
    const k = coreState.order;
    group.current.scale.setScalar(0.82 + k * 0.18);
    const target = 0.015 + k * 0.075;
    const m = glow.material as THREE.MeshBasicMaterial;
    m.opacity = damp(m.opacity, target, 4, Math.min(dt, 0.05));
  });

  return (
    <group ref={group} position={[6.1, 0, 0]}>
      <primitive object={frame} />
    </group>
  );
}

/* ── Anneaux de mesure — les arrêtés successifs ──────────────────────
   Chaque anneau est un plan de coupe perpendiculaire à l'axe du projet :
   une date d'arrêté à laquelle le faisceau est mesuré. Plus on avance vers
   la porte, plus l'anneau se resserre — l'incertitude se réduit.           */

const ARRETES = [
  { x: -4.6, r: 1.85, accent: CHAMPAGNE, spin: 0.09 },
  { x: -1.9, r: 1.58, accent: CHAMPAGNE, spin: -0.07 },
  { x: 1.3, r: 1.3, accent: AMBER, spin: 0.055 },
  { x: 3.8, r: 1.04, accent: VOLT, spin: -0.045 },
];

function Rings() {
  const group = useRef<THREE.Group>(null);
  const items = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const k = coreState.order;
    items.current.forEach((g, i) => {
      if (!g) return;
      if (!coreState.reducedMotion) g.rotation.x += ARRETES[i].spin * d;
      // Les anneaux se referment avec la mise en ordre.
      g.scale.setScalar(1 - k * 0.22 * ((i + 1) / ARRETES.length));
    });
  });

  return (
    <group ref={group}>
      {ARRETES.map((a, i) => (
        <group
          key={i}
          position={[a.x, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          ref={(el) => {
            items.current[i] = el;
          }}
        >
          <mesh renderOrder={1}>
            <torusGeometry args={[a.r, 0.011, 6, 128]} />
            <meshStandardMaterial
              color="#0d1116"
              emissive={a.accent}
              emissiveIntensity={0.55}
              roughness={0.32}
              metalness={0.9}
              transparent
              opacity={0.3 + i * 0.13}
            />
          </mesh>
          {/* Quatre repères de graduation sur l'anneau */}
          {[0, 1, 2, 3].map((q) => (
            <mesh
              key={q}
              renderOrder={1}
              position={[
                0,
                Math.cos((q * Math.PI) / 2) * a.r,
                Math.sin((q * Math.PI) / 2) * a.r,
              ]}
            >
              <boxGeometry args={[0.1, 0.055, 0.055]} />
              <meshStandardMaterial
                color="#0d1116"
                emissive={a.accent}
                emissiveIntensity={1.1}
                roughness={0.3}
                metalness={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ── Sol technique ───────────────────────────────────────────────────── */

function TechFloor() {
  const mesh = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 1, 1);
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
          float fine = grid(vUv, 90.0, 0.055) * 0.3;
          float coarse = grid(vUv, 18.0, 0.022) * 0.7;
          float l = max(fine, coarse);
          float fade = 1.0 - smoothstep(10.0, 34.0, vDist);
          float centre = 1.0 - smoothstep(0.0, 0.62, distance(vUv, vec2(0.5)));
          float a = l * fade * centre * (0.1 + uOrder * 0.14);
          if (a < 0.003) discard;
          gl_FragColor = vec4(mix(vec3(0.36,0.42,0.5), vec3(0.8,0.96,0.39), uOrder * 0.5), a);
        }
      `,
    });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = -3.3;
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

function Rig() {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));

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

    // Plan large désordonné → plan de trois-quarts sur la porte.
    // Vue perpendiculaire au faisceau au repos, puis glissement vers la
    // porte de fin de projet. Caméra centrée sur l'axe pour que la
    // divergence lue à l'écran soit celle du modèle, pas de la perspective.
    const x = THREE.MathUtils.lerp(1.6, 4.0, f) + px * 0.7;
    const y = THREE.MathUtils.lerp(2.0, 0.75, f) + py * 0.42;
    const z = THREE.MathUtils.lerp(11.8, 8.2, f);
    const cam = coreState.reducedMotion ? 1e4 : 3.2;

    camera.position.set(
      damp(camera.position.x, x, cam, dt),
      damp(camera.position.y, y, cam, dt),
      damp(camera.position.z, z, cam, dt)
    );

    look.current.set(
      damp(look.current.x, THREE.MathUtils.lerp(1.6, 4.8, f), cam, dt),
      damp(look.current.y, -0.25 + py * 0.2, cam, dt),
      0
    );
    camera.lookAt(look.current);
  });

  return null;
}

/* ── Scène ───────────────────────────────────────────────────────────── */

export function Scene({ strands, segments }: { strands: number; segments: number }) {
  return (
    <>
      <color attach="background" args={['#06080a']} />
      <fog attach="fog" args={['#06080a', 14, 34]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[7, 3, 4]} intensity={28} color={VOLT} distance={26} decay={2} />
      <pointLight position={[-6, -2, 5]} intensity={16} color="#5b7fa6" distance={26} decay={2} />

      <Rig />
      <TechFloor />
      <Rings />
      <Strands strands={strands} segments={segments} />
      <Gate />
    </>
  );
}
