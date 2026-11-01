/**
 * SOURCE UNIQUE DE VÉRITÉ — CONTENU CHEETAH
 *
 * Règle de fiabilité appliquée à tout ce fichier :
 *   'demontre' — visible dans une capture produit réelle versionnée dans /public
 *   'decrit'   — décrit par l'éditeur, non démontré par une capture dans ce dépôt
 *   'roadmap'  — annoncé comme à venir, non disponible
 *
 * Aucun chiffre de performance commerciale, aucune certification, aucun client
 * et aucun témoignage ne figure ici tant qu'il n'est pas sourcé.
 */

export type Preuve = 'demontre' | 'decrit' | 'roadmap';

export const PREUVE_LABEL: Record<Preuve, string> = {
  demontre: 'Démontré par capture produit',
  decrit: 'Décrit par l’éditeur',
  roadmap: 'En développement',
};

/**
 * À CONFIRMER PAR L'ÉDITEUR AVANT MISE EN LIGNE.
 *
 * Le dépôt d'origine ne contenait aucune adresse de contact : l'ancien
 * formulaire n'était relié à rien. L'adresse ci-dessous est une convention de
 * travail, pas une donnée vérifiée. Tout le site — formulaire, pied de page,
 * mentions légales, page de confidentialité — pointe vers cette constante :
 * la corriger ici suffit.
 */
export const CONTACT = {
  email: 'contact@cheetahsoft.fr',
  societe: 'CheetahSoft',
  pays: 'France',
} as const;

/* ──────────────────────────────────────────────────────────────────────
   MODULES DISPONIBLES
   ────────────────────────────────────────────────────────────────────── */

export type Capacite = { label: string; preuve: Preuve; detail?: string };

export type Module = {
  slug: 'cost' | 'time' | 'doc';
  nom: string;
  dimension: string;
  accent: 'volt' | 'amber' | 'champagne';
  accentHex: string;
  promesse: string;
  intro: string;
  capture?: { src: string; alt: string; legende: string };
  capacites: Capacite[];
  lexique?: { terme: string; sens: string }[];
};

