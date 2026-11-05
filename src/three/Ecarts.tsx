'use client';

/**
 * L'écart — la scène signature.
 *
 * Elle ne décore pas : elle montre ce que Cheetah Cost calcule.
 *
 *   · l'axe horizontal est le temps, jalonné par les arrêtés ;
 *   · le plan y = 0 est le budget à date (BàD), la référence ;
 *   · chaque ruban est une ligne budgétaire, à sa hauteur d'écart E = CP − BàD ;
 *   · la surface entre le ruban et la référence EST l'écart. C'est l'objet du
 *     produit, et c'est ce qui se voit avant de se payer.
 *
 * Les valeurs viennent de `COST_LIGNES`, relevées sur la capture du logiciel.
 * Rien n'est inventé pour le décor : une ligne sans écart reste plate, et
 * trois des cinq le sont. Le récit tient à ce que deux seulement bougent —
 * +29 sur la Définition, −40 sur la Fabrication — alors que le total affiche
 * −3. L'agrégat est calme, le détail ne l'est pas.
 *
 * Seuls trois instants sont tracés, parce que seuls trois sont connus :
 * l'origine (où l'écart est nul par construction), l'arrêté précédent
 * (E préc.) et l'arrêté courant (E). Aucune histoire intermédiaire n'est
 * fabriquée.
 */

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COST_LIGNES } from '@/content/cheetah';
import { coreState } from './coreState';

/* ── Repères du dessin ───────────────────────────────────────────────── */

/** Abscisses des trois arrêtés connus : origine, E préc., E. */
export const X_ARRETES = [-6.4, -0.4, 5.6] as const;
const X0 = X_ARRETES[0];
const X1 = X_ARRETES[2];
const LONGUEUR = X1 - X0;

/** kEUR → unités de scène. 40 kEUR ≈ 1,7 unité. */
const ECHELLE = 0.042;

/** Écartement des couloirs en profondeur, une ligne budgétaire par couloir. */
const PAS_COULOIR = 1.55;

const VOLT = new THREE.Color('#cdf564');
const AMBER = new THREE.Color('#f2a93b');
const STEEL = new THREE.Color('#6f8296');

const BAD_TOTAL = COST_LIGNES.reduce((s, l) => s + l.bad, 0);

type Couloir = {
  code: string;
  /** (origine, E préc., E) en unités de scène. */
  points: THREE.Vector3;
  z: number;
  /** Épaisseur du ruban, proportionnelle au poids budgétaire de la ligne. */
  rayon: number;
  couleur: THREE.Color;
  /** Une ligne à écart nul reste présente, mais sourde. */
  actif: boolean;
};

const COULOIRS: Couloir[] = COST_LIGNES.map((l, i) => {
  const e = l.e ?? 0;
  const ePrec = l.ePrec ?? 0;
  return {
    code: l.code,
    points: new THREE.Vector3(0, ePrec * ECHELLE, e * ECHELLE),
    z: (i - (COST_LIGNES.length - 1) / 2) * PAS_COULOIR,
    rayon: 0.028 + (l.bad / BAD_TOTAL) * 0.19,
    couleur: e > 0 ? AMBER : e < 0 ? VOLT : STEEL,
    actif: e !== 0,
  };
});

/**
 * Hauteur de l'écart au paramètre t ∈ [0,1], même loi que dans les shaders.
 *
 * `order` est l'horizon de connaissance : à 0 on ne lit que jusqu'à l'arrêté
 * précédent et la dernière valeur connue se prolonge à plat ; à 1 l'arrêté
 * courant est tombé et la dérive apparaît. C'est le récit du produit, et il
 * ne demande d'inventer aucune valeur.
 */
function ecartA(t: number, p: THREE.Vector3, order: number) {
  const tc = Math.min(t, THREE.MathUtils.lerp(0.5, 1, order));
  return tc < 0.5
    ? THREE.MathUtils.lerp(p.x, p.y, THREE.MathUtils.smoothstep(tc, 0, 0.5))
    : THREE.MathUtils.lerp(p.y, p.z, THREE.MathUtils.smoothstep(tc, 0.5, 1));
}

/* ── Fragments GLSL partagés ─────────────────────────────────────────── */

