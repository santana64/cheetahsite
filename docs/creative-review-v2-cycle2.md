# Revue visuelle indépendante V2 — cycle 2

Export stable build42059 annoncé avant captures. Aucun build ni changement applicatif par le reviewer. Répertoire de preuves `/tmp/cheetah-v2-cycle2/` : six pages ×1440/1024/390/320, captures top/full, plus les trois modes du hero et la comparaison à70%. Tous les rendus principaux ont été capturés en mouvement réduit ; les interactions détaillées ont aussi été exercées en mouvement normal.

## Corrections du premier cycle réellement revalidées
- Titre d’accueil : deux lignes maîtrisées sur1440 et1024, sans « payer. » orphelin ni chevauchement de l’instrument. La version390 reste lisible sans déborder.
- Références techniques du Control Field plus lisibles ; la scène Time affiche bien finJ+36, cohérente avec8+20+8 et+12 par rapport à24.
- Date source Time : `2026-04-06` reste sur une seule ligne même320px. La valeur n’a pas été changée.
- Comparaison dépenses/avancement : à70%, la trajectoire verte et sa légende correspondent ; les valeurs70% et52,5% sont séparées. Prévision600k€ et écart dépenses–acquis−140k€ observés, cohérents avec le modèle annoncé.
- Masthead des pages produit : l’ancien effet WebGL générique disparaît ; l’univers reste cohérent avec la référence visuelle du site sans arrière-plan animé sans rapport au module.

## Résultats de rendu
24conditions de pages : **zéro débordement de document, zéro pageerror**. Les métriques et les contrôles sont lisibles et les interfaces Cost/Time/Doc ont des compositions distinctes. La page tarifs révèle les repères de prix avant les offres détaillées, le contact conserve son formulaire.

## Défaut de finition supplémentaire transmis
**TIME, annotations de scène** : l’agrandissement des textes rend leur collision désormais mesurable. À390px, `01 / ÉTUDES` occupe x142–190,y579,47–588,47 ; `J+00` occupe x156,78–174,y583,96–591,96. Les glyphes se superposent. Même proximité entre `02 / RÉALISATION` et le tickJ+12. Ce défaut ne concerne pas les calculs. Déporter les repères temporels vers le bord opposé de l’instrument ou supprimer les ticks secondaires sur mobile permet de préserver la lecture sans encombrer la scène. Capture `hero-time-390.png`, mesures dans le contrôle navigateur indépendant.

## Évaluation créative, distincte des tests techniques
Évaluation d’après les rendus examinés, pas d’après le seul code. Les chiffres sont une appréciation critique et ne constituent pas une certification.

| Domaine demandé | Note | Éléments observables et réserve |
|---|---:|---|
| Originalité et reconnaissance |13/15|Champ de mesure, trois matériaux chromatiques et langage de repères propres au domaine ; quelques conventions de vitrine technique subsistent|
| Hero et scénographie |17/20|Trois géométries réellement différentes, projection et axes lisibles, titre désormais maîtrisé ; profondeur simulée relativement sobre|
| Composition et typographie |13/15|Rythme ivoire/graphite, retour des titres corrigé, bonne hiérarchie ; longues pages produit toujours denses|
| Motion et interactions |11/15|Sélection, trajectoires, dépendances, graphe et transitions utiles ; scénographie narrative encore retenue, pas une chorégraphie riche|
| Mise en scène produit |12/15|Lecture de mesures ciblées et preuves explicitement distinguées ; représentation native plutôt que capture immersive détaillée|
| Cohérence des pages |9/10|Même grille, rails et repères sur produits/commercial ; modules conservent leurs accents|
| Finition desktop/mobile |7/10|Améliorations vérifiées aux quatre largeurs ; collision des annotations Time à résoudre avant note définitive|
| **Total provisoire** |**82/100**|Pas de note >90 par défaut ; réserver une révision après la dernière correction de collision|

Performance, accessibilité exhaustive, exactitude globale, sécurité et résultats de build ne sont pas évalués par cette note créative ; ils relèvent du rapport technique de l’intégrateur. Les captures ne démontrent pas le déploiement production.

## Contrôle ciblé après déplacement des ticks
Build42859 observé à390/1024/1440 : les ticks ne rencontrent plus les noms de tâche. Un contrôle de toutes les annotations révèle toutefois qu’ils rencontrent maintenant la légende basse redondante `CIBLE J+24 / FIN J+36 / LIENS FS`. À390, J+24 et cette légende se superposent d’environ4,6px verticalement. La suppression de cette légende dans le SVG est recommandée, car baseline, fin et hypothèse FS sont déjà présentées dans les métriques et l’explication hors scène. Cette vérification empêche de conclure prématurément à la disparition de toute collision.

## Revalidation définitive — build37463
Après suppression de la légende basse redondante, contrôle réellement relancé sur390/1024/1440. Les rectangles des quatre ticks temporels ont été comparés à ceux de toutes les autres annotations de la géométrie Time : **aucun chevauchement** aux trois largeurs. Les captures TIME390 et COST1440/390 ont été effectivement examinées ; aucun débordement de page ni pageerror sur ce passage. Le titre reste maîtrisé et la typographie conserve son aspect après optimisation des fontes.

Preuves finales : `/tmp/cheetah-v2-final-proof/hero-time-{390,1024,1440}.png`, `hero-cost-{390,1024,1440}.png`, `results.json`.

**Note créative finale :83/100.** Seule la finition passe de7 à8/10 après correction et revalidation. Les autres réserves restent valables : annotations secondaires petites sur écran390, scénographie sobre plutôt que cinématographique complexe, quelques longues séquences produit. Aucune certification WCAG, performance terrain ou reconnaissance internationale n’est impliquée par cette appréciation. Les résultats techniques complets restent ceux du rapport d’intégration.
