'use client';

/**
 * SIMULATEUR DE COÛT PRÉVISIONNEL — démonstration pédagogique.
 *
 * Reproduit la chaîne de calcul visible dans l'interface Cheetah Cost :
 *   Valeur acquise = avancement physique × budget à date
 *   Indice de performance des coûts = valeur acquise ÷ dépenses
 *   Reste à faire  = (budget à date − valeur acquise), au budget ou corrigé
 *                    de l'indice de performance
 *   Coût prévisionnel = dépenses + reste à faire
 *   Écart = coût prévisionnel − budget à date      (positif = dépassement)
 *   Dérive = écart courant − écart de l'arrêté précédent
 *
 * La convention de signe de l'écart est celle lue dans la capture produit
 * versionnée dans ce dépôt (colonnes E, E/BàD, E préc. et D).
 *
 * Les valeurs manipulées ici sont fictives et ne proviennent d'aucun projet
 * réel. Ce module illustre la méthode ; il ne reproduit pas le moteur de
 * calcul du logiciel.
 */

import { useMemo, useState } from 'react';

const fmt = (n: number, d = 0) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

function Slider({
  id,
  label,
  unite,
  min,
  max,
  step,
  value,
  onChange,
  aide,
}: {
  id: string;
  label: string;
  unite: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  aide: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-paper">
          {label}
        </label>
        <output htmlFor={id} className="num text-sm text-volt">
          {fmt(value)} {unite}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-describedby={`${id}-aide`}
        className="mt-2 w-full"
      />
      <p id={`${id}-aide`} className="mt-2 text-xs leading-relaxed text-steel-400">
        {aide}
      </p>
    </div>
  );
}

