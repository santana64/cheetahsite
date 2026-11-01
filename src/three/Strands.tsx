'use client';

/**
 * LES LIGNES BUDGÉTAIRES — cœur de la scène signature.
 *
 * Chaque brin est une ligne budgétaire qui court le long d'un axe de temps
 * projet. Sa déviation verticale représente l'écart entre coût prévisionnel et
 * budget à date : au repos le faisceau dérive et se colore (ambre, puis rouge),
 * sous l'effet du scroll il se peigne en treillis et converge vers la porte de
 * fin de projet. Un balayage lumineux parcourt l'axe — la date d'arrêté.
 *
 * Implémentation : géométrie instanciée, position calculée intégralement dans
 * le vertex shader. Aucun calcul par image côté CPU, aucune texture.
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { coreState } from './coreState';

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uOrder;
  uniform float uStrands;
  uniform float uSegments;
  uniform float uLength;
  uniform float uThickness;
  uniform float uHighlight;
  uniform float uReduced;

  attribute vec2 aSeg;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vAcross;

  float hash11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float hash21(vec2 p){
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
               mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  vec3 strandPoint(float s, float t){
    float lane = s / max(uStrands - 1.0, 1.0) - 0.5;
    float band = hash11(s * 3.17);
    float x = (t - 0.5) * uLength;

    // Treillis maîtrisé : couloirs réguliers convergeant vers la porte.
    float yO = lane * 3.05 * (1.0 - 0.62 * t);
    float zO = (band - 0.5) * 2.15 * (1.0 - 0.62 * t);
    yO += sin(uTime * 0.5 + s * 0.45) * 0.035 * (1.0 - uReduced);

    // Dérive : le faisceau part discipliné et s'ouvre avec l'avancement.
    // L'écart est faible au lancement, il se creuse en fin de projet.
    float amp = 0.06 + 3.3 * pow(t, 2.0);
    float n1 = vnoise(vec2(s * 1.9, t * 2.6 - uTime * 0.06)) - 0.5;
    float n2 = vnoise(vec2(s * 1.3 + 19.7, t * 1.7 + uTime * 0.045)) - 0.5;
    float yC = lane * 3.05 + n1 * amp * 2.7;
    float zC = (band - 0.5) * 2.15 + n2 * amp * 1.7;

    float k = smoothstep(0.0, 1.0, uOrder);
    return vec3(x, mix(yC, yO, k), mix(zC, zO, k));
  }

  void main(){
    float s = aSeg.x;
    float seg = aSeg.y;
    float t0 = seg / uSegments;
    float t1 = (seg + 1.0) / uSegments;
    float along = position.x + 0.5;
    float t = mix(t0, t1, along);

    vec3 p0 = strandPoint(s, t0);
    vec3 p1 = strandPoint(s, t1);

    vec4 v0 = modelViewMatrix * vec4(p0, 1.0);
    vec4 v1 = modelViewMatrix * vec4(p1, 1.0);
    vec4 vm = mix(v0, v1, along);

    vec2 d = v1.xy - v0.xy;
    float len = length(d);
    vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
    vec2 nrm = vec2(-dir.y, dir.x);

    float taper = mix(1.0, 0.55, t);
    vm.xy += nrm * position.y * uThickness * taper;

    gl_Position = projectionMatrix * vm;

    // ── Couleur pilotée par l'écart ──────────────────────────────────
    float k = smoothstep(0.0, 1.0, uOrder);
    float dev = abs(hash11(s * 7.77) - 0.5) * 2.0;
    dev = mix(dev, dev * 0.12, k);

    vec3 cOk   = vec3(0.804, 0.961, 0.392);
    vec3 cWarn = vec3(0.949, 0.663, 0.231);
    vec3 cBad  = vec3(0.949, 0.376, 0.357);
    vec3 col = mix(cOk, cWarn, smoothstep(0.26, 0.6, dev));
    col = mix(col, cBad, smoothstep(0.62, 0.95, dev));

    // Mise en avant d'un tiers du faisceau (Cost / Time / Doc).
    float group = floor(s / max(uStrands / 3.0, 1.0));
    float hl = uHighlight < -0.5 ? 1.0 : (abs(group - uHighlight) < 0.5 ? 1.0 : 0.16);

    // Balayage : la date d'arrêté qui parcourt le projet.
    float head = fract(uTime * 0.075);
    float scan = exp(-pow((t - head) * 9.0, 2.0)) * 0.85 * (1.0 - uReduced * 0.8);

    float ends = smoothstep(0.0, 0.07, t) * (1.0 - smoothstep(0.9, 1.0, t) * 0.4);
    vAlpha = (0.3 + 0.46 * k + scan) * ends * hl;
    vColor = col * (1.0 + scan * 1.5);
    vAcross = position.y;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vAcross;

  void main(){
    float edge = smoothstep(0.0, 1.0, 1.0 - abs(vAcross) * 2.0);
    float a = vAlpha * edge;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export function Strands({ strands, segments }: { strands: number; segments: number }) {
  const mesh = useMemo(() => {
    const base = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute('position', base.attributes.position);
    geo.setAttribute('uv', base.attributes.uv);

    const count = strands * segments;
    const seg = new Float32Array(count * 2);
    let i = 0;
    for (let s = 0; s < strands; s++) {
      for (let g = 0; g < segments; g++) {
        seg[i++] = s;
        seg[i++] = g;
      }
    }
    geo.setAttribute('aSeg', new THREE.InstancedBufferAttribute(seg, 2));
    geo.instanceCount = count;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOrder: { value: 0 },
        uStrands: { value: strands },
        uSegments: { value: segments },
        uLength: { value: 12.2 },
        uThickness: { value: 0.05 },
        uHighlight: { value: -1 },
        uReduced: { value: 0 },
      },
    });

    const m = new THREE.Mesh(geo, material);
    m.frustumCulled = false;
    return m;
  }, [strands, segments]);

  // Libération GPU au démontage.
  useEffect(
    () => () => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    },
    [mesh]
  );

  useFrame((_, dt) => {
    const u = (mesh.material as THREE.ShaderMaterial).uniforms;
    if (!coreState.reducedMotion) u.uTime.value += Math.min(dt, 0.05);
    u.uOrder.value = coreState.order;
    u.uHighlight.value = coreState.highlight;
    u.uReduced.value = coreState.reducedMotion ? 1 : 0;
  });

  return <primitive object={mesh} />;
}
