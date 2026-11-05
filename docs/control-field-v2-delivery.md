# CheetahSoft — Control Field V2

## A. Transformation livrée

Travail sur `feat/control-field-v2`, à partir du commit 264cc795152b2924224a547e2d09b28b3d362705. L’état initial était propre ; la branche distante main a été vérifiée à cette référence. Cette V2 n’est ni fusionnée dans main ni poussée ni déployée. Aucun DNS, destinataire ou service de production n’a été modifié.

L’accueil quitte le dispositif « carte + couches similaires » pour un champ instrumental occupant la composition : repères spatiaux, plateaux projetés, trajectoires, volumes et annotations. Le récit mène de l’anticipation à la divergence dépenses/production, puis à une lecture produit ciblée et à la décision commerciale. La capture brute précédemment retirée n’est pas réapparue sur l’accueil.

Le socle métier reste en place : routes, contenu source, fonctions de calcul, trois modes d’estimation, formulation des incertitudes, prix, formulaire et métadonnées. Les améliorations sont applicatives et visuelles ; elles ne prétendent pas ajouter des fonctions au logiciel Cheetah lui-même.

## B. Direction et choix technique

**The Control Field — un référentiel, plusieurs lectures.** Palette conservée : graphite/obsidienne, papier/bone, volt économique, amber temporel, champagne documentaire, rouge uniquement pour un écart défavorable. Titres Archivo, interface Inter Tight et données issues des dessins IBM Plex Mono.

Deux approches ont été examinées dans [l’audit](creative-audit-v2.md). WebGL aurait apporté une caméra et des matériaux physiques, avec chargement Three, fallback et budgetGPU supplémentaires. Le champ 2,5D SVG/CSS a été retenu pour ses lignes de mesure, ses relations et sa profondeur contrôlée, accessibles sans GPU. Il ne dépend pas d’un rendu permanent.

Les modes du hero changent réellement de structure :
- **Cost** : cinq estimations fictives et volumes, référence800k€, dernière projection920k€, écart120k€ ; la projection du hero repose explicitement sur420k€ dépensés +500k€ de RàF saisi.
- **Time** : trois tâches FS, baseline 24 jours, durées8+20+8, fin 36 et décalage 12 jours. Les axes, liaisons et jalons changent avec le mode.
- **Doc** : trois feuilles/révisions projetées, de l’émission à la référence reliée à une décision. Représentation de principe, pas capture du produit.

Sélection tactile/clavier, étataria-pressed, explicationDOM et métriques immédiates. Introduction brève limitée à la géométrie, faible profondeur au pointeur souris, transitions réversibles, aucune animation de texte bloquante. Reduced-motion supprime ces effets. Le scroll reste natif ; les sections alternent les densités et les contrastes sans séquence imposée.

## C. Composants et fichiers

| Responsabilité | Principaux fichiers |
|---|---|
| Hero et géométrie | `src/components/home/Stage.tsx`, `ControlField.tsx`, `control-field.module.css` |
| Comparaison pédagogique | `home/VarianceReading.tsx`, `variance-reading.module.css` |
| Accueil et rail de modules | `src/app/page.tsx`, `home/home.module.css` |
| Lecture produit fidèle | `product/ProductViewport.tsx`, `ProductViewport.module.css`, `components/ProductPage.tsx` |
| Laboratoire Cost | `ForecastSimulator.tsx`, `ForecastSimulator.module.css` |
| Dépendances et traçabilité | `product/ProjectTimeline.tsx`, `DocumentVersionFlow.tsx`, `demonstrations.module.css` |
| Source Time responsive | `product/TimeCard.tsx` |
| Secondaires et navigation | `components/ui.tsx`, `ui.module.css`, `Header.tsx`, `Footer.tsx`, pages solutions/plateforme/méthodologie/tarifs/roadmap/contact |
| Polices optimisées | `public/fonts/variants.json`, cinq nouveaux WOFF2, `scripts/optimize-fonts.py`, `app/layout.tsx` |
| Contrôles | `scripts/verify-v2.mjs`, adaptation de la suite `verify.mjs` pour ouvrir la comparaison détaillée |

Les styles d’expérience sont dans leurs CSSmodules. Les règles globales de l’ancien hero et les sélecteurs devenus inutilisés ont été retirés. Les tokens motion/base restent globaux. Aucune dépendance applicative ni version du lockfile n’a changé.