export function ForecastSimulator() {
  const [bad, setBad] = useState(800);
  const [avancement, setAvancement] = useState(45);
  const [depenses, setDepenses] = useState(420);
  const [ePrec, setEPrec] = useState(9);
  const [tendance, setTendance] = useState(true);

  const r = useMemo(() => {
    const va = (avancement / 100) * bad;
    const ipc = depenses > 0 ? va / depenses : 1;
    const resteBudget = Math.max(bad - va, 0);
    const raf = tendance && ipc > 0.01 ? resteBudget / ipc : resteBudget;
    const cp = depenses + raf;
    const e = cp - bad;
    const ratio = bad > 0 ? (e / bad) * 100 : 0;
    const d = e - ePrec;
    return { va, ipc, raf, cp, e, ratio, d };
  }, [bad, avancement, depenses, ePrec, tendance]);

  const echelle = Math.max(r.cp, bad) * 1.08;
  const pctDepenses = (depenses / echelle) * 100;
  const pctRaf = (r.raf / echelle) * 100;
  const pctBad = (bad / echelle) * 100;

  const statut =
    r.ratio > 5
      ? { texte: 'Dépassement à traiter', couleur: '#f2605b' }
      : r.ratio > 1
        ? { texte: 'Dérive à surveiller', couleur: '#f2a93b' }
        : { texte: 'Dans la cible', couleur: '#cdf564' };

  return (
    <div className="panel corner-ticks overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-3.5 sm:px-7">
        <p className="eyebrow !text-volt">Simulateur de coût prévisionnel</p>
        <p className="rounded-full border border-amber/40 px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-amber">
          Données fictives · modèle pédagogique
        </p>
      </div>

      <div className="grid gap-10 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
        {/* Hypothèses */}
        <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
          <Slider
            id="sim-bad"
            label="Budget à date"
            unite="kEUR"
            min={200}
            max={2000}
            step={10}
            value={bad}
            onChange={setBad}
            aide="Budget initial corrigé des variations validées. C’est la cible contre laquelle l’écart est mesuré."
          />
          <Slider
            id="sim-av"
            label="Avancement physique"
            unite="%"
            min={0}
            max={100}
            step={1}
            value={avancement}
            onChange={setAvancement}
            aide="Part du travail réellement produite. Saisie indépendamment des dépenses — c’est là que se joue la détection précoce."
          />
          <Slider
            id="sim-dep"
            label="Dépenses engagées"
            unite="kEUR"
            min={0}
            max={2000}
            step={10}
            value={depenses}
            onChange={setDepenses}
            aide="Ce qui est sorti ou engagé à la date d’arrêté."
          />
          <Slider
            id="sim-eprec"
            label="Écart à l’arrêté précédent"
            unite="kEUR"
            min={-200}
            max={200}
            step={1}
            value={ePrec}
            onChange={setEPrec}
            aide="Sert à calculer la dérive. C’est la variation d’un arrêté à l’autre qui déclenche l’action, pas le niveau absolu."
          />

          <fieldset className="border-t border-white/[0.07] pt-6">
            <legend className="sr-only">Méthode d’estimation du reste à faire</legend>
            <p className="mb-3 text-sm font-medium text-paper">Estimation du reste à faire</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTendance(false)}
                aria-pressed={!tendance}
                className={`btn !min-h-0 !px-3.5 !py-2 !text-[0.8125rem] ${
                  !tendance ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Au budget
              </button>
              <button
                type="button"
                onClick={() => setTendance(true)}
                aria-pressed={tendance}
                className={`btn !min-h-0 !px-3.5 !py-2 !text-[0.8125rem] ${
                  tendance ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                Corrigé de la performance
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-steel-400">
              {tendance
                ? 'Le reste à faire est divisé par l’indice de performance constaté : on suppose que la dérive déjà observée se poursuit.'
                : 'Le reste à faire est pris au budget : on suppose que le reste du projet se déroulera exactement comme prévu.'}
            </p>
          </fieldset>
        </form>

        {/* Résultats */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Résultat de l’arrêté</p>
            <span
              className="rounded-full px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em]"
              style={{ color: statut.couleur, border: `1px solid ${statut.couleur}55` }}
            >
              {statut.texte}
            </span>
          </div>

          {/* Barre comparative */}
          <div className="mt-6">
            <div className="relative h-14 w-full overflow-hidden rounded-sm bg-ink-700 ring-1 ring-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-cheetah"
                style={{ width: `${pctDepenses}%`, background: 'rgba(205,245,100,0.82)' }}
              />
              <div
                className="absolute inset-y-0 transition-all duration-500 ease-cheetah"
                style={{
                  left: `${pctDepenses}%`,
                  width: `${pctRaf}%`,
                  background:
                    'repeating-linear-gradient(-45deg, rgba(205,245,100,0.3) 0 6px, rgba(205,245,100,0.12) 6px 12px)',
                }}
              />
              <div
                className="pointer-events-none absolute inset-y-0 w-px bg-paper transition-[left] duration-500 ease-cheetah"
                style={{ left: `${pctBad}%` }}
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute top-0.5 whitespace-nowrap bg-ink-700 px-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-paper transition-[left] duration-500 ease-cheetah"
                style={{ left: `calc(${pctBad}% + 5px)` }}
              >
                BàD
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-steel-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2" style={{ background: 'rgba(205,245,100,0.82)' }} /> Dépensé
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2"
                  style={{
                    background:
                      'repeating-linear-gradient(-45deg, rgba(205,245,100,0.45) 0 3px, rgba(205,245,100,0.15) 3px 6px)',
                  }}
                />
                Reste à faire
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-px bg-paper" /> Budget à date
              </span>
            </div>
          </div>

          {/* Tableau de sortie */}
          <table className="data-grid mt-7">
            <caption className="sr-only">
              Résultats calculés à partir des hypothèses saisies
            </caption>
            <tbody>
              <tr>
                <td className="!text-steel-400">Valeur acquise</td>
                <td className="!text-paper">{fmt(r.va)} kEUR</td>
              </tr>
              <tr>
                <td className="!text-steel-400">Indice de performance des coûts</td>
                <td className="!text-paper">{fmt(r.ipc, 2)}</td>
              </tr>
              <tr>
                <td className="!text-steel-400">Reste à faire</td>
                <td className="!text-paper">{fmt(r.raf)} kEUR</td>
              </tr>
              <tr>
                <td className="!text-steel-400">Coût prévisionnel</td>
                <td className="!text-paper">{fmt(r.cp)} kEUR</td>
              </tr>
              <tr>
                <td className="!text-steel-400">Écart / budget à date</td>
                <td style={{ color: statut.couleur }}>
                  {r.e >= 0 ? '+' : '−'}
                  {fmt(Math.abs(r.e))} kEUR · {r.ratio >= 0 ? '+' : '−'}
                  {fmt(Math.abs(r.ratio), 1)} %
                </td>
              </tr>
              <tr>
                <td className="!text-steel-400">Dérive depuis l’arrêté précédent</td>
                <td style={{ color: r.d > 0 ? '#f2605b' : '#cdf564' }}>
                  {r.d >= 0 ? '+' : '−'}
                  {fmt(Math.abs(r.d))} kEUR
                </td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6 border-t border-white/[0.07] pt-5 text-xs leading-relaxed text-steel-400">
            Essayez : laissez les dépenses à 420 kEUR et descendez l’avancement physique de
            45 % à 35 %. Rien ne change au niveau de la trésorerie — mais le coût
            prévisionnel, lui, part. C’est exactement l’écart qu’un suivi purement comptable
            ne voit pas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForecastSimulator;
