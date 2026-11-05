# Livraison — CheetahSoft / Precision in motion

Branche de travail : `feat/precision-in-motion`. Modifications laissées disponibles pour revue, sans déploiement, push ni modification DNS. État Git initial propre. Prix existants conservés.

## Ce qui a été livré
- Accueil recomposé : hero typographique et coupe technique SVG Cost/Time/Doc sélectionnable, lecture dépenses/avancement, modules, capture réelle visible, grille source et laboratoire financier. Les trois plans sont un modèle pédagogique, pas une interface du logiciel.
- Composition graphite/ivoire, accent signal contrôlé, titres secondaires plus compacts, navigation mobile avec Échap/focus, lisibilité indépendante du défilement. Pas de nouvelle dépendance UI, pas de WebGL obligatoire sur l’accueil.
- Cost : budget initial + variation = budget à date, avancement, dépenses, RAF manuel/au budget/corrigé de la performance, coût prévisionnel, écart et dérive. Formules explicites, ratios non calculables signalés, résultats mobiles sans troncature. Présent sur accueil, méthode et page Cost.
- Time : simulateur de dépendances fin-début, marges, propagation d’un allongement de tâche et changement du chemin critique. Modèle fictif, jours continus, sans calendriers ni nivellement de ressources. Définitions SS/FF/SF séparées des liens réellement calculés.
- Doc : parcours V1–V3, rôles, versions et décision justifiée, explicitement pédagogique. Aucune capture produit Doc inventée.
- Pages secondaires harmonisées via les composants partagés et leurs titres ; contenu métier existant conservé. Canonical, description et partage par route ; sitemap et robots corrigés. Sous-chemin GitHub Pages ajouté une seule fois aux métadonnées.
- Formulaire : acquittement `success:true` requis, erreurs prestataire bornées, délai de 15s, saisie préservée. Mode sans clé clairement présenté comme ouverture de messagerie. Les tests utilisent un prestataire local factice.
- Informations juridiques absentes centralisées dans `src/content/legal.ts`, jamais remplacées par des faits supposés. Libellé commercial Professionnel neutralisé pour ne pas promettre trois modules.
- Polices officielles locales sous OFL : provenance et empreintes dans `public/fonts/sources.json`, licences jointes, reconstruction vérifiée dans `scripts/rebuild-fonts.py`. Build indépendant de Google Fonts.
- En-têtes de protection définis dans `vercel.json` (configuration locale seulement ; leur application par Vercel n’a pas été déployée ni vérifiée).

## Exactitude : corrections et limites de la source
La capture Cost a été réellement examinée. Le filtre visible ne démontre pas de lignes cachées. Les cinq lignes totalisent **795 / 784 / −11 k€**. Le bandeau source affiche **800 / 798 / −3 k€**, alors que 798−800 vaut −2. Aucun périmètre global ni total historique corrigé n’est inventé. La source reste intacte ; la différence est explicitement avertie. 78,5+210=288,5 et l’affichage source 289 est indiqué comme arrondi possible, sans convention source documentée. « Vingt points » devient **+20 k€**.

La capture Time conserve 100 %, fin anticipée, zéro dérive baseline et « À risque » : le statut est inexpliqué par la source, et non justifié par une règle inventée. Le nouveau scénario pédagogique montre séparément un retard cohérent.

La revue de code a aussi corrigé les trois barres monétaires de la nouvelle comparaison : elles partagent désormais une seule échelle. Le contrôle navigateur vérifie leur ordre réel après saisie clavier.

