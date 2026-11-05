import type { Metadata } from 'next';
import styles from '@/components/ui.module.css';
import { pageMetadata } from '@/lib/metadata';
import { CtaBand, PageHero, ProofTag } from '@/components/ui';
import { PLATEFORME } from '@/content/cheetah';

export const metadata: Metadata = {
  ...pageMetadata('/plateforme/', 'Plateforme, sécurité et données', 'Ce que l’éditeur déclare sur l’hébergement, le chiffrement, les droits d’accès et la réversibilité des données — et ce qui relève du cadre contractuel.'),
};

const REVERSIBILITE = [
  {
    titre: 'Vos données restent les vôtres',
    texte:
      'Les données saisies dans Cheetah appartiennent à votre organisation. Leur export au format tableur est une fonction du produit, pas une faveur commerciale.',
  },
  {
    titre: 'Pas de dépendance à un format propriétaire',
    texte:
      'La structure budgétaire exportée reste lisible et réexploitable hors de Cheetah, y compris après la fin d’un contrat.',
  },
  {
    titre: 'Pas de revente ni d’exploitation secondaire',
    texte:
      'Les données de projet ne sont ni revendues, ni agrégées à des fins commerciales, ni utilisées pour entraîner un modèle.',
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        code="03 / PLATEFORME"
        entries={[{"label": "Accès · déclaré", "value": "Rôles / authentification renforcée"}, {"label": "Données · déclaré", "value": "Hébergement France / chiffrement"}, {"label": "Réversibilité", "value": "Export tableur"}]}
        fil={[{ label: 'Accueil', href: '/' }, { label: 'Plateforme' }]}
        eyebrow="Plateforme et données"
        titre="Ce que nous pouvons écrire, et ce qui se signe."
        chapeau="Les engagements de sécurité d’un logiciel de gestion se vérifient dans un contrat et des attestations, pas dans une rangée de logos. Cette page distingue donc ce qui est démontrable aujourd’hui de ce qui relève du cadre contractuel."
      />

      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Dispositions déclarées</p>
            <h2 className="display-md mt-6 text-paper">Architecture et exploitation.</h2>
            <p className="body-copy mt-5 max-w-prose">
              Chaque ligne porte son niveau de preuve. « Décrit » signifie que l’éditeur l’annonce
              sans qu’une attestation publique soit jointe à ce site.
            </p>
          </div>
          <ul className={`lg:col-span-8 ${styles.architecture}`}>
            {PLATEFORME.map((p, i) => (
              <li key={p.titre} className="reveal border-t border-white/[0.08] py-6" data-reveal-delay={i * 50}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-paper">{p.titre}</h3>
                  <ProofTag preuve={p.preuve} compact />
                </div>
                <p className="body-copy mt-2 max-w-prose text-sm">{p.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-ink-850 py-20 md:py-24">
        <div className="shell">
          <p className="eyebrow">Réversibilité</p>
          <h2 className="display-md mt-6 max-w-2xl text-paper">
            Un outil de contrôle ne doit pas devenir une captivité.
          </h2>
          <div className="mt-12 grid gap-px sm:grid-cols-3">
            {REVERSIBILITE.map((r) => (
              <div key={r.titre} className="reveal border-t border-white/[0.08] py-7 sm:pr-8">
                <h3 className="text-base font-semibold text-paper">{r.titre}</h3>
                <p className="body-copy mt-3 text-sm">{r.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-bone py-20 text-ink-800 md:py-24">
        <div className="shell max-w-3xl">
          <p className="eyebrow !text-ink-500">Certifications et niveaux de service</p>
          <h2 className="display-md mt-6 text-ink-900">
            Pourquoi vous ne verrez pas de badges ici.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-800/75">
            Afficher un label de certification ou un pourcentage de disponibilité engage. Tant que
            l’attestation correspondante n’est pas publiée et que l’engagement n’est pas inscrit au
            contrat, le mentionner sur une page d’accueil n’apporte aucune garantie à l’acheteur —
            seulement une impression.
          </p>
          <p className="mt-5 text-base leading-relaxed text-ink-800/75">
            Si votre procédure d’achat exige des éléments formels — localisation précise de
            l’hébergement, sous-traitants, politique de sauvegarde, objectifs de reprise, accord de
            traitement des données —, demandez-les : ils sont fournis dans le cadre de l’instruction
            du dossier, avec les pièces qui les appuient.
          </p>
        </div>
      </section>

      <CtaBand
        titre="Besoin du dossier de sécurité complet ?"
        texte="Indiquez le périmètre exigé par votre procédure d’achat. Nous répondons avec les pièces, ou nous vous disons ce que nous n’avons pas."
        primaire={{ label: 'Demander le dossier', href: '/contact/' }}
      />
    </>
  );
}
