# Control Field V2 — novembre 2026

Le contrat courant est `docs/creative-audit-v2.md` ; les revues sont dans `docs/creative-review-v2-cycle{1,2}.md`.

- Signature : un référentiel spatial partagé et trois géométries2,5D réellement distinctes : trajectoires/volumes Cost, dépendances/jalon Time, versions/preuve Doc. Texte et CTA immédiatement disponibles. Aucune boucleGPU, transformations au pointeur seulement sur souris, animations supprimées en reduced-motion.
- Hiérarchie : hero immersif, comparaison de trajectoires sur bone, rail de modules, lecture produit ciblée, laboratoire financier, méthode et conversion. Pas de capture brute sur l’accueil ; source complète accessible uniquement sur demande.
- Motion :180ms pour feedback,360ms pour état,700ms pour champ, easingcubic-bezier(.22,1,.36,1). Aucune disparition de texte au scroll. Changements géométriques réversibles, labels/valeursDOM à jour sans attendre l’animation.
- Styles : tokens/base dans globals.css ; expériences et secondaires dans leurs CSSmodules. ProductViewport recompose les valeurs source, sans se prétendre capture réelle. Les incertitudes800/798/−3 vs795/784/−11 restent affichées.
- Typographie : mêmes dessins Archivo/InterTight/IBMPlexMono ; axes et poids variables limités aux usages, WOFF2 mono dérivé renomméControlFieldMono selonOFL. Source,licences,recettes etSHA256 dans public/fonts ; scripts/rebuild-fonts.py puis scripts/optimize-fonts.py pour reproduire les artefacts.
- Mobile : sélection de dimension avant la scène, métriques voisines ; résultats du simulateur prioritaires ; Gantt compact avec inspecteur de tâche et grapheDoc vertical. Pas de réduction aveugle du desktop.
- Les anciennes scènesWebGL sont conservées dans le dépôt mais ne sont plus montées par les pages. Elles n’apportaient plus de fonction aux nouveaux instruments.

---

## Historique des versions précédentes
Les règlesV2 ci-dessus priment sur les descriptions antérieures.

# Precision in motion — refonte du 5 novembre 2026

Le contrat courant et le plan sont dans `docs/audit/2026-11-05-refonte.md`.

## Signature de l’accueil
Une coupe technique SVG en trois plans COST / TIME / DOC, sélectionnables au clic, au clavier et au toucher, remplace la séquence WebGL de 320vh. Les métriques sont pédagogiques et explicitement signalées. Pas de boucle de rendu permanente ni de texte dépendant du scroll. La comparaison dépenses–avancement suit dans une section claire. Le code WebGL reste disponible pour les visualisations des pages de module.

## Sources et calculs
Les captures réelles sont conservées et l’accueil montre directement celle de Cost. Les présentations natives sont des reconstitutions, jamais des captures originales. Les sous-totaux calculés des cinq lignes (795 / 784 / −11 k€) sont distincts du récapitulatif source inexpliqué (800 / 798 / −3 k€). Ni des lignes masquées ni un périmètre global ne sont supposés. Les arrondis source restent documentés comme non établis. Les fonctions pures finance/schedule portent les calculs pédagogiques et leurs tests.

## Polices et états
Les trois familles historiques sont désormais locales (`public/fonts/`, licences et provenance jointes). Même palette, grille et règles d’accessibilité ci-dessous. Contrôles 44px minimum ; ratios indéfinis explicités ; réponse du formulaire acceptée uniquement avec acquittement explicite, délai maximal 15s, saisie conservée à l’erreur.

---

## Référence historique — système existant conservé hors accueil
Les sections suivantes décrivent les fondations précédentes. Les dispositions ci-dessus priment pour l’accueil et la présentation des preuves.

# CheetahSoft — direction artistique et système de design

**Precision in motion.**

Ce document fait foi pour toute évolution du site. Il décrit le concept, les
règles visuelles, le système de mouvement et les garde-fous de fiabilité.

---

## 1. Le concept — « L'écart »

L'objet signature n'est ni un globe, ni une sphère de particules, ni un
guépard. C'est **l'écart entre le budget à date et le coût prévisionnel**,
relevé ligne budgétaire par ligne budgétaire, à des dates d'arrêté
successives. Autrement dit : ce que le logiciel calcule, rendu visible.

| Élément | Ce qu'il représente |
|---|---|
| Le plan `y = 0` | Le budget à date (BàD) — la référence contre laquelle on mesure |
| Les cinq rubans | Les lignes budgétaires, à leur hauteur d'écart `E = CP − BàD` |
| L'épaisseur d'un ruban | Le poids budgétaire de la ligne dans le BàD total |
| La surface hachurée | L'écart lui-même : la quantité, pas une illustration de la quantité |
| Les cadres verticaux | Les arrêtés — les dates auxquelles l'écart est relevé |
| Les cubes | Les relevés : un par ligne et par arrêté |

La couleur suit le signe de l'écart : **ambre** au-dessus de la référence
(dépassement), **volt** en dessous (économie), **acier** quand la ligne tient.

### Les valeurs sont réelles