export const MODULES: Module[] = [
  {
    slug: 'cost',
    nom: 'Cheetah Cost',
    dimension: 'L’argent',
    accent: 'volt',
    accentHex: '#CDF564',
    promesse: 'Savoir où va le budget, pendant qu’on peut encore agir.',
    intro:
      "Cheetah Cost tient la chaîne complète d’un budget de projet : budget initial, budget à date, dépenses engagées, avancement physique, valeur acquise, reste à faire, coût prévisionnel et écart. Le tout ligne budgétaire par ligne budgétaire, à une date d’arrêté donnée.",
    capture: {
      src: '/screenshot-cost.webp',
      alt:
        'Interface Cheetah Cost : tableau de lignes budgétaires avec colonnes Budget initial, Variation, Budget à date, Dépenses, Avancement physique, Valeur acquise, Reste à faire, Coût prévisionnel et Écart.',
      legende:
        'Capture réelle de Cheetah Cost. Les valeurs affichées proviennent d’un projet de test de l’éditeur.',
    },
    capacites: [
      {
        label: 'Tableau de lignes budgétaires',
        preuve: 'demontre',
        detail: 'Codes LB, intitulés, saisie active, verrouillage et enregistrement de version.',
      },
      {
        label: 'Budget initial → Variation → Budget à date',
        preuve: 'demontre',
        detail: 'La chaîne de révision budgétaire est tenue colonne par colonne.',
      },
      {
        label: 'Avancement physique et valeur acquise',
        preuve: 'demontre',
        detail: 'L’avancement est saisi en pourcentage et converti en valeur acquise.',
      },
      {
        label: 'Reste à faire et coût prévisionnel',
        preuve: 'demontre',
        detail: 'Le coût prévisionnel se recompose à chaque arrêté.',
      },
      {
        label: 'Écart en valeur et en pourcentage du budget à date',
        preuve: 'demontre',
        detail: 'Colonnes E et E/BàD, plus l’écart précédent pour lire la tendance.',
      },
      {
        label: 'Arrêtés successifs et conditions économiques',
        preuve: 'demontre',
        detail: 'Les montants sont exprimés en kEUR HT aux conditions économiques d’une date donnée.',
      },
      { label: 'Export Excel et collage depuis Excel', preuve: 'demontre' },
      { label: 'Vue graphique du budget', preuve: 'demontre' },
      { label: 'Alertes de seuil sur les écarts', preuve: 'decrit' },
      { label: 'Exports PDF et Word', preuve: 'decrit' },
      { label: 'Journal d’audit des modifications', preuve: 'decrit' },
    ],
    lexique: [
      { terme: 'BI', sens: 'Budget initial — le budget voté au lancement.' },
      { terme: 'BàD', sens: 'Budget à date — le budget initial corrigé des variations validées.' },
      { terme: 'Val. acquise', sens: 'Valeur du travail réellement effectué, au budget.' },
      { terme: 'RàF', sens: 'Reste à faire — ce qu’il faudra encore dépenser pour finir.' },
      { terme: 'CP', sens: 'Coût prévisionnel — dépensé + reste à faire, soit le coût final attendu.' },
      { terme: 'E / E/BàD', sens: 'Écart entre coût prévisionnel et budget à date, en valeur puis en %.' },
    ],
  },
  {
    slug: 'time',
    nom: 'Cheetah Time',
    dimension: 'Le temps',
    accent: 'amber',
    accentHex: '#F2A93B',
    promesse: 'Voir la date de fin bouger avant qu’elle ne soit annoncée.',
    intro:
      "Cheetah Time tient la planification hiérarchique d’un projet : structure WBS, liens de dépendance, calendrier ouvré, chemin critique, marges et dérive par rapport à la baseline. Le portefeuille remonte l’avancement du plan, la fin prévisionnelle et l’écart de baseline.",
    capture: {
      src: '/screenshot-time.webp',
      alt:
        'Interface Cheetah Time : fiche projet avec avancement du plan, fin prévisionnelle, chaîne critique, écart de baseline et liste de tâches WBS.',
      legende:
        'Capture réelle de Cheetah Time. Le projet affiché est un jeu de démonstration de l’éditeur, pas un client.',
    },
    capacites: [
      { label: 'Structure de tâches WBS hiérarchique', preuve: 'demontre' },
      {
        label: 'Moteur de dépendances FS, SS, FF, SF',
        preuve: 'demontre',
        detail: 'Avec détection de cycles et analyse des marges.',
      },
      {
        label: 'Calendrier ouvré et exceptions',
        preuve: 'demontre',
        detail: 'Règles calendrier, jours non travaillés, captures de baseline.',
      },
      { label: 'Chaîne critique — tâches à marge nulle', preuve: 'demontre' },
      { label: 'Fin prévisionnelle vs date cible', preuve: 'demontre' },
      { label: 'Écart de baseline en jours', preuve: 'demontre' },
      { label: 'Avancement du plan en pourcentage', preuve: 'demontre' },
      { label: 'Statut de risque au niveau projet', preuve: 'demontre', detail: 'Marqueurs « actif » et « à risque » sur la fiche projet.' },
      { label: 'Radar jalons et pression ressource', preuve: 'demontre' },
      { label: 'Alertes de retard automatiques', preuve: 'decrit' },
      { label: 'Rapports d’avancement exportables', preuve: 'decrit' },
    ],
  },
  {
    slug: 'doc',
    nom: 'Cheetah Doc',
    dimension: 'La preuve',
    accent: 'champagne',
    accentHex: '#E9C9A0',
    promesse: 'Une seule version qui fait foi, et la trace de qui a vu quoi.',
    intro:
      "Cheetah Doc centralise les livrables d’un projet, les versionne et en contrôle l’accès. C’est la couche qui permet de rattacher une décision budgétaire ou calendaire à la pièce qui la justifie.",
    capacites: [
      { label: 'Gestion documentaire centralisée par projet', preuve: 'decrit' },
      { label: 'Versioning automatique des fichiers', preuve: 'decrit' },
      { label: 'Partage sécurisé par rôle (RBAC)', preuve: 'decrit' },
      { label: 'Archivage structuré par projet', preuve: 'decrit' },
      { label: 'Recherche plein texte', preuve: 'decrit' },
      { label: 'Traçabilité des accès', preuve: 'decrit' },
    ],
  },
];

export const MODULE_PAR_SLUG = Object.fromEntries(MODULES.map((m) => [m.slug, m])) as Record<
  Module['slug'],
  Module
>;

/* ──────────────────────────────────────────────────────────────────────
   ROADMAP — strictement séparée des modules disponibles
   ────────────────────────────────────────────────────────────────────── */

