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
| `NEXT_PUBLIC_FORM_ENDPOINT` | URL de dépôt du formulaire de contact | vide → repli messagerie |
| `NEXT_PUBLIC_FORM_ACCESS_KEY` | Clé publique du prestataire, si elle va dans le corps | vide |

Voir `.env.example` pour le détail. Ces variables sont inlinées dans le
JavaScript client : elles sont publiques par conception et ne doivent jamais
contenir de secret.

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

Le site est un export statique : il n'a pas de serveur applicatif pour recevoir
une soumission. L'envoi passe donc par un service tiers d'acheminement de
formulaires, configuré par `NEXT_PUBLIC_FORM_ENDPOINT`.

Deux modes, et l'interface annonce toujours celui qui s'applique :

- **Endpoint configuré** — la demande part réellement en `POST`. En cas
  d'échec réseau, la saisie est conservée et le visiteur se voit proposer de
  repasser par sa messagerie ou de copier l'adresse. Il n'est jamais bloqué.
- **Endpoint vide** — le bouton compose le message dans la messagerie du
  visiteur, et le texte de l'encart le dit explicitement.

Un champ-piège invisible filtre les robots : hors du flux, hors du parcours
clavier, `aria-hidden`. Une soumission qui le remplit reçoit une confirmation
sans être relayée.

Avant la mise en ligne publique, complétez `/confidentialite/` avec l'identité
du prestataire retenu, son pays d'établissement et les durées de conservation.
Il agit comme sous-traitant et doit être déclaré.

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