Les cinq rubans portent `COST_LIGNES`, relevé sur la capture du logiciel
versionnée dans ce dépôt. Trois lignes sur cinq ont un écart nul : elles
restent plates, et c'est voulu. Le récit tient précisément à ce que deux
seulement bougent — **+29 sur la Définition**, **−40 sur la Fabrication** —
alors que le total affiche **−3**. L'agrégat est calme, le détail ne l'est
pas. C'est l'argument du produit, et il n'a pas eu besoin d'être inventé.

### La narration, et pourquoi elle ne ment pas

Seuls trois instants sont tracés, parce que seuls trois sont connus :
l'origine (où l'écart est nul par construction, `CP = BàD` avant tout
travail), l'arrêté précédent (`E préc.`) et l'arrêté courant (`E`). Aucune
histoire intermédiaire n'est fabriquée pour faire joli.

Le défilement ne pilote pas une amplitude décorative : il avance **l'horizon
de connaissance**. Au repos, la courbe s'arrête à l'arrêté précédent et sa
dernière valeur connue se prolonge à plat — c'est l'état du projet avant le
nouveau relevé. En défilant, l'arrêté courant tombe et la dérive apparaît.

C'est littéralement le titre de la page : *la dérive se voit avant de se
payer*. Dans le shader, cela tient en une ligne :
`float tc = min(t, mix(0.5, 1.0, uOrder));`

### Règle

Aucun contenu ne dépend d'une animation. La scène est décorative au sens
technique — `aria-hidden`, repli SVG sans WebGL, image unique en mouvement
réduit — même si elle est signifiante au sens narratif.

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
2. **Un `IntersectionObserver` unique** (`ScrollReveal`) pour la révélation
   progressive, via l'attribut `data-revealed`. L'état est porté par un
   attribut et non par une classe : React réécrit `className` à chaque rendu
   et effacerait une classe posée hors de son contrôle.
3. **Les uniformes du shader** pour la scène 3D, pilotés par
   `useScrollProgress` et amortis image par image dans `useFrame`.

GSAP, Framer Motion et Lottie ont été retirés du projet : aucun des besoins
réels ne les justifiait, et ils pesaient sur le chargement initial. Le choix est
réversible, mais il doit être argumenté par un besoin que CSS et les shaders ne
couvrent pas.

### La règle qui prime sur l'effet

**Aucun contenu ne doit dépendre de l'achèvement d'une animation.** Ce n'est
pas une précaution théorique : une timeline d'animation ralentie — onglet en
arrière-plan, outil de capture, appareil throttlé — laisse une transition
bloquée à son état de départ. Un bloc parti d'`opacity: 0` reste alors
invisible pour toujours, et la page compile, ne lève aucune erreur et n'affiche
rien.

Trois dispositifs appliquent cette règle :

1. **Le masquage est conditionnel.** La classe `js-reveal` n'est posée sur
   `<html>` que si le script s'exécute, si l'onglet est au premier plan et si
   l'utilisateur n'a pas demandé moins de mouvement. Sans elle, aucune règle de
   masquage ne s'applique.
2. **Le masquage a une échéance.** Une seconde après la révélation, le script
   pose `data-settled`, qui verrouille l'état visible quelle que soit l'issue
   de la transition.
3. **Les données ne sont jamais masquées.** Dans la grille Cost, seules les
   barres de magnitude s'animent. Une barre figée à zéro ne cache rien ; une
   ligne figée à opacité zéro cache tout.

Le script de vérification contrôle cette règle : tout bloc porteur de texte
présent dans la fenêtre doit être réellement peint. Les temps de la séquence
narrative, dont l'opacité est un contenu piloté par le défilement et non un
effet d'entrée, sont marqués `data-sequence` et explicitement exclus.

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

## 6. Présentation du produit

Les captures brutes sont des preuves : la page d’accueil expose la capture Cost dans le flux et les pages produit la rendent également accessible.

La grille Cheetah Cost et la fiche projet Cheetah Time sont donc **reconstituées
nativement** — mêmes colonnes, mêmes groupes d'en-tête, mêmes valeurs, relevées
une à une sur les captures et conservées dans `src/content/cheetah.ts`. Seul
l'habillage appartient à ce site.

La cohérence des valeurs est vérifiable sur les quatre relations du produit :

```
BàD = BI + Variation
Val. acquise = Avancement physique × BàD
CP  = Dépenses + RàF
E   = CP − BàD          D = E − E préc.
```

La capture d'origine reste accessible derrière un dépliant fermé par défaut sur
chaque page produit. Sans elle, la mention « démontré par capture » ne serait
plus vérifiable par le visiteur : on ne retire pas la preuve, on retire son
encombrement.

**Interdit** : reconstituer un écran dont aucune capture n'existe. Cheetah Doc
n'a donc pas de grille mais un schéma de principe, étiqueté comme tel.

## 7. Règles de fiabilité du contenu

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

## 8. Structure du code

```
src/
  app/            routes — une page par route, métadonnées par page
  components/     chrome, primitives d'interface, composants produit
    home/         la séquence narrative de l'accueil
  content/        source unique de vérité du contenu et des niveaux de preuve
  hooks/          useScrollProgress
  three/          coreState, Ecarts (shaders), Scene (composition)
scripts/
  verify.mjs      parcours multi-largeurs, modes dégradés, clavier, formulaire
  perf.mjs        mesures de laboratoire
```

Séparation stricte : le contenu ne connaît pas la présentation, la scène 3D ne
connaît pas React au-delà de son point de montage, et aucune page ne déclare de
donnée métier en dur.
