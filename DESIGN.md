# CheetahSoft — direction artistique et système de design

**Precision in motion.**

Ce document fait foi pour toute évolution du site. Il décrit le concept, les
règles visuelles, le système de mouvement et les garde-fous de fiabilité.

---

## 1. Le concept — « Le noyau de contrôle »

L'objet signature n'est ni un globe, ni une sphère de particules, ni un
guépard. C'est **un faisceau de lignes budgétaires qui court le long d'un axe
de temps projet**.

Chaque brin représente une ligne budgétaire. Sa déviation verticale représente
l'écart entre coût prévisionnel et budget à date, et sa couleur suit cet écart :
volt quand la ligne tient, ambre quand elle glisse, rouge quand elle dérive.

Quatre éléments composent la scène :

| Élément | Ce qu'il représente |
|---|---|
| Le faisceau | Les lignes budgétaires du projet, de l'origine à la fin |
| Les anneaux de mesure | Les arrêtés successifs — chacun plus resserré que le précédent |
| La porte terminale | Le budget à date : la cible sur laquelle le projet doit converger |
| Le balayage lumineux | La date d'arrêté qui parcourt le projet |

### La narration en trois temps

Le défilement ne fait pas défiler des effets : il fait passer le système d'un
état à un autre.

1. **Le désordre** — le faisceau s'ouvre, l'amplitude croît avec l'avancement,
   les couleurs partent vers l'ambre et le rouge. Message : *la dérive se voit
   avant de se payer*.
2. **La mesure** — la caméra glisse vers la porte, le faisceau commence à se
   peigner. Message : *les dépenses sont à jour, l'avancement ne l'est pas*.
3. **La maîtrise** — le faisceau devient un treillis discipliné qui converge
   dans la porte, les écarts se résorbent. Message : *une référence, une
   mesure, une projection*.

La mise en ordre n'est pas décorative : `uOrder` interpole littéralement entre
une position bruitée et une position de treillis, dans le vertex shader.

---

## 2. Palette

Graphite et obsidienne pour la base, un accent de précision, un accent de
temporalité, un accent de matière. Pas d'empilement de néons.

| Jeton | Valeur | Usage |
|---|---|---|
| `--ink-900` | `#06080A` | Fond principal |
| `--ink-850` | `#090C10` | Fond de section alternée |
| `--ink-800` → `--ink-400` | `#0D1116` → `#2E3946` | Surfaces, bordures |
| `--paper` | `#EEF2F6` | Texte principal |
| `--steel-200/300/400/500` | `#C2CCD8` → `#55616F` | Hiérarchie de texte secondaire |
| `--bone` / `--bone-light` | `#ECEAE4` / `#F4F2EC` | **Sections claires** — rupture de rythme |
| `--volt` | `#CDF564` | Accent de précision · Cheetah Cost · actions primaires |
| `--amber` | `#F2A93B` | Temporalité · Cheetah Time · avertissement |
| `--champagne` | `#E9C9A0` | Matière, archive · Cheetah Doc |
| `--drift` | `#F2605B` | Signal de dérive |

**Règle de rythme** : aucune succession de plus de deux sections sombres sans
une section claire. Les actes « produit », « lexique », « positionnement » et
« tarifs additionnels » sont sur fond bone. C'est ce qui empêche le site de
devenir une suite de fonds noirs.

**Règle d'accent** : le volt ne sert qu'à trois choses — l'action primaire,
l'état conforme, et un mot par titre au maximum. Jamais de grand aplat.

---

## 3. Typographie

| Rôle | Fonte | Usage |
|---|---|---|
| Display | **Archivo** 700–900 | Titres, interlignage 0.88–1.02, approche −0.03 à −0.045 em |
| Interface | **Inter Tight** 400–700 | Corps, navigation, étiquettes |
| Données | **IBM Plex Mono** 400–600 | Chiffres, codes de colonnes, étiquettes techniques, fil d'ariane |

Le monospace n'est pas un effet de style : il marque tout ce qui est une
donnée, un code de colonne ou une référence. C'est le lien visuel entre le site
et la grille du produit.