## D. Démonstrations

### Cost
La comparaison montre consommation et production comme deux trajectoires **illustratives**, jamais comme un historique projet réel. Dépenses fixes420k€, budget800k€, avancement variable : valeur acquise=budget×avancement, projection=dépenses÷avancement sous hypothèse de performance constante. Les signes, la légende et les labels suivent l’état ; les deux valeurs restent séparées quand les trajectoires se croisent. La comparaison des montants garde une échelle commune.

`ProductViewport` sélectionne budget, avancement, prévision ou écart. Les colonnes pertinentes et une lecture LB02 changent, à partir des seules valeurs de la source. Le tableau est plus ciblé qu’une grille de douze colonnes. Une source complète reste accessible sur demande dans un dépliant fermé ; aucune fausse capture n’a été fabriquée.

Le simulateur conserve les modes manuel, au budget et corrigé de la performance. Hypothèses hiérarchisées, résultat prioritaire et résumé proche des curseurs sur mobile ; formules détaillées disponibles. Le pas du contrôle « écart précédent », initialement9k€, est désormais1 pour éviter une valeur incompatible avec un pas10. Aucun calcul n’a été modifié.

La contradiction historique reste explicite : **795/784/−11k€** pour cinq lignes, contre **800/798/−3k€** dans le bandeau, avec798−800=−2. Aucun périmètre supplémentaire n’est supposé et aucune capture n’a été retouchée.

### Time
Gantt à axe commun, baseline séparée, zones de marge hachurées, connecteurs FS, chemin critique, jalon final, sélection d’une tâche et inspecteur contextuel. Mobile possède une composition dédiée. Trois jours de marge peuvent absorber une prolongation ; au-delà le jalon se décale. Quand les deux branches deviennent critiques, elles sont décrites séparément, sans inventer une dépendanceB→C.

Le moteur `schedule.ts` est inchangé. Hypothèse : jours ouvrés relatifs continus, pas de calendrier ni nivellement de ressources. La contradiction du statut « À risque » de la capture réelle reste signalée sans explication inventée.

### Doc
Graphe livrable→version→revue→décision. ChoisirV1/V2/V3 déplace la chaîne active et change les métadonnées. Vue verticale sur petit écran et lecture intermédiaire sur tablette. Données fictives et absence de capture Doc clairement indiquées.

## E. Visuels et cycles de correction

- [Hero desktop](v2-evidence/hero-desktop.png)
- [Hero mobile](v2-evidence/hero-mobile.png)
- [Mode Time mobile](v2-evidence/hero-time-mobile.png)
- [Mode Doc desktop](v2-evidence/hero-doc-desktop.png)
- [Résultats responsive](v2-evidence/responsive-results.json)

La baseline réelle couvre6pages×3largeurs. Deux cycles indépendants de critique ont ensuite été conduits et suivis de corrections effectives : [cycle1](creative-review-v2-cycle1.md), [cycle2 et revalidation](creative-review-v2-cycle2.md).

Défauts corrigés : mot«payer.» isolé sur desktop ; annotations trop petites ; dateTime coupée sur mobile ; collisions entre noms de tâche, graduations puis légende SVG redondante ; labels des trajectoires trop proches lorsqu’elles se croisent ; couleur de légende à synchroniser ; nom accessible du lien de marque à laisser dériver de son contenu visible. La légende Time supprimée du SVG reste entièrement couverte par les métriques et l’explication.

Les dernières images Time390/1024/1440 et Cost1440/390 ont été réexaminées après optimisation des polices : pas de collision, pas de débordement, aspect typographique préservé.

## F. Performance mesurée

### Charge et rendu desktop — comparaison avec la même méthode

Chromium headless, localhost, serveur statique **sans compression**, script `npm run perf`, pas de bridageCPU/réseau. Mesures ponctuelles de laboratoire avec autres contrôles navigateur susceptibles de générer du bruit ; ce ne sont pas des données terrain.

| Page | LCP avant | LCP après | JS transféré avant→après |
|---|---:|---:|---:|
| Accueil |140 ms|232 ms|408→406 ko|
| Cost |256 ms|128 ms|1244→429 ko|
| Méthodologie |172 ms|104 ms|394→405 ko|
| Tarifs |80 ms|112 ms|394→405 ko|

