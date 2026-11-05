# Revue visuelle indépendante V2 — cycle 1

Export stable annoncé par l’intégrateur (build86935). Réellement observé dans Chromium système, captures `/tmp/cheetah-v2-cycle1/`. Aucun build ni changement applicatif par le reviewer. Capture de six pages (accueil, Cost, Time, Doc, tarifs, contact) aux largeurs1440/768/390/320, soit24conditions, en mouvement réduit pour isoler la composition. Les trois géométries du hero ont aussi été sélectionnées puis capturées sur1440/390/320.

## Contrôles observés
- Zéro débordement de document et zéro pageerror sur24conditions.
- Les modes COST/TIME/DOC produisent réellement des géométries différentes : colonnes prévisionnelles, chaîne de tâches avec baseline, versions documentaires reliées à une décision.
- L’instrument mobile390 apparaît vers530px contre727px dans la référence. Titre et CTA restent immédiatement visibles.
- Accueil390 :9293px de hauteur contre11101px en référence, soit environ16% de parcours en moins malgré les nouvelles visualisations.
- ProductViewport expose ses mesures dans des contrôles identifiables et rend l’avertissement sur la source non réconciliée. La capture brute n’est pas réintroduite dans le flux.
- Gantt desktop : liens et marge visibles, meilleur rapport entre dépendance et calendrier que la référence. Mobile : vue simplifiée et détail d’activité, plutôt qu’un Gantt géant compressé.
- Doc : graphe document→version→revue→décision visible, source non publiée explicitement rappelée.
- Tarifs : les repères de prix apparaissent au premier écran mobile ; contact garde formulaire et parcours commercial lisibles.

## Défauts transmis
1. **Hero, priorité graphique** : le titre desktop se termine par « payer. » isolé sur une troisième ligne. La scène occupe correctement sa moitié, mais le retour affaiblit la composition typographique. L’intégrateur prévoit deux lignes contrôlées et une taille mieux contenue.
2. **Lisibilité instrument** : les petites annotations peuvent être confondues à l’inspection du rendu (J+36 perçu comme J+30). Vérification DOM effective : `CIBLE J+24 / FIN J+36 / LIENS FS`, donc **aucune erreur arithmétique**. Augmenter les libellés utiles et alléger les repères secondaires sur mobile. Une première alerte de cohérence a été requalifiée après cette vérification, pas conservée comme défaut métier.
3. **Source Time mobile390** : la date `2026-04-06` s’étale sur deux lignes (`2026-04-` puis `06`). Pas de perte de contenu, mais une date plus compacte ou une cellule recomposée améliorerait nettement la finition.

## Appréciation
La progression par rapport à la référence est concrète : champ central plus intégré, transformations réellement distinctes, comparaison à deux trajectoires et visualisations pédagogiques plus structurées. La présentation garde toutefois une forte présence d’encarts rectangulaires et plusieurs pages longues ; la qualité ne justifie pas automatiquement un score supérieur à90. Pas de score final avant la passe de correction et sa revalidation. Cette revue n’est pas un audit WCAG exhaustif ni une mesure de performance.
