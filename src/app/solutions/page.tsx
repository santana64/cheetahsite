import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand, PageHero, ProofTag } from '@/components/ui';
import { ALTERNATIVES, MODULES, ROADMAP } from '@/content/cheetah';

export const metadata: Metadata = {
  title: 'Les produits Cheetah',
  description:
    'Cost, Time et Doc : trois modules disponibles qui mesurent le même projet sous trois angles. Report, Risk et Connect sont en développement.',
};

export default function Page() {
  return (
    <>
      <PageHero
        fil={[{ label: 'Accueil', href: '/' }, { label: 'Produits' }]}
        eyebrow="Vue d’ensemble"
        titre="Trois modules disponibles. Trois annoncés. On ne les mélange pas."
        chapeau="Cost, Time et Doc sont utilisables aujourd’hui. Report, Risk et Connect sont en développement et apparaissent dans une feuille de route séparée — jamais présentés comme opérationnels."
      />

      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow mb-12">Disponibles</p>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <Link
                key={m.slug}
                href={`/cheetah-${m.slug}/`}
                className="group reveal flex flex-col border-t border-white/[0.08] py-9 transition-colors hover:bg-white/[0.02] lg:px-7 lg:first:pl-0 lg:last:pr-0"
              >
                <span
                  className="font-mono text-[0.625rem] uppercase tracking-[0.22em]"
                  style={{ color: m.accentHex }}
                >
                  {m.dimension}
                </span>
                <h2 className="display-md mt-4 text-paper transition-colors group-hover:text-volt">
                  {m.nom}
                </h2>
                <p className="mt-4 text-base leading-snug text-paper">{m.promesse}</p>
                <p className="body-copy mt-3 text-sm">{m.intro}</p>
                <div className="mt-6 flex items-center gap-2">
                  <ProofTag preuve={m.capture ? 'demontre' : 'decrit'} compact />
                  <span className="text-xs text-steel-500">
                    {m.capacites.filter((c) => c.preuve === 'demontre').length} capacité
                    {m.capacites.filter((c) => c.preuve === 'demontre').length > 1 ? 's' : ''} sur
                    capture
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-bone py-20 text-ink-800 md:py-28">
        <div className="shell">
          <p className="eyebrow !text-ink-500">Positionnement</p>
          <h2 className="display-md mt-6 max-w-2xl text-ink-900">
            Ce que Cheetah fait mieux, et ce qu’il ne cherche pas à faire.
          </h2>
          <p className="mt-5 max-w-prose text-sm leading-relaxed text-ink-800/70">
            Aucune de ces familles d’outils n’est mauvaise. Elles répondent à d’autres questions.
            Voici celles auxquelles elles ne répondent pas.
          </p>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Comparaison des familles d’outils de pilotage de projet
              </caption>
              <thead>
                <tr className="border-b border-ink-800/20">
                  <th scope="col" className="w-1/4 py-3 pr-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-800/70">
                    Famille d’outils
                  </th>
                  <th scope="col" className="py-3 pr-6 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-800/70">
                    Ce qu’ils font bien
                  </th>
                  <th scope="col" className="py-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-ink-800/70">
                    Ce qu’ils laissent de côté
                  </th>
                </tr>
              </thead>
              <tbody>
                {ALTERNATIVES.map((a) => (
                  <tr key={a.nom} className="border-b border-ink-800/10 align-top">
                    <th scope="row" className="py-5 pr-6 text-sm font-semibold text-ink-900">
                      {a.nom}
                    </th>
                    <td className="py-5 pr-6 text-sm leading-relaxed text-ink-800/70">{a.pour}</td>
                    <td className="py-5 text-sm leading-relaxed text-ink-800/70">{a.contre}</td>
                  </tr>
                ))}
                <tr className="border-b-2 border-ink-900 bg-ink-900/[0.04] align-top">
                  <th scope="row" className="py-5 pr-6 text-sm font-bold text-ink-900">
                    Cheetah
                  </th>
                  <td className="py-5 pr-6 text-sm leading-relaxed text-ink-800/80">
                    Relie budget à date, avancement physique et pièces justificatives dans une même
                    chaîne de mesure.
                  </td>
                  <td className="py-5 text-sm leading-relaxed text-ink-800/80">
                    Ne remplace ni la comptabilité générale, ni un ERP, ni un outil de
                    collaboration quotidienne.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-ink-850 py-20 md:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow !text-amber">En développement</p>
              <h2 className="display-md mt-5 text-paper">Ce qui n’existe pas encore.</h2>
            </div>
            <Link href="/roadmap/" className="btn btn-ghost">
              Voir la feuille de route
            </Link>
          </div>
          <div className="mt-12 grid gap-px sm:grid-cols-3">
            {ROADMAP.map((r) => (
              <div key={r.nom} className="reveal border-t border-amber/25 py-7 sm:pr-8">
                <h3 className="display-sm text-steel-200">{r.nom}</h3>
                <p className="mt-2 text-sm text-amber/80">{r.objet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        titre="Le plus court chemin : une démonstration sur vos chiffres."
        texte="Trente minutes suffisent à savoir si la chaîne de mesure de Cheetah correspond à votre façon de piloter."
        secondaire={{ label: 'Lire la méthode', href: '/methodologie/' }}
      />
    </>
  );
}
