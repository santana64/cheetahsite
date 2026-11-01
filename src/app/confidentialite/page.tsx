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
          donnée de navigation n’est transmise à un tiers par le code de ce site.
        </p>
        <p>
          Le formulaire de contact ne transmet rien à un serveur : il compose un message dans votre
          propre logiciel de messagerie, que vous restez libre d’envoyer ou non. Tant que vous ne
          l’envoyez pas, rien ne quitte votre poste.
        </p>
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
          Si vous nous écrivez, les informations contenues dans votre message (nom, organisation,
          adresse e-mail, description de votre contexte) sont utilisées uniquement pour répondre à
          votre demande et préparer un éventuel échange. Elles ne sont ni revendues, ni versées à
          une liste de diffusion, ni utilisées pour une prospection non sollicitée.
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