## Vérifications
- `node scripts/finance.test.mjs` : **12 tests réussis**.
- `node scripts/schedule.test.mjs` : **5 tests réussis**.
- `node scripts/contact-response.test.mjs` : **3 tests réussis**.
- `node scripts/metadata.test.mjs` : **3 tests réussis**, y compris l’URL Pages contenant déjà le sous-chemin.
- `npm run typecheck`, `npm run lint` : réussis.
- `npm run build` : export production réussi, 19 pages/ressources statiques générées. Accueil : environ 112 kB de First Load JS selon Next.
- `node scripts/verify-integrity.mjs` : 12 routes secondaires, HTTP200/titres/H1/canonical/OG, validation vide, Échap/focus mobile contrôlés.
- `node scripts/verify-form.mjs http://127.0.0.1:3500` : build isolé avec clé fictive et endpoint local. Succès acquitté, HTTP400, HTTP200 `success:false`, JSON invalide, interruption réseau, conservation des valeurs, repli et piège antirobot vérifiés. **Aucun envoi réel.**
- Revue visuelle indépendante : **18 rendus** (accueil/Cost/Time/Doc/tarifs/contact × 1440×900, 1024×768, 390×844), zéro débordement de page et zéro pageerror. Interactions des trois modules et du menu exercées. Clipping interne financier mobile détecté puis corrigé et revérifié. Captures et évaluation dans les éléments de preuve.
- La suite complète `npm run verify` couvre 14 routes × 4 largeurs, contenu peint, contrastes, cibles tactiles, clavier, formulaire vide, reduced-motion, sans WebGL et instrument interactif. **Dernier passage sur export figé : code de sortie 0, AUCUN PROBLÈME DÉTECTÉ.** Voir [le journal](evidence/verification.txt). Les passages qui ont chevauché une reconstruction ont été écartés (chunks périmés) ; le dernier passage utilise un export figé.

Les tests Node affichent un avertissement sur l’absence de `type:module` dans le manifeste historique. Leurs résultats détaillés restent 23 réussites réelles, sans échec ni test désactivé ; aucune migration du système de modules n’a été faite pour supprimer ce simple avertissement.

## Mesures réellement obtenues
`npm run perf`, Chromium desktop headless, localhost, sans bridage réseau/CPU, rendu logiciel possible. **Ce ne sont ni des données terrain, ni une mesure mobile, ni un score Lighthouse.**

| Page | FCP | LCP | CLS |
|---|---:|---:|---:|
| Accueil | 176 ms | 176 ms | 0,0006 |
| Cost | 168 ms | 168 ms | 0 |
| Méthodologie | 108 ms | 108 ms | 0 |
| Tarifs | 88 ms | 88 ms | 0 |

Observateurs LCP et layout-shift installés avant navigation ; le script historique lisait des entrées LCP indisponibles et a été corrigé. Cadence requestAnimationFrame environ 60–61/s, qui ne constitue pas une preuve de performance GPU/INP. INP terrain, Lighthouse mobile et audit WCAG complet **non mesurés**. La charge de fontes (~637 ko transférés pour tous les poids) et le module Three des pages produit restent des pistes d’optimisation.

## Évaluation critique / 100
La revue indépendante ne conclut pas à un niveau de prix international. La composition et les démonstrations progressent nettement ; les pages secondaires conservent en partie leur architecture antérieure et la scène SVG reste une interaction de sélection, pas une simulation spatiale complète.

| Critère | Note | Justification |
|---|---:|---|
| Direction artistique | 12/15 | Signature technique et identité conservée, sans prétention de reconnaissance externe |
| Composition | 8/10 | Rythme graphite/ivoire, titres secondaires corrigés |
| Animations/interactions | 7/10 | Contrôles métier réels, transitions retenues ; scénographie encore simple |
| UX | 9/10 | Lecture immédiate et parcours démonstration accessible |
| Démonstration produits | 12/15 | Cost/Time manipulables, Doc pédagogique faute de capture |
| Exactitude/crédibilité | 9/10 | Sources contradictoires exposées, pas de faits inventés ; explication éditeur encore requise |
| Performance | 6/10 | Bons chiffres desktop locaux ; absence de profil mobile/INP interdit une meilleure assurance |
| Responsive/accessibilité | 9/10 | Trois tailles revues, clipping corrigé ; pas de certification WCAG complète |
| Conversion | 4/5 | Formulaire robuste et tests factices, destinataire à confirmer |
| Architecture | 4/5 | Logique pure testée, composants dédiés, aucune dépendance UI ajoutée |
| **Total** | **80/100** | Évaluation critique, pas une certification |

