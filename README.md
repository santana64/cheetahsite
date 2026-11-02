# CheetahSoft — site vitrine

Site de présentation de la suite Cheetah (Cost, Time, Doc) : contrôle de coûts,
planification et gestion documentaire de projets complexes.

La direction artistique, le système de design et les règles de fiabilité du
contenu sont décrits dans **[DESIGN.md](DESIGN.md)**. Lisez-le avant toute
évolution visuelle.

## Pile technique

- **Next.js 14** (App Router) en export statique
- **TypeScript**, **Tailwind CSS**
- **three.js** / **React Three Fiber** pour la scène signature, chargée en
  import dynamique
- Aucune bibliothèque d'animation : transitions CSS, un observateur de
  défilement maison, et les uniformes du shader

## Démarrer

```bash
npm install
npm run dev
```

## Construire

```bash
npm run build
```

L'export statique est écrit dans `./out`.

Variables d'environnement de build :

| Variable | Rôle | Défaut |
|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Préfixe de chemin (GitHub Pages) | vide |
| `NEXT_PUBLIC_SITE_URL` | Origine publique, pour `sitemap.xml` et `robots.txt` | URL de prévisualisation |

## Vérifier

Les deux scripts travaillent sur l'export statique servi en local.

```bash
npx serve out -l 3200
```

```bash
npm run verify
```

```bash
npm run perf
```

`verify` contrôle, sur 14 routes et quatre largeurs : erreurs de console,
débordement horizontal, **contenu réellement peint** (un bloc de texte présent
dans la fenêtre ne doit jamais rester invisible), **contraste du texte**
(WCAG 2.2 — 1.4.3 AA, avec composition de l'alpha sur le fond résolu), taille
des cibles tactiles (2.5.8), rendu en mouvement réduit, repli sans WebGL,
parcours clavier avec indicateur de focus, et validation du formulaire de
contact. Les captures sont écrites dans `./verif/`.

`perf` produit des mesures de laboratoire sur localhost avec rendu WebGL
logiciel. Ce ne sont pas des données terrain et elles ne valent pas un score
Lighthouse.

## Formulaire de contact

Le site est un export statique : il n'y a pas de serveur pour recevoir une
soumission. Le formulaire valide les champs puis compose le message dans le
logiciel de messagerie de l'utilisateur. Le comportement est annoncé dans
l'interface. Pour un envoi côté serveur, il faudra brancher un service
d'acheminement et retirer cette mention.

## Application de bureau

Un empaquetage Electron est conservé (`npm run electron:build`). Il sert
l'export statique via un serveur local.

## Avant mise en ligne publique

Deux pages portent un encart « Information à fournir par l'éditeur » :
`/mentions-legales/` et `/confidentialite/`. Les mentions légales obligatoires
(forme juridique, siège, immatriculation, directeur de la publication,
hébergeur) ne peuvent pas être reconstituées par un tiers et doivent être
renseignées avant publication.

L'adresse de contact (`CONTACT` dans `src/content/cheetah.ts`) est une
convention de travail : le dépôt d'origine n'en contenait aucune. Elle doit
être remplacée par une adresse réellement relevée avant toute publication.
