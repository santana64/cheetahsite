import type { Metadata } from 'next';
import LegalLayout, { ANotifier } from '@/components/LegalLayout';
import { CONTACT } from '@/content/cheetah';

export const metadata: Metadata = {
  title: 'Conditions générales',
  description:
    'Cadre contractuel de la fourniture des modules Cheetah : objet, durée, prix, niveaux de service, données et réversibilité.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <LegalLayout
      titre="Conditions générales"
      fil={[{ label: 'Accueil', href: '/' }, { label: 'Conditions générales' }]}
      intro="Ce site affiche des tarifs : il doit donc indiquer le cadre dans lequel ils s’appliquent. Cette page décrit la structure du contrat. Elle ne remplace pas le contrat lui-même, qui prévaut en cas de divergence."
    >
      <section>
        <h2>Objet</h2>
        <p>
          {CONTACT.societe} fournit un accès en ligne aux modules Cheetah Cost, Cheetah Time et
          Cheetah Doc, selon le périmètre souscrit, ainsi que les prestations d’accompagnement
          associées. Les modules annoncés comme en développement ne sont inclus dans aucune offre
          et ne font l’objet d’aucun engagement de date.
        </p>
      </section>

      <section>
        <h2>Commande et devis</h2>
        <p>
          Les tarifs publiés sur ce site sont indicatifs et hors taxes. Ils ne constituent pas une
          offre contractuelle. Seul un devis signé engage les parties ; il précise le périmètre
          fonctionnel, le nombre d’utilisateurs, le montant de la mise en service et les
          prestations additionnelles retenues.
        </p>
      </section>

      <section>
        <h2>Mise en service</h2>
        <p>
          La mise en service couvre le paramétrage, la reprise des données existantes et la
          formation des utilisateurs. Elle est facturée séparément de l’abonnement, son montant
          dépendant du volume et de l’état des données à reprendre. Elle suppose la mise à
          disposition par le client des éléments nécessaires — structure budgétaire, fichiers
          source, interlocuteurs désignés.
        </p>
      </section>

      <section>
        <h2>Durée, renouvellement et résiliation</h2>
        <div className="mt-3">
          <ANotifier>
            Durée d’engagement initiale, modalités de reconduction, préavis de résiliation et
            conditions de remboursement en cas de résiliation anticipée. Ces éléments relèvent de
            la politique commerciale de l’éditeur et ne peuvent pas être présumés.
          </ANotifier>
        </div>
      </section>

      <section>
        <h2>Prix et facturation</h2>
        <p>
          L’abonnement est facturé selon la périodicité indiquée au devis. Les prestations
          additionnelles sont facturées à leur réalisation. Les montants publiés sur ce site sont
          exprimés hors taxes, en euros.
        </p>
        <div className="mt-3">
          <ANotifier>
            Périodicité de facturation, délai de paiement, conditions de révision tarifaire et
            pénalités de retard applicables.
          </ANotifier>
        </div>
      </section>

      <section>
        <h2>Niveaux de service</h2>
        <p>
          Les engagements de disponibilité, les délais de prise en charge des incidents et les
          éventuelles pénalités associées sont définis dans le contrat de service, en fonction de
          l’offre souscrite. Ils ne sont volontairement pas publiés sur ce site : un engagement de
          niveau de service n’a de valeur qu’adossé à un contrat et à une mesure.
        </p>
      </section>

      <section>
        <h2>Données du client</h2>
        <p>
          Les données saisies dans Cheetah restent la propriété du client. Elles ne sont ni
          revendues, ni agrégées à des fins commerciales, ni utilisées pour entraîner un modèle.
          Leur export au format tableur est une fonction du produit, accessible pendant toute la
          durée du contrat.
        </p>
        <p>
          Le traitement des données à caractère personnel fait l’objet d’un accord distinct, fourni
          avec le contrat.
        </p>
      </section>

      <section>
        <h2>Réversibilité</h2>
        <p>
          À l’échéance du contrat, le client peut exporter l’intégralité de ses données dans un
          format réexploitable hors de Cheetah. Les modalités et le délai de conservation des
          données après la fin du contrat sont précisés au contrat.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Le contrat confère un droit d’usage des modules souscrits pendant sa durée. Il n’emporte
          aucun transfert de propriété sur le logiciel, ses composants ou sa documentation.
        </p>
      </section>

      <section>
        <h2>Droit applicable et litiges</h2>
        <div className="mt-3">
          <ANotifier>
            Droit applicable, juridiction compétente et, le cas échéant, dispositif de médiation
            auquel l’éditeur adhère.
          </ANotifier>
        </div>
        <p>
          Pour toute question sur ce cadre, écrivez à{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-volt underline-offset-4 hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