export const ROADMAP = [
  {
    nom: 'Cheetah Report',
    objet: 'Reporting consolidé multi-projets',
    description:
      'Tableaux de bord décisionnels et rapports automatisés au-dessus de Cost, Time et Doc. Aujourd’hui, le reporting passe par les exports des modules existants.',
    intentions: [
      'Vue portefeuille consolidée',
      'Rapports périodiques automatisés',
      'Indicateurs croisés coûts / délais',
    ],
  },
  {
    nom: 'Cheetah Risk',
    objet: 'Registre de risques relié au budget',
    description:
      'Matrice de risques, scoring probabilité / impact et plans d’action, rattachés aux lignes budgétaires et aux jalons concernés.',
    intentions: ['Registre de risques projet', 'Scoring probabilité / impact', 'Plans d’action assignés'],
  },
  {
    nom: 'Cheetah Connect',
    objet: 'Interopérabilité avec le SI existant',
    description:
      'API et connecteurs pour supprimer les doubles saisies entre Cheetah et les outils déjà en place.',
    intentions: ['API REST documentée', 'Connecteurs ERP', 'Webhooks d’événements'],
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   LE PROBLÈME — ce que Cheetah cherche à résoudre
   ────────────────────────────────────────────────────────────────────── */

export const FRICTIONS = [
  {
    code: 'F-01',
    titre: 'Le budget vit dans douze fichiers',
    texte:
      'Chaque responsable tient sa version. La consolidation est manuelle, mensuelle, et déjà périmée quand elle arrive.',
  },
  {
    code: 'F-02',
    titre: 'L’avancement n’est pas chiffré',
    texte:
      'On sait ce qui est dépensé. On ne sait pas ce qui est produit. Sans valeur acquise, un projet en retard ressemble à un projet dans le budget.',
  },
  {
    code: 'F-03',
    titre: 'Le planning et les coûts ne se parlent pas',
    texte:
      'Le glissement d’un jalon ne déclenche aucune révision du coût prévisionnel. L’écart apparaît des semaines plus tard.',
  },
  {
    code: 'F-04',
    titre: 'La pièce justificative est introuvable',
    texte:
      'Un avenant est validé, le fichier circule par mail, et personne ne sait plus quelle version fait foi.',
  },
  {
    code: 'F-05',
    titre: 'La dérive se découvre trop tard',
    texte:
      'Quand l’écart devient visible dans le reporting financier, la marge de manœuvre a déjà disparu.',
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   MÉTHODE
   ────────────────────────────────────────────────────────────────────── */

export const METHODE_ETAPES = [
  {
    n: '01',
    titre: 'Référence',
    sous: 'Budget initial',
    texte:
      'On fige un budget initial ligne par ligne, avec son périmètre et sa date de conditions économiques. C’est la seule référence contre laquelle tout le reste sera mesuré.',
    colonnes: ['BI'],
  },
  {
    n: '02',
    titre: 'Révision',
    sous: 'Budget à date',
    texte:
      'Les variations validées — avenants, transferts, aléas — s’ajoutent au budget initial. Le budget à date est la cible courante ; le budget initial, lui, ne bouge jamais.',
    colonnes: ['Variation', 'BàD'],
  },
  {
    n: '03',
    titre: 'Mesure',
    sous: 'Dépenses et avancement physique',
    texte:
      'À chaque arrêté, on saisit deux choses distinctes : ce qui a été dépensé, et ce qui a réellement été produit en pourcentage d’avancement. La valeur acquise est le produit de l’avancement par le budget.',
    colonnes: ['Dépenses', 'Avancement physique', 'Val. acquise'],
  },
  {
    n: '04',
    titre: 'Projection',
    sous: 'Reste à faire et coût prévisionnel',
    texte:
      'Le reste à faire est réestimé, pas déduit mécaniquement. Coût prévisionnel = dépensé + reste à faire. C’est la prévision de coût final de la ligne.',
    colonnes: ['RàF', 'CP'],
  },
  {
    n: '05',
    titre: 'Décision',
    sous: 'Écart et tendance',
    texte:
      'L’écart compare le coût prévisionnel au budget à date, en valeur et en pourcentage. Comparé à l’écart de l’arrêté précédent, il donne une tendance — c’est elle qui déclenche l’action, pas le niveau absolu.',
    colonnes: ['E', 'E/BàD', 'E préc.', 'D'],
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   À QUI ÇA S'ADRESSE
   ────────────────────────────────────────────────────────────────────── */

export const CIBLES = [
  {
    role: 'Direction de projet et PMO',
    besoin: 'Une vue consolidée qui tient la semaine où le comité de pilotage a lieu.',
  },
  {
    role: 'Contrôle de gestion projet',
    besoin: 'Reconstituer un coût prévisionnel défendable sans passer trois jours dans Excel.',
  },
  {
    role: 'Maîtrise d’ouvrage et AMO',
    besoin: 'Rendre compte au commanditaire avec des chiffres traçables jusqu’à la ligne.',
  },
  {
    role: 'Bureaux d’études et ingénierie',
    besoin: 'Piloter plusieurs affaires en parallèle sans déployer un ERP.',
  },
  {
    role: 'PME industrielles et travaux',
    besoin: 'Structurer le suivi d’affaires sans la rigidité d’un progiciel lourd.',
  },
  {
    role: 'Structures publiques',
    besoin: 'Tracer les décisions budgétaires et produire les pièces de justification.',
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   ALTERNATIVES — comparaison honnête, sans dénigrement
   ────────────────────────────────────────────────────────────────────── */

export const ALTERNATIVES = [
  {
    nom: 'Tableurs maison',
    pour: 'Souples, déjà en place, maîtrisés par les équipes.',
    contre: 'Pas de version unique, pas de traçabilité, consolidation manuelle.',
  },
  {
    nom: 'ERP généralistes',
    pour: 'Robustes et structurants à l’échelle de l’entreprise.',
    contre: 'Projet d’implémentation lourd, rarement calibré pour le suivi d’affaires fin.',
  },
  {
    nom: 'Outils de gestion de tâches',
    pour: 'Adoption immédiate, collaboration simple.',
    contre: 'Pas de notion de budget à date, de valeur acquise ni de coût prévisionnel.',
  },
  {
    nom: 'Planificateurs purs',
    pour: 'Moteur de planification mature.',
    contre: 'Le planning n’est pas relié au budget ni aux pièces justificatives.',
  },
  {
    nom: 'Suites PPM d’entreprise',
    pour: 'Couverture fonctionnelle très large.',
    contre: 'Dimensionnées pour de grandes organisations, cycle de déploiement long.',
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   PLATEFORME — uniquement ce qui est déclaré par l'éditeur.
   Les certifications et les engagements chiffrés de disponibilité ne sont
   pas publiés ici tant qu'ils ne sont pas documentés.
   ────────────────────────────────────────────────────────────────────── */

export const PLATEFORME = [
  {
    titre: 'Hébergement en France',
    texte:
      'L’éditeur déclare héberger les données en France. Le détail de l’hébergeur et les engagements associés sont communiqués dans le cadre contractuel.',
    preuve: 'decrit' as Preuve,
  },
  {
    titre: 'Chiffrement en transit et au repos',
    texte: 'TLS pour les échanges, chiffrement des données stockées.',
    preuve: 'decrit' as Preuve,
  },
  {
    titre: 'Contrôle d’accès par rôle',
    texte: 'Droits attribués par projet et par rôle, avec journalisation des accès.',
    preuve: 'decrit' as Preuve,
  },
  {
    titre: 'Authentification renforcée',
    texte: 'Authentification multifacteur, et intégration d’un fournisseur d’identité d’entreprise.',
    preuve: 'decrit' as Preuve,
  },
  {
    titre: 'Sortie des données sans friction',
    texte:
      'Export des données au format tableur. L’export Excel est visible dans l’interface Cost.',
    preuve: 'demontre' as Preuve,
  },
  {
    titre: 'Sauvegardes régulières',
    texte: 'Sauvegardes chiffrées périodiques. La fréquence et les objectifs de reprise sont contractuels.',
    preuve: 'decrit' as Preuve,
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   PARCOURS D'ENTRÉE
   ────────────────────────────────────────────────────────────────────── */

export const PARCOURS = [
  {
    n: '01',
    titre: 'Cadrage',
    duree: '30 minutes',
    texte:
      'On regarde comment vous pilotez aujourd’hui : d’où viennent les chiffres, qui les consolide, à quel rythme, et où ça casse.',
  },
  {
    n: '02',
    titre: 'Démonstration sur votre cas',
    duree: 'Sur un projet réel',
    texte:
      'On reprend une de vos affaires et on la monte dans Cheetah. Vous voyez vos propres lignes budgétaires, pas un jeu de données de catalogue.',
  },
  {
    n: '03',
    titre: 'Mise en service',
    duree: 'Accompagnée',
    texte:
      'Reprise des données existantes, paramétrage, formation des utilisateurs, validation des premiers arrêtés.',
  },
] as const;

/* ──────────────────────────────────────────────────────────────────────
   NAVIGATION
   ────────────────────────────────────────────────────────────────────── */

export const NAV = [
  {
    label: 'Produits',
    href: '/solutions/',
    enfants: [
      { label: 'Cheetah Cost', href: '/cheetah-cost/', desc: 'Budget, valeur acquise, coût prévisionnel' },
      { label: 'Cheetah Time', href: '/cheetah-time/', desc: 'WBS, dépendances, chemin critique' },
      { label: 'Cheetah Doc', href: '/cheetah-doc/', desc: 'Livrables, versions, traçabilité' },
      { label: 'Feuille de route', href: '/roadmap/', desc: 'Report, Risk, Connect — à venir' },
    ],
  },
  { label: 'Méthode', href: '/methodologie/' },
  { label: 'Plateforme', href: '/plateforme/' },
  { label: 'Tarifs', href: '/tarifs/' },
  { label: 'Contact', href: '/contact/' },
] as const;