CLS final0 dans cette mesure, cadence requestAnimationFrame environ60–61/s. Le coût JS réellement chargé de Cost baisse d’environ65%, parce que la scèneWebGL décorative n’est plus montée. La latence ponctuelle de l’accueil n’a pas baissé ; aucun gain généralisé de vitesse n’est prétendu. Le CSS brut de l’accueil passe d’environ42 à96ko avec les nouveaux instruments, un coût explicite à surveiller. Les cinq polices utilisées passent de652732 à170260octets (environ−74%) ; les transferts de chaque route dépendent des poids effectivement utilisés. Next annonce environ113kB de First LoadJS pour l’accueil.

[Mesures avant](v2-evidence/performance-before.txt) · [après](v2-evidence/performance-after.txt).

### Lighthouse mobile simulé

Lighthouse 12.8.2, Chromium 155 headless, profil412×823, throttling simuléRTT 150 ms, débit1638,4kb/s, CPU ×4. Résultats locaux, **pas un test de l’hébergeur ni une mesure INP terrain**.

| Condition | Performance | LCP | Accessibilité automatisée |
|---|---:|---:|---:|
| Export initial V2, serveur non compressé |69|7,5 s|100*|
| Même export servi avec gzip, avant optimisation des polices |84|4,4 s|100*|
| Export final avec gzip et polices optimisées |**94**|**3,0 s**|**100**|

*Un contrôle non pondéré du nom du lien de marque a néanmoins révélé une différence avec le texte visible. Elle a été corrigée ; le rapport final ne contient plus cette anomalie.

Le TBT final est0ms et le CLS0. L’objectif indicatifLCP<2,5 s **n’est pas atteint** dans ce profil. TBT ne vaut pas INP et100au contrôle automatique ne certifie pas une conformitéWCAG complète. La compression du serveur de mesure est explicite et reproduisible : les trois conditions sont conservées, sans confondre un changement de serveur avec une optimisation applicative. Les fonts ont été réduites sans changer leurs avances ni leurs dessins utiles ; les sources, licences et contrôlesSHA256 restent disponibles.

[Rapport final HTML](v2-evidence/lighthouse-mobile.html) · [JSON](v2-evidence/lighthouse-mobile.json) · [avant optimisation](v2-evidence/lighthouse-before-font-optimization.json) · [sans compression](v2-evidence/lighthouse-uncompressed.json). Le petit serveur de mesure gzip est joint comme outil de laboratoire uniquement ; il n’a pas été déployé.

## G. Tests exécutés

| Commande/contrôle | Résultat |
|---|---|
| `npm run build` |PASS,19 pages/ressources statiques générées|
| `npm run typecheck`, `npm run lint`, `git diff --check` |PASS|
| `node scripts/finance.test.mjs` |12 testsPASS|
| `node scripts/schedule.test.mjs` |5 testsPASS|
| `node scripts/contact-response.test.mjs` |3 testsPASS|
| `node scripts/metadata.test.mjs` |3 testsPASS|
| `npm run verify` |PASS,14 routes×4largeurs, contrastes/contenu peint/clavier/mouvement réduit/sans WebGL/formulairevide|
| `node scripts/verify-v2.mjs` |PASS,**80 couplesroute/largeur**, modesgéométriques/mesures/financeclavier/Time/Doc, sans JS et reduced-motion, pas de capturebrute|
| `node scripts/verify-integrity.mjs` |PASS,12routessecondaires, titres/canonical/OG, validation vide et Échapmobile|
| `node scripts/verify-form.mjs http://127.0.0.1:3500` |PASS,buildisolé avec cléfictive+endpointlocal : succès acquitté, refusHTTP, faux succès200,JSONinvalide,panneréseau, conservation saisie/repli/honeypot|
| Reproduction des polices optimisées |PASS,5entrées et5sorties vérifiéesSHA256 ; glyphes/avanceséchantillonnés et nomsréservéscontrôlés|

Tailles V2 :320/375/390/430/768/1024/1440/1920. Les captures principales sont390/768/1440, complétées par les revues320/1024. **Aucun envoi réel.** La dernière correction du nom accessible a aussi été contrôlée dans Lighthousefinal.

