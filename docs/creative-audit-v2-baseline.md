# Référence visuelle V2 — 5 novembre 2026

## État observé
Référence de travail transmise : HEAD `264cc79`. Export existant servi localement sans reconstruction. Rendu réellement inspecté dans Chromium système via Playwright. Captures top + page complète sur accueil, Cost, Time, Doc, tarifs et contact aux largeurs 1440, 768 et390px, soit18 conditions. Fichiers `/tmp/cheetah-v2-baseline/`, résultats `results.json`, mesures `perf.log`. Les images lazy ont été chargées par un défilement préalable ; défilement natif conservé.

## Ce qui fonctionne et doit rester
- Hiérarchie typographique immédiatement identifiable ; contenu français lisible.
- Accent Cost/Time/Doc distinct et palette graphite/ivoire cohérente.
- CTA commercial explicite, navigation courte et formulaire structuré.
- Étiquettes de preuve et avertissements source honnêtes ; aucune capture Doc inventée.
- Rendu mobile sans débordement de viewport ni pageerror sur les18 conditions capturées.
- Calculs et démonstrations de base exploitables ; capture brute Cost déjà retirée de l’accueil.

## Faiblesses effectivement visibles
- **Hero desktop** : l’instrument est enfermé dans une grande carte rectangulaire, juxtaposé au texte. La coupe isométrique reste surtout trois losanges très sombres avec une trajectoire unique ; peu de matière et de profondeur perceptibles. Le champ n’organise pas encore l’ensemble de la composition.
- **Hero mobile390** : premier instrument commence vers727px de haut et sort du premier écran844px. Registre, sourcil, explications et liens s’empilent avant l’objet, ce qui retarde la signature graphique. CTA déjà visible et titre non tronqué : préserver ces qualités tout en raccourcissant le préambule.
- **Pages produit** : grands titres et longues sections sombres imposent une densité répétitive. Les visualisations se lisent comme des panneaux indépendants plutôt qu’un système instrumental commun.
- **Time desktop** : le Gantt utilise des barres et des lignes de texte pour les dépendances, sans connecteurs géométriques réellement visibles. Les marges et le chemin critique sont nommés mais leur propagation n’est pas encore mise en scène.
- **Doc mobile** : le parcours V1–V3 est accessible mais essentiellement textuel ; la succession d’encarts et de métadonnées rend la page longue. La relation version/décision doit devenir un graphe lisible et manipulable, sans retirer les limites de preuve.

## Référence performance locale
`npm run perf` exécuté avant les modifications V2, contre l’export local, Chromium headless desktop sans bridage réseau/CPU. Observateurs du script existant ; aucune revendication Lighthouse ou terrain.

| Page | FCP | LCP | CLS | JS transféré non compressé rapporté |
|---|---:|---:|---:|---:|
| Accueil |140ms|140ms|0|408ko|
| Cost |256ms|256ms|0|1244ko|
| Méthodologie |172ms|172ms|0|394ko|
| Tarifs |80ms|80ms|0|394ko|

Polices rapportées637ko sur accueil/Cost/tarifs,501ko sur méthode. Cadence requestAnimationFrame accueil ~60–61/s ; ce n’est ni une mesure de coût GPU, ni un INP.

## Priorités de transformation
1. Sortir le Control Field du langage de carte ; transformer véritablement ses géométries Cost/Time/Doc.
2. Recomposer le premier écran mobile autour du titre, du CTA et d’un instrument visible plus tôt.
3. Donner des axes et trajectoires explicites à la divergence dépenses/production, avec une seule échelle financière.
4. Mettre les dépendances Time et la relation documentaire en scène, tout en gardant les calculs et preuves.
5. Varier la profondeur et le rythme des pages sans allonger leur parcours ni réécrire le SEO acquis.

## Limites de cette référence
Production non observée par cette mission ; accès auparavant refusé par le proxy. Ces images constituent une référence locale du code exporté, pas une preuve de l’état de Vercel. Pas d’audit WCAG exhaustif, mesure mobile bridée ou INP terrain dans ce baseline.
