# Revue visuelle indépendante — 5 novembre 2026

Rendu local réellement observé dans Chromium système avec Playwright. Production inaccessible (HTTP403 proxy), donc aucune comparaison visuelle production revendiquée.

## Périmètre
Captures accueil, Cost, Time, Doc, tarifs, contact à 1440×900, 1024×768 et 390×844 ; menu mobile. Captures et résultats bruts : /tmp/cheetah-review/ (artefacts de revue, hors dépôt). La capture complète requiert le défilement préalable pour déclencher images lazy et anciennes révélations. URL canonique / utilisée (un premier passage de revue utilisait // par erreur ; résultats invalides écartés).

Interactions réellement exercées sur mobile : COST/TIME/DOC et aria-pressed ; avancement à30% donne CP1400k€ ; modes financier métier/budget ; prolongation Time5jours donne J+16 et +2jours de dérive ; sélection DocV1 ; menu Escape ferme. Aucun pageerror sur ce passage. 18 rendus de routes sans débordement de document ; ce contrôle ne détecte pas le clipping interne signalé ci-dessous.

## Défauts transmis pour correction
1. **Important — Finance mobile** : table de résultats/colonnes causant min-content excessif, right378,5px dans panneau dont bord droit370px sur viewport390px. Le overflow-hidden coupe les sorties, même sans débordement du document. Ajouter min-width:0 aux enfants et retour à la ligne des en-têtes de résultats.
2. **Important — Offre Professionnel** : ruban « Les trois modules » contredit liste « Cost » + « Time ou Doc ». Neutraliser le ruban sans changer la tarification ni le périmètre commercial.
3. **Moyen — Rythme pages secondaires** : grand titre tarifs monopolise presque tout le premier écran900px ; les prix sont hors premier écran. Réduire la taille des longs titres secondaires, conserver monumentalité de l’accueil.
4. **Mineur — Preuve Doc** : texte partagé « capture ci-dessus » alors qu’aucune capture Doc n’existe. Conditionner la formulation.
5. **Robustesse** : de grands blancs apparaissent dans les captures complètes sans scroll à cause des révélations et lazy loading. Le parent a annoncé la suppression du masquage du texte et la correction du ratio de la capture réelle ; revalider après build.

## Appréciation avant corrections
Le dispositif en coupe technique et les trois accents ont un rapport lisible au domaine. Typographie et alternance graphite/ivoire construisent une identité cohérente. Les simulations sont manipulables et nommées pédagogiques. Les sources contradictoires sont rendues explicites, sans retouche. La qualité ne justifie pas à elle seule une prétention à un prix international : la scène SVG change surtout de sélection/couleur et la majorité des pages secondaires conserve la composition précédente.

| Critère | Note provisoire |
|---|---:|
| Direction artistique |12/15|
| Qualité de composition |8/10|
| Animations et interactions |7/10|
| UX |8/10|
| Démonstration produits |12/15|
| Exactitude et crédibilité |8/10|
| Performance |Non évaluée par cette revue|
| Responsive/accessibilité |7/10|
| Conversion |4/5|
| Architecture |4/5|

Sous-total observé **70/90**, sans note de performance inventée. La note finale doit intégrer les mesures du responsable de l’intégration et la revalidation des défauts ci-dessus. Cette revue n’est pas un audit WCAG complet ni une mesure Core Web Vitals terrain.

## Seconde passe après correction
Build stable confirmé par l’intégrateur, puis contrôles ciblés réellement relancés :
- Finance à390px : bord droit table349px = parent349px, intérieur du panneau370px. Valeurs désormais entièrement visibles (finance-mobile-final.png).
- Tarifs : ruban « Multi-projets » présent, aucun « trois modules » indu pour Professionnel. Titre secondaire réduit ; composition plus compacte sans troncature.
- Doc : formulation conditionnelle « Aucune capture Doc… ». Une soudure « ci-dessoussont » transmise pour microcorrection.
- Source : image naturelle1920×330 réellement chargée ; capture distincte source-detail.png.

Sous-total révisé **74/90** : UX9/10, crédibilité9/10, responsive9/10 ; autres notes inchangées. La note de performance reste à compléter avec les mesures du rapport principal. Les versions finales des captures et interactions sont nommées results-final.json / interactions-final.json dans le répertoire de revue.

## Validation du build final figé
Après correction de l’échelle commune des barres et de l’espace JSX Doc, revalidation indépendante sans reconstruire :
- À1440px, barre budget800k€ =383,69px ; prévision933k€ =447,64px. À390px :241,27px contre281,47px. La prévision supérieure au budget est maintenant représentée par une barre plus longue sur une échelle commune.
- Au clavier, Home puis cinq flèches donnent35% d’avancement,280k€ acquis,1200k€ prévisionnels aux deux tailles.
- Zéro erreur JavaScript, zéro débordement de page dans ce contrôle ciblé.
- Captures mises à jour réellement inspectées : `/tmp/cheetah-review-final/home-1440-viewport.png`, `home-390-viewport.png` ; captures complètes après parcours : `home-1440-full.png`, `home-390-full.png`. Résultats : `/tmp/cheetah-review-final/results.json`.