La logique métier de `finance.ts` et `schedule.ts` est inchangée. Une [revue de code distincte](creative-code-review-v2.md) n’a pas identifié de régression impérative ; son auteur ne pouvait pas ouvrirChromium dans son propre sandbox, ce qui est distinct des tests navigateur et revues visuelles réellement exécutés par les autres intervenants.

[Journaux : suite complète](v2-evidence/verification.txt), [V2](v2-evidence/v2-interactions.txt), [formulaire factice](v2-evidence/form-mock.txt), [build](v2-evidence/build.txt), [intégrité](v2-evidence/integrity.txt).

## H. Évaluation créative séparée

Appréciation issue des images réellement examinées ; elle ne constitue pas une récompense ni une certification de qualité.

| Critère | Note | Réserve observable |
|---|---:|---|
| Originalité/reconnaissance |13/15|Langage instrumental spécifique, encore partiellement issu des codestechniques du secteur|
| Hero/scénographie |17/20|Troislogiques réellement distinctes ; profondeur 2,5D, pas matièrephysiqueWebGL|
| Composition/typographie |13/15|Titre corrigé, alternances et rails ; quelques pages restent denses|
| Motion/interactions |11/15|Réactivité utile et sobre ; pas une chorégraphiecinématographiquecomplexe|
| Mise en scène produit |12/15|Lectureciblée et source accessible ; pas de nouvellecapture Doc|
| Cohérence des pages |9/10|Mastheads et codescommuns, contenuspréservés|
| Finition desktop/mobile |8/10|Collisions et dates corrigées ; annotations techniques encore petites par nature|
| **Total créatif** |**83/100**|Évaluation indépendante documentée dans le cycle2|

Les tests techniques et les résultats de performance sont présentés séparément ; ils ne compensent pas artificiellement cette note.

## I. Limites et publication

- Le site publié répond toujoursHTTP403 via le proxy. Le dépôt distant a été vérifié, mais aucune comparaison visuelle fiable de production ni preuve de déploiementV2 n’est disponible.
- LCP mobile simulé 3,0 s, au-dessus de la cible 2,5 s. À compléter par mesures réelles sur l’hébergement, budgetsCSS et éventuellement données terrain INP. Pas d’audit WCAG manuel complet.
- Aucun nouveau document permettant de réconcilier Cost ni d’expliquer le statut Time n’a été fourni. Les avertissements restent. Aucune capture Doc réelle nouvelle.
- Le package/lockfile reste inchangé. L’audit de dépendances déjà documenté remonte36findings dont2critiques dans cette chaîne historique ; la migrationcoordonnée Next/React/ESLint/Electron reste un chantier de sécurité avant publicationdéfinitive. Cette refonte n’a pas résolu cet audit par une mise à jour majeure aveugle.
- Informations éditeur toujours à renseigner sur pièces officielles dans `src/content/legal.ts` : identité/forme/capital/siège/immatriculation/TVA si applicable/directeur de publication ; hébergeur et coordonnées ; engagement/résiliation/facturation/juridiction ; durées de conservation à confirmer. La validation juridique demeure nécessaire.
- `contact@cheetahsoft.fr` reste une conventionnonvérifiée. Confirmer un destinataire relevé ; si le modeWeb3Forms est retenu, configurer sa clépublique et son destinataire dans les paramètres de production. Aucun secret ne doit être placé dansNEXT_PUBLIC.
- L’empaquetageElectron/Windows et l’application des en-têtes Vercel n’ont pas été testés ni déployés par cette mission.

Le résultat est livré pour revue et intégration sur la branche V2. La précédente autorisation de mise en ligne concernait la version antérieure ; le nouveau brief interdit explicitement un push déclenchant la production sans nouvelle instruction. Aucun déploiement n’est affirmé.

## Contrôles additionnels de l’export final

370 liens et ancres locaux vérifiés, zéro erreur. Navigation native accueil→Cost→retour navigateur exercée avec Chromium, sans pageerror. Aucun marqueur de clé ou endpoint factice n’a été retrouvé dans l’export final. Les cinq artefacts de polices optimisées ont été reproduits avec vérification des entrées/sorties ; le nom réservéPlex n’est pas utilisé pour la famille dérivée.
