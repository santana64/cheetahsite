import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import ContactForm from '@/components/ContactForm';
import { PageHero } from '@/components/ui';
import { CONTACT, PARCOURS } from '@/content/cheetah';

export const metadata: Metadata = {
  ...pageMetadata('/contact/', 'Demander une démonstration', 'Trente minutes sur un de vos projets. On monte vos lignes budgétaires dans Cheetah et vous jugez sur pièce.'),
};

export default function Page() {
  return (
    <>
      <PageHero
        fil={[{ label: 'Accueil', href: '/' }, { label: 'Contact' }]}
        eyebrow="Prise de contact"
        titre={
          <>
            Apportez un projet.
            <br />
            De préférence un qui dérive.
          </>
        }
        chapeau="La démonstration se fait sur vos données, pas sur un jeu de catalogue. À la fin de l’échange, vous savez si Cheetah vous sert — et si non, on vous le dit."
      />

      <section className="bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-5">
            <p className="eyebrow">Comment ça se passe</p>
            <ol className="mt-8 space-y-px">
              {PARCOURS.map((p) => (
                <li key={p.n} className="reveal border-t border-white/[0.08] py-6">
                  <div className="flex items-baseline gap-4">
                    <span className="num text-xs text-volt">{p.n}</span>
                    <div>
                      <h2 className="text-base font-semibold text-paper">{p.titre}</h2>
                      <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-steel-500">
                        {p.duree}
                      </p>
                      <p className="body-copy mt-3 text-sm">{p.texte}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 border-t border-white/[0.08] pt-8">
              <p className="eyebrow">Écrire directement</p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-4 block font-mono text-lg text-volt underline-offset-4 hover:underline"
              >
                {CONTACT.email}
              </a>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-steel-500">
                Nous ne pratiquons ni relance automatisée, ni inscription à une liste de diffusion.
                Votre message sert à préparer l’échange, rien d’autre.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