## Avant toute publication définitive
1. **Sécurité des dépendances** : `npm audit` remonte **36 findings : 2 critiques, 26 élevés, 8 modérés**, notamment Next et tar transitif, avec composants de développement/Electron. Les chemins serveur de plusieurs avis ne sont pas servis par cet export statique, mais cela ne supprime pas les risques de l’outillage. Une migration coordonnée Next/React/ESLint et la chaîne Electron est nécessaire ; pas de `audit fix --force` ni de migration majeure non validée au milieu de la refonte. Détail brut joint dans `evidence/npm-audit.json`.
2. **Éditeur** : identité légale, immatriculation, hébergeur, coordonnées, TVA si applicable, directeur de publication et engagements contractuels à remplir sur pièces officielles et faire vérifier par la personne compétente.
3. **Contact** : `contact@cheetahsoft.fr` est une convention historique non vérifiée. Confirmer une boîte relevée et, si le mode direct est retenu, la clé publique Web3Forms et son destinataire dans les paramètres de déploiement. Aucune valeur secrète à mettre dans `NEXT_PUBLIC_*`.
4. **Produit** : obtenir l’explication du bandeau Cost et du statut Time ; une vraie capture Doc améliorerait la preuve mais aucune n’est disponible.
5. **Production** : le site publié a répondu HTTP403 au proxy ; pas de comparaison de versions ni de rendu production possible. Les nouveaux en-têtes et le routage de l’hébergeur restent à contrôler après une publication expressément autorisée.

## Fichiers principaux et reprise
Accueil : `src/app/page.tsx`, `components/home/{Stage,VarianceReading}.tsx`, `app/globals.css`.
Calculs : `src/lib/{finance,schedule}.ts`, `components/ForecastSimulator.tsx`, `components/product/{CostGrid,ProjectTimeline,DocumentVersionFlow,TimeCard}.tsx`.
Parcours partagé : `components/{Header,ProductPage,ContactForm,ui}.tsx`, `lib/{metadata,contact-response}.ts`, `content/legal.ts`.
Documentation : audit initial, plan, DESIGN.md et revue indépendante.

Le brouillon d’environnement contient les instructions d’installation et de reprise actualisées (polices locales, Chromium système, export statique). Il est sauvegardé, **pas publié**. Les processus ne sont pas inclus dans un futur snapshot et devront être redémarrés.

## Preuves à consulter
- [Accueil desktop](evidence/home-desktop.png) · [Accueil mobile](evidence/home-mobile.png) · [Résultats financiers mobile](evidence/finance-mobile.png)
- [Revue visuelle indépendante](visual-review.md) · [Revue de code](code-review.md)
- [Build](evidence/build.txt) · [Mesures desktop](evidence/performance-desktop.txt) · [Audit npm](evidence/npm-audit.json)
- Vérification supplémentaire : **364 liens et ancres locaux de l’export, zéro erreur**.

### Fiabilité de la vérification navigateur
Une assertion de la suite ciblait initialement le mauvais curseur : le libellé exact « Avancement physique » identifiait celui du simulateur financier, tandis que le libellé de la comparaison contient aussi sa valeur. Elle cible désormais explicitement `reading-progress`, utilise les touches Home puis cinq flèches, et contrôle 35 % → 1 200 k€. Ce diagnostic ne correspond pas à un dysfonctionnement du calcul applicatif. Les contrôles de routes/accessibilité des passages précédents restaient sans défaut sur export stable ; leur échec global provenait de cette assertion. Le journal du dernier passage complet est la référence finale.

L’export final a aussi été contrôlé pour l’absence des marqueurs de clé/endpoint du fixture de test : aucun marqueur trouvé. L’empaquetage Electron/Windows et le comportement des en-têtes après hébergement ne sont pas validés par ces contrôles web locaux.