const GLSL_ECART = /* glsl */ `
  uniform float uOrder;
  uniform vec3  uPts;
  float ecartA(float t){
    // Horizon de connaissance : voir le commentaire de la fonction jumelle
    // côté JavaScript. Au repos la courbe s'arrête à l'arrêté précédent.
    float tc = min(t, mix(0.5, 1.0, uOrder));
    return tc < 0.5
      ? mix(uPts.x, uPts.y, smoothstep(0.0, 0.5, tc))
      : mix(uPts.y, uPts.z, smoothstep(0.5, 1.0, tc));
  }
`;

/* ── Le ruban : la trajectoire du coût prévisionnel ──────────────────── */

function rubanMateriau(c: Couloir) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uOrder: { value: 0 },
      uPts: { value: c.points },
      uColor: { value: c.couleur },
      uActif: { value: c.actif ? 1 : 0 },
      uFocus: { value: 0 },
    },
    vertexShader: /* glsl */ `
      ${GLSL_ECART}
      varying float vT;
      void main(){
        vT = uv.x;
        vec3 p = position;
        p.y += ecartA(vT);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3  uColor;
      uniform float uOrder;
      uniform float uActif;
      uniform float uFocus;
      varying float vT;
      void main(){
        // La tête du ruban — l'arrêté courant — porte la lecture.
        float tete = smoothstep(0.45, 1.0, vT);
        float corps = 0.30 + 0.70 * tete;
        float sourd = mix(0.52, 1.0, uActif);
        float a = corps * sourd * (0.64 + 0.36 * uOrder) * (0.75 + 0.35 * uFocus);
        gl_FragColor = vec4(uColor * corps, a);
      }
    `,
  });
}

/* ── La surface d'écart : la quantité elle-même ──────────────────────── */

function surfaceMateriau(c: Couloir) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uOrder: { value: 0 },
      uPts: { value: c.points },
      uColor: { value: c.couleur },
      uFocus: { value: 0 },
    },
    vertexShader: /* glsl */ `
      ${GLSL_ECART}
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec3 p = position;
        // position.y vaut déjà 0 au plan de référence et 1 au ruban.
        p.y = ecartA(uv.x) * uv.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3  uColor;
      uniform float uOrder;
      uniform float uFocus;
      varying vec2 vUv;
      void main(){
        // Dense contre le ruban, effacée contre la référence : l'œil lit la
        // hauteur, pas la surface.
        float v = pow(vUv.y, 1.7);
        // Hachures verticales — une lecture, pas un dégradé décoratif.
        float trame = 0.78 + 0.22 * step(0.5, fract(vUv.x * 58.0));
        float entree = smoothstep(0.02, 0.22, vUv.x);
        float a = v * trame * entree * 0.33 * (0.7 + 0.3 * uOrder) * (0.8 + 0.5 * uFocus);
        if (a < 0.002) discard;
        gl_FragColor = vec4(uColor, a);
      }
    `,
  });
}

/* ── Rubans et surfaces ──────────────────────────────────────────────── */

function Lignes() {
  const objets = useMemo(() => {
    return COULOIRS.map((c) => {
      const courbe = new THREE.LineCurve3(
        new THREE.Vector3(X0, 0, 0),
        new THREE.Vector3(X1, 0, 0)
      );
      const ruban = new THREE.Mesh(
        new THREE.TubeGeometry(courbe, 150, c.rayon, 7, false),
        rubanMateriau(c)
      );
      ruban.position.z = c.z;
      ruban.frustumCulled = false;

      // Plan vertical sous le ruban : y ∈ [0,1] avant déformation.
      const geoSurface = new THREE.PlaneGeometry(LONGUEUR, 1, 150, 1);
      geoSurface.translate(X0 + LONGUEUR / 2, 0.5, 0);
      const surface = new THREE.Mesh(geoSurface, surfaceMateriau(c));
      surface.position.z = c.z;
      surface.frustumCulled = false;
      surface.renderOrder = -1;

      return { ruban, surface, actif: c.actif };
    });
  }, []);

  useEffect(
    () => () => {
      objets.forEach(({ ruban, surface }) => {
        ruban.geometry.dispose();
        (ruban.material as THREE.Material).dispose();
        surface.geometry.dispose();
        (surface.material as THREE.Material).dispose();
      });
    },
    [objets]
  );

  useFrame(() => {
    const k = coreState.order;
    // Cheetah Cost mis en avant : l'écart se charge.
    const focus = coreState.highlight === 0 ? 1 : 0;
    objets.forEach(({ ruban, surface }) => {
      const mr = (ruban.material as THREE.ShaderMaterial).uniforms;
      const ms = (surface.material as THREE.ShaderMaterial).uniforms;
      mr.uOrder.value = k;
      ms.uOrder.value = k;
      mr.uFocus.value = focus;
      ms.uFocus.value = focus;
    });
  });

  return (
    <>
      {objets.map(({ ruban, surface }, i) => (
        <group key={i}>
          <primitive object={surface} />
          <primitive object={ruban} />
        </group>
      ))}
    </>
  );
}

