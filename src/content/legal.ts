/** Fill only from the publisher's official documents; null means publication is blocked. */
export const LEGAL = {
  legalName: null,
  legalForm: null,
  shareCapital: null,
  registeredOffice: null,
  registration: null,
  vatNumber: null,
  publicationDirector: null,
  hostName: null,
  hostAddress: null,
  hostPhone: null,
  commitment: null,
  cancellation: null,
  billing: null,
  jurisdiction: null,
  logRetention: null,
  contactRetention: null,
} satisfies Record<string, string | null>;

export const LEGAL_GROUPS = {
  publisher: [['legalName', 'Raison sociale'], ['legalForm', 'Forme juridique'], ['shareCapital', 'Capital social'], ['registeredOffice', 'Siège social'], ['registration', 'Immatriculation'], ['vatNumber', 'TVA intracommunautaire'], ['publicationDirector', 'Directeur de publication']],
  hosting: [['hostName', 'Hébergeur'], ['hostAddress', 'Adresse'], ['hostPhone', 'Téléphone']],
  contract: [['commitment', 'Durée et renouvellement'], ['cancellation', 'Résiliation'], ['billing', 'Facturation et paiement'], ['jurisdiction', 'Droit applicable et juridiction']],
} as const;
