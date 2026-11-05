import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import LegalLayout, { ANotifier, LegalChecklist } from '@/components/LegalLayout';
import { CONTACT } from '@/content/cheetah';

export const metadata: Metadata = {
  ...pageMetadata('/mentions-legales/', 'Mentions légales', 'Éditeur, hébergeur, propriété intellectuelle et contact du site CheetahSoft.'),
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <LegalLayout
      titre="Mentions légales"
      fil={[{ label: 'Accueil', href: '/' }, { label: 'Mentions légales' }]}
      intro="Informations relatives à l’éditeur et à l’hébergement de ce site, conformément à l’article 6 de la loi pour la confiance dans l’économie numérique."
    >
      <section>
        <h2>Éditeur du site</h2>
        <p>
          {CONTACT.societe} — contact :{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-volt underline-offset-4 hover:underline">
            {CONTACT.email}
          </a>
        </p>
        <div className="mt-5">
          <ANotifier>
            Forme juridique, capital social, adresse du siège, numéro d’immatriculation au registre
            du commerce et des sociétés, numéro de TVA intracommunautaire et nom du directeur de la
            publication. Ces éléments sont obligatoires et ne peuvent pas être reconstitués par un
            tiers : ils doivent être renseignés par l’éditeur avant la mise en ligne publique.
          </ANotifier>
        </div>
      </section>

      <LegalChecklist group="publisher" />

      <section>
        <h2>Hébergement</h2>
        <p>
          Ce site est publié sous forme de pages statiques. Le nom et l’adresse de l’hébergeur
          dépendent de la plateforme de publication retenue.
        </p>
        <div className="mt-5">
          <ANotifier>
            Raison sociale, adresse et numéro de téléphone de l’hébergeur effectif du site.
          </ANotifier>
        </div>
      </section>

      <LegalChecklist group="hosting" />

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus de ce site — textes, interfaces, représentations graphiques,
          captures d’écran du logiciel et code source de la vitrine — est protégé par le droit de la
          propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans
          autorisation écrite préalable est interdite.
        </p>
        <p>
          Les captures d’écran présentées illustrent les logiciels édités par {CONTACT.societe} et
          affichent des jeux de données de test. Elles ne représentent aucun projet client réel.
        </p>
      </section>

      <section>
        <h2>Responsabilité</h2>
        <p>
          Les informations publiées sur ce site sont fournies à titre indicatif. Les capacités
          logicielles sont signalées par un niveau de preuve : « démontré » lorsqu’une capture du
          produit l’atteste sur ce site, « décrit » lorsqu’il s’agit d’une déclaration de l’éditeur,
          « en développement » pour les modules annoncés et non disponibles.
        </p>
        <p>
          Les tarifs affichés sont indicatifs, hors taxes, et ne constituent pas une offre
          contractuelle. Seul un devis signé engage les parties.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Pour toute question relative à ce site ou pour signaler un contenu, écrivez à{' '}
          <a href={`mailto:${CONTACT.email}`} className="text-volt underline-offset-4 hover:underline">
            {CONTACT.email}
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