/* ── Le plan de référence : le budget à date ─────────────────────────── */

function Reference() {
  const objet = useMemo(() => {
    const pts: number[] = [];
    // Une ligne de référence par couloir — c'est contre elle qu'on mesure.
    COULOIRS.forEach((c) => {
      pts.push(X0, 0, c.z, X1, 0, c.z);
    });
    // Traverses aux arrêtés, pour que le plan se lise comme une grille.
    const zMin = COULOIRS[0].z - 0.5;
    const zMax = COULOIRS[COULOIRS.length - 1].z + 0.5;
    X_ARRETES.forEach((x) => {
      pts.push(x, 0, zMin, x, 0, zMax);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#5d7086',
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    return new THREE.LineSegments(geo, mat);
  }, []);

  useEffect(
    () => () => {
      objet.geometry.dispose();
      (objet.material as THREE.Material).dispose();
    },
    [objet]
  );

  return <primitive object={objet} />;
}

/* ── Les arrêtés : les dates où l'écart est relevé ───────────────────── */

function Arretes() {
  const cadres = useMemo(() => {
    const zMin = COULOIRS[0].z - 0.85;
    const zMax = COULOIRS[COULOIRS.length - 1].z + 0.85;
    const yBas = -2.3;
    const yHaut = 1.9;

    return X_ARRETES.map((x, i) => {
      const pts = [
        x, yBas, zMin, x, yHaut, zMin,
        x, yHaut, zMin, x, yHaut, zMax,
        x, yHaut, zMax, x, yBas, zMax,
        x, yBas, zMax, x, yBas, zMin,
      ];
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mat = new THREE.LineBasicMaterial({
        color: '#7d8ea1',
        transparent: true,
        // Le dernier arrêté est celui qu'on lit : il porte le plus.
        opacity: 0.1 + i * 0.1,
        depthWrite: false,
      });
      return new THREE.LineSegments(geo, mat);
    });
  }, []);

  // Marqueurs de relevé : un cube posé sur chaque ruban, à chaque arrêté.
  const marqueurs = useMemo(() => {
    const items: { mesh: THREE.Mesh; t: number; points: THREE.Vector3 }[] = [];
    const geo = new THREE.BoxGeometry(0.075, 0.075, 0.075);
    COULOIRS.forEach((c) => {
      X_ARRETES.forEach((x, j) => {
        const t = (x - X0) / LONGUEUR;
        const mat = new THREE.MeshBasicMaterial({
          color: c.couleur,
          transparent: true,
          opacity: c.actif ? 0.35 + j * 0.3 : 0.18,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, c.z);
        items.push({ mesh, t, points: c.points });
      });
    });
    return { items, geo };
  }, []);

  useEffect(
    () => () => {
      cadres.forEach((c) => {
        c.geometry.dispose();
        (c.material as THREE.Material).dispose();
      });
      marqueurs.geo.dispose();
      marqueurs.items.forEach(({ mesh }) => (mesh.material as THREE.Material).dispose());
    },
    [cadres, marqueurs]
  );

  useFrame(() => {
    const k = coreState.order;
    marqueurs.items.forEach(({ mesh, t, points }) => {
      mesh.position.y = ecartA(t, points, k);
    });
  });

  return (
    <>
      {cadres.map((c, i) => (
        <primitive key={`c${i}`} object={c} />
      ))}
      {marqueurs.items.map(({ mesh }, i) => (
        <primitive key={`m${i}`} object={mesh} />
      ))}
    </>
  );
}

/* ── Ensemble ────────────────────────────────────────────────────────── */

export function Ecarts({ compact }: { compact: boolean }) {
  const groupe = useRef<THREE.Group>(null);
  const echelle = compact ? 0.85 : 1;

  return (
    <group ref={groupe} scale={echelle}>
      <Reference />
      <Lignes />
      <Arretes />
    </group>
  );
}