Classes : `.display-xl`, `.display-lg`, `.display-md`, `.display-sm`, `.lede`,
`.body-copy`, `.eyebrow`, `.num`. Toutes dimensionnées en `clamp()`.

**Interdit** : une page faite de blocs centrés identiques. Chaque section a sa
propre structure — colonnes asymétriques, listes à filet, rails horizontaux,
grilles éditoriales.

---

## 4. Système de mouvement

Une seule bibliothèque d'animation : **aucune**. Le mouvement repose sur trois
mécanismes, chacun choisi pour son coût :

1. **Transitions CSS** pour les états d'interface (`--ease-cheetah`,
   `cubic-bezier(0.22, 1, 0.36, 1)`).
2. **Un observateur de défilement unique** (`ScrollReveal`) pour la révélation
   progressive, via l'attribut `data-revealed`.
3. **Les uniformes du shader** pour la scène 3D, pilotés par
   `useScrollProgress` et amortis image par image dans `useFrame`.

GSAP, Framer Motion et Lottie ont été retirés du projet : aucun des besoins
réels ne les justifiait, et ils pesaient sur le chargement initial. Le choix est
réversible, mais il doit être argumenté par un besoin que CSS et les shaders ne
couvrent pas.

### Garde-fous

- Le défilement reste natif. Pas de capture, pas d'accélération.
- `prefers-reduced-motion` : la séquence devient une page en flux normal, la
  scène est rendue **une seule fois** dans son état stable, et tous les
  contenus sont visibles sans animation.
- Aucun contenu ne dépend d'une animation pour être lisible.
- Rien ne bouge en permanence sans raison : hors écran ou onglet inactif, la
  boucle de rendu est suspendue (`frameloop="never"`).

---

## 5. Budget technique de la scène 3D

| Paramètre | Grand écran | Petit écran |
|---|---|---|
| Brins | 20 | 13 |
| Segments par brin | 54 | 30 |
| Instances | 1 080 | 390 |
| Rapport de pixels | plafonné à 1,75 | plafonné à 1,4 |
| Anticrénelage | activé | désactivé |
| Champ de vision | 42° | 56° |

- La position des brins est calculée **intégralement dans le vertex shader** :
  aucun calcul de matrice par image côté processeur, aucune texture.
- Le module `three` est en import dynamique : il ne pèse pas sur le chargement
  initial et n'est demandé que sur les pages qui affichent la scène.
- Perte de contexte WebGL : interceptée, bascule vers le repli SVG.
- Absence de WebGL : repli SVG reprenant la même composition.

---

## 6. Règles de fiabilité du contenu

Ces règles sont structurelles, pas éditoriales : elles sont encodées dans
`src/content/cheetah.ts` et rendues par le composant `ProofTag`.

| Marqueur | Signification |
|---|---|
| **Démontré** | Visible sur une capture produit versionnée dans `public/` |
| **Décrit** | Annoncé par l'éditeur, sans démonstration jointe au site |
| **En développement** | Annoncé, non disponible, jamais inclus dans une offre |

Sont **interdits** sur ce site tant qu'une source n'est pas fournie :
certifications, pourcentages de disponibilité, objectifs de reprise, logos
clients, témoignages, chiffres de performance commerciale, dates d'ouverture
de modules.

Les modules de démonstration à données fictives (simulateur de coût
prévisionnel) portent une étiquette visible et une phrase explicite.

---

## 7. Structure du code

```
src/
  app/            routes — une page par route, métadonnées par page
  components/     chrome, primitives d'interface, composants produit
    home/         la séquence narrative de l'accueil
  content/        source unique de vérité du contenu et des niveaux de preuve
  hooks/          useScrollProgress
  three/          coreState, Strands (shader), Scene (composition)
scripts/
  verify.mjs      parcours multi-largeurs, modes dégradés, clavier, formulaire
  perf.mjs        mesures de laboratoire
```

Séparation stricte : le contenu ne connaît pas la présentation, la scène 3D ne
connaît pas React au-delà de son point de montage, et aucune page ne déclare de
donnée métier en dur.
