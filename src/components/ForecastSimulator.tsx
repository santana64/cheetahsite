"use client";

import { useId, useState } from "react";
import { calculateForecast, type ForecastMode } from "@/lib/finance";

const fmt = (n: number | null, decimals = 1) =>
  n === null
    ? "Non calculable"
    : n.toLocaleString("fr-FR", { maximumFractionDigits: decimals });
const signed = (n: number | null) =>
  n === null ? "Non calculable" : `${n > 0 ? "+" : ""}${fmt(n)}`;

function Slider({
  id,
  label,
  value,
  min = 0,
  max = 2000,
  unit = "k€",
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-paper">
          {label}
        </label>
        <output htmlFor={id} className="num text-sm text-volt">
          {fmt(value)} {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={unit === "%" ? 1 : 10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 min-h-11 w-full"
      />
    </div>
  );
}

export function ForecastSimulator() {
  const instance = useId();
  const [initialBudget, setInitialBudget] = useState(800);
  const [variation, setVariation] = useState(0);
  const [progress, setProgress] = useState(45);
  const [expenses, setExpenses] = useState(420);
  const [remaining, setRemaining] = useState(500);
  const [previousVariance, setPreviousVariance] = useState(9);
  const [mode, setMode] = useState<ForecastMode>("performance");
  const r = calculateForecast({
    initialBudget,
    variation,
    expenses,
    progress,
    remaining,
    previousVariance,
    mode,
  });
  const scale = Math.max(r.forecast ?? expenses, r.budget, 1) * 1.1;
  const positive = r.variance !== null && r.variance > 0;
  const color =
    r.variance === null
      ? "var(--amber)"
      : positive
        ? "var(--drift)"
        : "var(--volt)";
  const id = (name: string) => `${instance}-sim-${name}`;
  const results = [
    ["Budget à date", `${fmt(r.budget)} k€`, "BI + variation"],
    ["Valeur acquise", `${fmt(r.earned)} k€`, "Avancement × budget à date"],
    [
      "Indice de performance des coûts",
      fmt(r.cpi, 3),
      "Valeur acquise ÷ dépenses",
    ],
    [
      "Reste à faire",
      r.remaining === null ? "Non calculable" : `${fmt(r.remaining)} k€`,
      "Selon la méthode choisie",
    ],
    [
      "Coût prévisionnel",
      r.forecast === null ? "Non calculable" : `${fmt(r.forecast)} k€`,
      "Dépenses + reste à faire",
    ],
    [
      "Écart absolu",
      r.variance === null ? "Non calculable" : `${signed(r.variance)} k€`,
      "Coût prévisionnel − budget à date",
    ],
    [
      "Écart relatif",
      r.ratio === null ? "Non calculable" : `${signed(r.ratio)} %`,
      "Écart ÷ budget à date × 100",
    ],
    [
      "Dérive entre arrêtés",
      r.drift === null ? "Non calculable" : `${signed(r.drift)} k€`,
      "Écart courant − écart précédent",
    ],
  ];
  return (
    <div className="panel finance-simulator corner-ticks overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-7">
        <p className="eyebrow !text-volt">Laboratoire de prévision</p>
        <p className="font-mono text-xs text-amber">
          Données fictives · démonstration pédagogique
        </p>
      </div>
      <div className="grid gap-10 p-5 sm:p-7 lg:grid-cols-2 lg:gap-12">
        <form
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <p className="text-sm leading-relaxed text-steel-300">
            Changez les hypothèses. Observez ce qu’un suivi des seules dépenses
            ne révèle pas.
          </p>
          <Slider
            id={id("bi")}
            label="Budget initial"
            value={initialBudget}
            onChange={(value) => {
              setInitialBudget(value);
              setVariation((current) => Math.max(current, -value));
            }}
          />
          <Slider
            id={id("variation")}
            label="Variation validée"
            min={-initialBudget}
            max={500}
            value={variation}
            onChange={setVariation}
          />
          <div className="flex items-center justify-between border-y border-white/10 py-3 text-sm">
            <span>Budget à date · calculé</span>
            <output className="num text-paper">{fmt(r.budget)} k€</output>
          </div>
          <Slider
            id={id("av")}
            label="Avancement physique"
            unit="%"
            max={100}
            value={progress}
            onChange={setProgress}
          />
          <Slider
            id={id("dep")}
            label="Dépenses engagées"
            value={expenses}
            onChange={setExpenses}
          />
          <fieldset className="border-t border-white/10 pt-5">
            <legend className="text-sm font-medium text-paper">
              Estimation du reste à faire
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  { value: "manual", label: "Saisie métier" },
                  { value: "budget", label: "Au budget" },
                  { value: "performance", label: "Corrigé de la performance" },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={mode === item.value}
                  onClick={() => setMode(item.value)}
                  className={`btn !px-3 !text-xs ${mode === item.value ? "btn-primary" : "btn-ghost"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-steel-300">
              {mode === "manual"
                ? "Reste à faire estimé indépendamment par le responsable de projet."
                : mode === "budget"
                  ? "RàF = budget à date − valeur acquise. Le travail restant est supposé réalisé au budget."
                  : "RàF = (budget à date − valeur acquise) ÷ indice de performance. La performance observée est supposée se poursuivre."}
            </p>
          </fieldset>
          {mode === "manual" && (
            <Slider
              id={id("raf")}
              label="Reste à faire estimé"
              value={remaining}
              onChange={setRemaining}
            />
          )}
          <Slider
            id={id("eprec")}
            label="Écart à l’arrêté précédent"
            min={-200}
            max={200}
            value={previousVariance}
            onChange={setPreviousVariance}
          />
        </form>
        <div>
          <p className="eyebrow">Lecture de l’arrêté</p>
          <p
            className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color }}
          >
            {r.forecast === null ? "À estimer" : `${fmt(r.forecast)} k€`}
          </p>
          <p className="mt-2 text-sm text-steel-300">
            Coût final anticipé ·{" "}
            {r.variance === null
              ? "performance insuffisante pour projeter"
              : positive
                ? "dépassement prévisionnel"
                : r.variance < 0
                  ? "économie prévisionnelle"
                  : "à la cible"}
          </p>
          <div className="mt-7" aria-hidden="true">
            <div className="relative h-14 overflow-hidden bg-ink-700">
              <span
                className="absolute inset-y-0 left-0 bg-volt transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${(expenses / scale) * 100}%` }}
              />
              <span
                className="absolute inset-y-0 transition-[width,left] duration-300 motion-reduce:transition-none"
                style={{
                  left: `${(expenses / scale) * 100}%`,
                  width: `${((r.remaining ?? 0) / scale) * 100}%`,
                  background:
                    "repeating-linear-gradient(-45deg,#8ca64d 0 5px,#253020 5px 10px)",
                }}
              />
              <span
                className="absolute inset-y-0 w-0.5 bg-paper"
                style={{ left: `${(r.budget / scale) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-steel-300">
              Plein : dépenses · hachures : reste à faire · repère : budget à
              date
            </p>
          </div>
          <table className="data-grid mt-6 w-full">
            <caption className="sr-only">
              Résultats calculés et formules ; montants en milliers d’euros
            </caption>
            <tbody>
              {results.map(([label, value, formula]) => (
                <tr key={label}>
                  <th
                    scope="row"
                    className="py-3 text-left text-xs font-normal text-steel-300"
                  >
                    {label}
                    <span className="mt-1 block text-[0.625rem] text-steel-400">
                      {formula}
                    </span>
                  </th>
                  <td className="num !text-paper">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {r.forecast === null && (
            <p role="status" className="mt-4 text-sm text-amber">
              Sans dépenses ou sans valeur acquise, la performance ne permet pas
              d’estimer le travail restant. Choisissez « Saisie métier » ou « Au
              budget ».
            </p>
          )}
          {r.budget === 0 && (
            <p className="mt-4 text-sm text-amber">
              Budget à date nul : l’écart relatif ne peut pas être calculé.
            </p>
          )}
          <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-steel-300">
            Ce modèle illustre la méthode, sans reproduire le moteur du
            logiciel. Montants en k€ ; calculs sans arrondi intermédiaire,
            affichage à une décimale. Les seuils de risque dépendent du contexte
            du projet.
          </p>
        </div>
      </div>
    </div>
  );
}
export default ForecastSimulator;
