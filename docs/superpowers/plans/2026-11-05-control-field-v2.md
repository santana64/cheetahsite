# Control Field V2 Implementation Plan

**Goal:** Changement majeur de perception visuelle sans réécriture des acquis métier.
**Architecture:** Server pages conservées ; îlots ReactSVG/CSSmodules pour instruments ; calculs purs inchangés.
**Spec:** docs/creative-audit-v2.md + brief utilisateur CONTROL CORE V2.
**Constraints:** prix/preuves/calculs/formulaire/SEO conservés ; pas de capture brute accueil ; pas de dépendanceUI nouvelle ; pas de push/main/déploiement.

- [x] Baseline : état Git, capture18rendus, perf des4pages, audit et comparaisonWebGL/2,5D.
- [x] Hero : Stage/ControlField séparés, mode cost/time/doc=>géométries distinctes, stats/labels accessibles, intro nonbloquante, écran mobile recomposé.
- [x] Détection : VarianceReading=>trajectoires consommation/production, même modèle420/avancement et échelles cohérentes, formule visible, scénariofictif.
- [x] ProductViewport : native faithful cutaway/focus4indicateurs et source sur demande ; remplacer tableau accueil, intégrer Cost. Aucune capture inventée.
- [x] Finance : hiérarchie hypothèses/projection, contrôles/modes conservés, mobile sansclipping.
- [x] Time/Doc : connecteurs/marges/jalon et graphe version→décision ; logique existante/testée inchangée.
- [x] Secondaires/chrome : mastheads instrumentaux, méthode liée, plateforme déclarée, tarifs comparables ; sans réécrire SEO.
- [x] Build unique après fin de tousbuilders ; tests23métier existants, lint/typecheck, rendu/interactions.
- [x] Revue indépendante cycle1, correction concrete ; cycle2, correction et validation.
- [x] Tests8largeurs, modesdégradés, formulairefixture, liens, performanceavant/après ; rapportcréatif/technique séparé, limites et commitlocal.
