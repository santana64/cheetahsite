import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { CtaBand, PageHero } from '@/components/ui';

export const metadata: Metadata = {
  ...pageMetadata('/tarifs/', 'Tarifs et mise en service', 'Trois niveaux d’abonnement, une mise en service facturée séparément, et les prestations additionnelles chiffrées en fourchette. Sans palier caché.'),
};

const OFFRES = [
  {
    nom: 'Essentiel',
    prix: '199 €',
    periode: 'par mois',
    setup: 'Mise en service à partir de 1 500 €',
    pour: 'Une équipe, un périmètre de projets limité, un premier usage de Cheetah Cost.',
    inclus: [
      'Cheetah Cost',
      'Import de fichiers tableur',
      'Export CSV et Excel',
      'Sauvegardes périodiques',
      'Support par e-mail',
    ],
    phare: false,
  },
  {
    nom: 'Professionnel',
    prix: '599 €',
    periode: 'par mois',
    setup: 'Mise en service à partir de 4 500 €',
    pour: 'Plusieurs projets suivis en parallèle, plusieurs rôles, un reporting régulier à produire.',
    inclus: [
      'Cheetah Cost',
      'Cheetah Time ou Cheetah Doc',
      'Multi-projets et multi-utilisateurs',
      'Exports multi-formats',
      'Authentification multifacteur',
      'Support prioritaire',
      'Niveau de service défini au contrat',
    ],
    phare: true,
  },
  {
    nom: 'Entreprise',
    prix: 'Sur devis',
    periode: '',
    setup: 'Mise en service à partir de 10 000 €',
    pour: 'Maîtrises d’ouvrage et ETI avec contraintes d’achat, d’intégration ou d’hébergement.',
    inclus: [
      'Cost, Time et Doc',
      'Authentification d’entreprise déléguée',
      'Options d’isolement d’hébergement',
      'Accord de traitement des données',
      'Reprise de données et formation dédiées',
      'Niveau de service et pénalités au contrat',
    ],
    phare: false,
  },
];

const PRESTATIONS = [
  { label: 'Formation utilisateurs', prix: '800 – 1 500 € par session' },
  { label: 'Migration de fichiers tableur existants', prix: '1 000 – 5 000 €' },
  { label: 'Modèle d’import spécifique', prix: '800 – 3 000 €' },
  { label: 'Export personnalisé', prix: '800 – 2 500 €' },
  { label: 'Modèle documentaire métier', prix: '1 000 – 5 000 €' },
  { label: 'Connecteur vers un système tiers', prix: '3 000 – 15 000 €' },
];

export default function Page() {
  return (
    <>
      <PageHero
        fil={[{ label: 'Accueil', href: '/' }, { label: 'Tarifs' }]}
        eyebrow="Tarifs"
        titre="Un abonnement, une mise en service. Les deux sont réels."
        chapeau="La mise en service n’est pas une option commerciale : reprendre une structure budgétaire existante demande du travail. L’annoncer dès la page de tarifs évite une mauvaise surprise au devis."
      />

      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-px lg:grid-cols-3">
          {OFFRES.map((o) => (
            <div
              key={o.nom}
              className={`reveal relative flex flex-col border-t py-9 lg:px-8 lg:first:pl-0 lg:last:pr-0 ${
                o.phare ? 'border-volt' : 'border-white/[0.08]'
              }`}
            >
              {o.phare && (
                <span className="absolute -top-px left-0 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-volt lg:left-8">
                  <span className="block pt-3">Multi-projets</span>
                </span>
              )}
              <h2 className={`display-sm ${o.phare ? 'mt-8' : ''} text-paper`}>{o.nom}</h2>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="num text-4xl font-semibold text-paper">{o.prix}</span>
                {o.periode && <span className="text-sm text-steel-400">{o.periode}</span>}
              </p>
              <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                {o.setup}
              </p>
              <p className="body-copy mt-6 text-sm">{o.pour}</p>
              <ul className="mt-7 flex-1 space-y-2.5 border-t border-white/[0.08] pt-6">
                {o.inclus.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-steel-200">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-volt" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact/"
                className={`btn mt-8 w-full ${o.phare ? 'btn-primary' : 'btn-ghost'}`}
              >
                {o.prix === 'Sur devis' ? 'Parler de votre cadre d’achat' : 'Demander une démonstration'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-bone py-20 text-ink-800 md:py-24">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow !text-ink-500">Prestations additionnelles</p>
            <h2 className="display-md mt-6 text-ink-900">Facturées à part, parce qu’elles varient.</h2>
            <p className="mt-5 text-sm leading-relaxed text-ink-800/70">
              Ces fourchettes dépendent du volume, de l’état des données existantes et du nombre
              d’interlocuteurs. Elles sont indicatives et précisées au devis.
            </p>
          </div>
          <dl className="lg:col-span-8">
            {PRESTATIONS.map((p) => (
              <div
                key={p.label}
                className="reveal flex flex-wrap items-baseline justify-between gap-4 border-t border-ink-800/12 py-4"
              >
                <dt className="text-sm font-medium text-ink-900">{p.label}</dt>
                <dd className="num text-sm text-ink-800/65">{p.prix}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-ink-850 py-16">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Précisions</p>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-steel-300">
            <li>
              Montants hors taxes, en euros. Le cadre contractuel est décrit dans les{' '}
              <Link href="/cgv/" className="text-volt underline-offset-4 hover:underline">
                conditions générales
              </Link>
              .
            </li>
            <li>
              Les niveaux de disponibilité et les délais de prise en charge sont définis dans le
              contrat de service, pas sur cette page.
            </li>
            <li>
              Les modules Report, Risk et Connect sont en développement et ne sont inclus dans
              aucune offre.
            </li>
          </ul>
        </div>
      </section>

      <CtaBand
        titre="Un devis part toujours d’un cas réel."
        texte="Décrivez votre périmètre — nombre de projets, structure budgétaire, état des données — et nous chiffrons la mise en service sans forfait de principe."
        secondaire={{ label: 'Voir les produits', href: '/solutions/' }}
      />
    </>
  );
}
