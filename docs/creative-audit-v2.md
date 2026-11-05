# Creative audit V2 — The Control Field

## Point de départ vérifié
HEAD local264cc79 (suppression capture brute), état Git propre. Référence de travail distante vérifiée via Git ; accès au site publié contrôlé séparément. Le moteur reste Next14.2.29/React18/TS/Tailwind3 avec R3F8/Three0.169 déjà installés. Aucune mise à jour aveugle ni nouveau moteur UI prévu.

Captures du rendu réel avant code : /tmp/cheetah-v2-baseline, accueil/Cost/Time/Doc/tarifs/contact ×1440/768/390. Export statique servi sur3200 sans fallback SPA. Mesures desktoplocalhost : accueilFCP/LCP140ms/CLS0, JS408ko ; Cost256ms/JS1244ko ; méthode172ms/JS394ko ; tarifs80ms/JS394ko. Mesures de laboratoire uniquement.

## Acquis à préserver
Calculs purs et23tests ; prix et périmètres commerciaux ; formulaire validation/acquittement/erreurs/repli ; métadonnées individuelles ; preuves et incertitudes sources ; polices locales avec licences ; routes et navigation native. Pas de capture brute affichée de nouveau sur l’accueil.

## Faiblesses réellement observées
Hero : bon titre mais carte isolée, géométrie semblable entre modes, pas de transformation métier ; instrument mobile commence à727px, donc entièrement sous le premier écran. Lecture de dérive : barres justes mais manque de tension/trajectoires. Time : Gantt sans connecteurs tangibles, succession de grands blocs. Doc : sélection surtout textuelle, pas de graphe de provenance. Grands espaces/texte redondant sur l’accueil ; expérience produit encore largement tableau. Page Cost charge beaucoup plus de JS que l’accueil via scène WebGL existante.

## Exploration des approches
A — WebGL/R3F : avantage pour lumières, vrais volumes, caméra continue ; coût additionnel Three déjà observable sur pages produit, dépendanceGPU, composition/texte à doubler pour fallback. Justifié pour matière immersive, mais pas pour un instrument de lignes et de mesures.
B — Control Field2,5D : géométrie projetée et volumes SVG, axes partagés, transformations différenciées Cost courbes/mesures, Time réseau/dépendances, Doc versions/preuve. TexteDOM immédiatement disponible, états accessibles, transitionsCSS, aucune boucleGPU permanente. Risque de platitude traité par composition grand format, plans/épaisseurs/occlusion/ombres sobres et changement véritable de structure.
**Décision : B**, pour cette expérience majoritairement faite de repères et de relations. Pas une simple recoloration du SVG précédent : trois logiques géométriques distinctes dans un espace de contrôle commun.

## Contrat de design
Fond#06080a, surface#0d1116, texte#eef2f6, acier#9daaba, respiration#eceae4 ; accentsCost#cdf564/Time#f2a93b/Doc#e9c9a0, dérive#f2605b exclusivement si défavorable. Archivo/InterTight/IBMPlexMono locaux. Grille82rem, marges fluides, unités tabulaires. Signature : champ de mesure traversé par un référentiel et un rail d’observation ; davantage d’architecture, moins de panneaux génériques.
Motion : press140ms, état360ms, scène700ms, easingcubic-bezier(.22,1,.36,1), distances4/12/24px. Introduction limitée à l’instrument, aucun texte masqué ni CTA retardé. Changements réversibles, arrêt de tout mouvement en reduced-motion ; aucune animation permanente. Mobile : instrument compact, sélection sur rail tactile, métriques voisines des contrôles ; Gantt détail contextuel et vue temporelle explicite.

## Travail priorisé
P0 hero/ControlField et comparaison de trajectoires ; ProductViewport natif avec focus indicateurs et preuve originale accessible seulement sur demande ; préserver calculs. P1 Time dépendances/Docgraphe, secondaires et chrome, responsive. P2 finition, performances et preuve. Styles propres aux expériences en CSSmodules ; globals réservé aux tokens/base.

## Validation à effectuer
Deux cycles de critique/correction sur hero, accueil et interactions. Captures390/768/1440 puis320/375/430/1024/1920. Tests calculs existants, nouveaux contrôles des modes/géométries, largeur interne des tableaux, clavier/tactile, reduced-motion, sansWebGL, formulairemock, navigation/historique/liens. Build+typecheck+lint, avant/après performance comparables. Aucun push/main/déploiement pour cette V2 sans instruction.
