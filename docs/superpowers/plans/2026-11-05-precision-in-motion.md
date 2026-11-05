# Precision in motion Implementation Plan

> **For agentic workers:** use the delegated tasks below with independent review at integration.

**Goal:** Refonte industrielle pédagogique, crédible et utilisable de CheetahSoft.
**Architecture:** Export statique existant, composants serveur et îlots interactifs ciblés. Logique de calcul pure séparée du rendu. Pas de nouvelle dépendance UI.
**Tech Stack:** Next 14, React 18, TypeScript, Tailwind, SVG/CSS, Playwright.
**Spec:** docs/audit/2026-11-05-refonte.md et cahier des charges fourni.

## Global Constraints
- Prix, source historique et niveaux de preuve conservés ; pas de faits juridiques inventés.
- Aucun déploiement/envoi réel. Navigation native et reduced-motion.
- Préserver source/lockfiles pendant acquisition de fontes ; le travail demandé autorise les changements applicatifs.

## Review Focus
- Zéro budget/avancement : pas de ratio trompeur ou NaN.
- Capture Cost contradictoire : aucun total global supposé.
- Mobile 390px : pas de CTA/graphique tronqué, tables explicitement scrollables.
- Sans JS/mouvement : texte et visualisation statique lisibles.
- Formulaire 2xx avec success:false : erreur affichée et saisie conservée.

## Tâches
- [x] Finance : fonctions pures et tests limites avant intégration dans ForecastSimulator ; ajouter avertissement source et sous-totaux dans CostGrid. Commande node --test sur tests dédiés.
- [x] Time/Doc : modèle de dépendances testé puis ProjectTimeline et DocumentVersionFlow, capture Time non altérée et statut inexpliqué signalé.
- [x] Pages partagées : metadata helper(path,title,description), canonical/OG spécifiques, navigation accessible, configuration juridique pending, tests contact interceptés.
- [x] Fontes : fichiers officiels locaux avec licences et provenance, next/font/local, build sans requête Google.
- [x] Accueil : Stage avec plans sélectionnables et métriques pédagogiques, comparaison budget/avancement, modules, capture authentique, simulateur et parcours commercial. CSS responsive/reduced-motion, pas de contenu masqué par timeline.
- [x] Intégration : npm run typecheck, npm run lint, npm run build ; serveur statique sans fallback SPA ; suites Playwright et capture pages desktop/tablette/mobile.
- [x] Revue indépendante : inspecter captures réelles, relever défauts vérifiables, corriger puis relancer contrôles affectés ; rapport honnête métriques/limites et grille pondérée.
