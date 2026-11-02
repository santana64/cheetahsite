/**
 * LA FICHE PROJET CHEETAH TIME — reconstitution native.
 *
 * Mêmes indicateurs, mêmes valeurs et mêmes tâches que la fiche portefeuille
 * du produit, relevés sur la capture versionnée dans ce dépôt. Seul l'habillage
 * appartient à ce site.
 */

import { TIME_PROJET } from '@/content/cheetah';

export function TimeCard() {
  return (
    <div className="panel corner-ticks overflow-hidden">
      <div className="border-b border-white/[0.07] px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center gap-2">
          {TIME_PROJET.statuts.map((s, i) => (
            <span
              key={s}
              className="rounded-full border px-2.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.16em]"
              style={
                i === 0
                  ? { borderColor: 'rgba(147,163,181,0.35)', color: 'var(--steel-300)' }
                  : { borderColor: 'rgba(242,169,59,0.45)', color: 'var(--amber)' }
              }
            >
              {s}
            </span>
          ))}
        </div>
        <h3 className="display-sm mt-4 text-paper">{TIME_PROJET.nom}</h3>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel-400">{TIME_PROJET.resume}</p>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-white/[0.06]">
        {TIME_PROJET.indicateurs.map((ind, i) => (
          <div key={ind.label} className="bg-ink-700/60 px-5 py-5 sm:px-7">
            <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-steel-500">
              {ind.label}
            </dt>
            <dd
              className="num mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: i === 1 ? 'var(--amber)' : 'var(--paper)' }}
            >
              {ind.valeur}
              {ind.unite && <span className="ml-0.5 text-base text-steel-400">{ind.unite}</span>}
            </dd>
            <p className="mt-1.5 font-mono text-[0.625rem] text-steel-500">{ind.note}</p>
          </div>
        ))}
      </dl>

      <table className="data-grid">
        <caption className="sr-only">
          Tâches de la structure de découpage du projet, avec date de fin et avancement.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="!pl-5 sm:!pl-7">
              WBS
            </th>
            <th scope="col" className="!text-left">
              Tâche
            </th>
            <th scope="col">Fin</th>
            <th scope="col" className="!pr-5 sm:!pr-7">
              Avancement
            </th>
          </tr>
        </thead>
        <tbody>
          {TIME_PROJET.taches.map((t) => (
            <tr key={t.wbs}>
              <td className="!pl-5 !text-left !text-steel-500 sm:!pl-7">{t.wbs}</td>
              <td className="!text-left !text-paper">{t.nom}</td>
              <td className="!text-steel-300">{t.fin}</td>
              <td className="!pr-5 !text-volt sm:!pr-7">{t.avancement} %</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="border-t border-white/[0.07] px-5 py-3 font-mono text-[0.625rem] leading-relaxed text-steel-500 sm:px-7">
        {TIME_PROJET.source}
      </p>
    </div>
  );
}

export default TimeCard;
