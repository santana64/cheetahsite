import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/ui';
import { ROADMAP } from '@/content/cheetah';

export const metadata: Metadata = {
  title: 'Feuille de route',
  description:
    'Report, Risk et Connect sont en développement. Aucune date d’ouverture n’est annoncée tant qu’elle n’est pas tenable.',
};

export default function Page() {
  return (
    <>
      <PageHero
        fil={[{ label: 'Accueil', href: '/' }, { label: 'Produits', href: '/solutions/' }, { label: 'Feuille de route' }]}
        eyebrow="En développement"
        titre="Trois modules annoncés. Aucun vendable aujourd’hui."
        chapeau="Cette page existe pour que la distinction soit nette. Rien de ce qui suit n’est accessible, inclus dans une offre, ni démontrable. Les intentions décrites peuvent évoluer."
        accent="#f2a93b"
      />

      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <div className="mb-14 flex items-start gap-4 border-l-2 border-amber bg-amber/[0.06] p-6">
            <p className="max-w-3xl text-sm leading-relaxed text-steel-200">
              <strong className="text-amber">Aucune date n’est communiquée.</strong> Annoncer un
              trimestre d’ouverture sur un site public engage une équipe de développement sur un
              calendrier qu’elle ne maîtrise pas entièrement. Si l’un de ces modules conditionne
              votre décision, demandez-nous où en est le travail : nous répondrons avec l’état
              réel.
            </p>
          </div>

          <ol className="space-y-px">
            {ROADMAP.map((r, i) => (
              <li key={r.nom} className="reveal grid gap-8 border-t border-white/[0.08] py-10 md:grid-cols-12">
                <div className="md:col-span-1">
                  <span className="num text-sm text-steel-500">0{i + 1}</span>
                </div>
                <div className="md:col-span-4">
                  <h2 className="display-md text-steel-200">{r.nom}</h2>
                  <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-amber">
                    {r.objet}
                  </p>
                </div>
                <div className="md:col-span-7">
                  <p className="body-copy max-w-prose">{r.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {r.intentions.map((it) => (
                      <li
                        key={it}
                        className="rounded-sm border border-white/[0.1] px-2.5 py-1 font-mono text-[0.6875rem] text-steel-400"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        titre="Un de ces modules est bloquant pour vous ?"
        texte="Dites-le. Soit nous vous donnons l’état réel du développement, soit nous vous expliquons comment couvrir le besoin avec les modules existants — ou nous vous disons que ce n’est pas possible aujourd’hui."
        primaire={{ label: 'Poser la question', href: '/contact/' }}
        secondaire={{ label: 'Voir les modules disponibles', href: '/solutions/' }}
      />
    </>
  );
}
