import type { Metadata } from 'next';
import LegalLayout, { ANotifier } from '@/components/LegalLayout';
import { CONTACT } from '@/content/cheetah';

export const metadata: Metadata = {
  title: 'Confidentialité',
  description:
    'Ce que ce site collecte — c’est-à-dire rien — et comment sont traitées les données transmises par e-mail.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <LegalLayout
      titre="Confidentialité"
      fil={[{ label: 'Accueil', href: '/' }, { label: 'Confidentialité' }]}
      intro="Cette page décrit le traitement des données personnelles dans le cadre de ce site vitrine. Elle ne couvre pas l’application Cheetah elle-même, régie par le contrat de service."
    >
      <section>
        <h2>Ce que ce site collecte</h2>
        <p>
          Ce site est publié en pages statiques. Il ne dépose aucun cookie, n’intègre aucun outil de
          mesure d’audience, aucun pixel publicitaire et aucun lecteur de réseau social. Aucune
          donnée de navigation n’est transmise à un tiers par le code de ce site, et aucune donnée
          n’est conservée sur ce site lui-même.
        </p>
      </section>

      <section>
        <h2>Le formulaire de contact</h2>
        <p>
          Ce site n’ayant pas de serveur applicatif, l’envoi du formulaire passe par un prestataire
          d’acheminement de formulaires, qui reçoit votre demande et nous la relaie par e-mail. Ce
          prestataire agit comme sous-traitant au sens du règlement général sur la protection des
          données.
        </p>
        <p>Les seules données transmises sont celles que vous saisissez :</p>
        <ul>
          <li>votre nom ;</li>
          <li>votre organisation ;</li>
          <li>votre adresse e-mail professionnelle ;</li>
          <li>votre fonction, si vous la renseignez — le champ est facultatif ;</li>
          <li>le texte décrivant votre contexte.</li>
        </ul>
        <p>
          Il n’y a ni champ caché collectant autre chose, ni traceur associé à l’envoi. Le
          formulaire comporte un champ-piège invisible, destiné aux robots : il n’est jamais rempli
          par une personne et son contenu n’est pas exploité.
        </p>
        <p>
          La base légale est l’intérêt légitime à répondre à une sollicitation commerciale que vous
          avez initiée. Ces données servent uniquement à vous répondre et à préparer l’échange :
          elles ne sont ni revendues, ni versées à une liste de diffusion, ni utilisées pour une
          prospection non sollicitée.
        </p>
        <p>
          Si vous préférez ne pas passer par ce prestataire, écrivez-nous directement à{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-volt underline-offset-4 hover:underline">
            {CONTACT.email}
          </a>
          . Le formulaire propose d’ailleurs ce chemin en cas d’échec d’envoi.
        </p>
        <div className="mt-5">
          <ANotifier>
            Identité et pays d’établissement du prestataire d’acheminement retenu, existence d’un
            accord de sous-traitance, et durée de conservation des demandes de son côté comme du
            nôtre. Ces éléments dépendent du prestataire effectivement configuré et doivent être
            renseignés avant la mise en ligne publique.
          </ANotifier>
        </div>
      </section>

      <section>
        <h2>Journaux techniques de l’hébergeur</h2>
        <p>
          Comme tout site web, les requêtes vers ce site peuvent être enregistrées par l’hébergeur
          dans des journaux techniques (adresse IP, horodatage, page demandée) à des fins de
          sécurité et de disponibilité. Ce traitement relève de l’hébergeur.
        </p>
        <div className="mt-5">
          <ANotifier>
            Identité de l’hébergeur, durée de conservation des journaux techniques et base légale
            retenue.
          </ANotifier>
        </div>
      </section>

      <section>
        <h2>Données transmises par e-mail</h2>
        <p>
          Si vous nous écrivez directement, par e-mail plutôt que par le formulaire, les
          informations contenues dans votre message sont utilisées de la même manière : répondre à
          votre demande et préparer un éventuel échange, rien d’autre.
        </p>
        <div className="mt-5">
          <ANotifier>
            Durée de conservation des échanges commerciaux et, le cas échéant, outils de gestion de
            la relation client utilisés pour les stocker.
          </ANotifier>
        </div>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et
          d’opposition sur les données vous concernant. Pour l’exercer, écrivez à{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-volt underline-offset-4 hover:underline">
            {CONTACT.email}
          </a>
          . Vous pouvez également introduire une réclamation auprès de l’autorité de contrôle
          compétente.
        </p>
      </section>
    </LegalLayout>
  );
}
