"use client";

import { useId, useState } from "react";
import { calculateForecast, type ForecastMode } from "@/lib/finance";
import styles from "./ForecastSimulator.module.css";

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
  step,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.slider}>
      <div className={styles.sliderLabel}>
        <label htmlFor={id} className={styles.inputLabel}>
          {label}
        </label>
        <output htmlFor={id} className={styles.inputOutput}>
          {fmt(value)} {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step ?? (unit === "%" ? 1 : 10)}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.range}
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
  const reset = () => {
    setInitialBudget(800);
    setVariation(0);
    setProgress(45);
    setExpenses(420);
    setRemaining(500);
    setPreviousVariance(9);
    setMode("performance");
  };
  return (
    <div className={`finance-simulator ${styles.simulator}`}>
      <header className={styles.header}>
        <div>
          <span className={styles.statusDot} aria-hidden="true" /> LABORATOIRE /
          COST
        </div>
        <span>Données fictives · modèle pédagogique</span>
        <button type="button" onClick={reset}>
          Réinitialiser <span aria-hidden="true">↺</span>
        </button>
      </header>
      <div className={styles.layout}>
        <form
          className={styles.inputs}
          onSubmit={(event) => event.preventDefault()}
        >
          <a className={styles.mobileSummary} href={`#${id("result")}`}>
            <span>
              Prévision{" "}
              <strong>
                {r.forecast === null ? "À estimer" : `${fmt(r.forecast)} k€`}
              </strong>
            </span>
            <span style={{ color }}>
              {r.variance === null
                ? "Écart non calculable"
                : `${signed(r.variance)} k€ d’écart`}{" "}
              <span aria-hidden="true">↑</span>
            </span>
          </a>
          <div className={styles.sectionTitle}>
            <span>01</span>
            <h3>Construire la référence</h3>
          </div>
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
          <div className={styles.budgetResult}>
            <span>Budget à date · calculé</span>
            <output>
              {fmt(r.budget)} <small>k€</small>
            </output>
          </div>
          <div className={styles.sectionTitle}>
            <span>02</span>
            <h3>Mesurer le travail</h3>
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
          <fieldset className={styles.estimation}>
            <legend>
              <span>03</span> Estimer le reste à faire
            </legend>
            <div className={styles.modes}>
              {(
                [
                  { value: "manual", label: "Saisie métier", code: "M" },
                  { value: "budget", label: "Au budget", code: "B" },
                  {
                    value: "performance",
                    label: "Corrigé de la performance",
                    code: "P",
                  },
                ] as const
              ).map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={mode === item.value}
                  onClick={() => setMode(item.value)}
                >
                  <span aria-hidden="true">{item.code}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <p>
              {mode === "manual"
                ? "Le responsable estime le travail restant indépendamment des dépenses déjà engagées."
                : mode === "budget"
                  ? "Le travail restant est supposé réalisé au budget. RàF = budget à date − valeur acquise."
                  : "La performance constatée est supposée se poursuivre. RàF = (budget à date − valeur acquise) ÷ indice de performance."}
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
          <details className={styles.previous}>
            <summary>
              Comparer à l’arrêté précédent <span aria-hidden="true">+</span>
            </summary>
            <Slider
              id={id("eprec")}
              label="Écart à l’arrêté précédent"
              step={1}
              min={-200}
              max={200}
              value={previousVariance}
              onChange={setPreviousVariance}
            />
          </details>
        </form>
        <section
          id={id("result")}
          className={styles.outcome}
          aria-label="Résultat de la simulation"
        >
          <div className={styles.outputRegister}>
            <span>PRÉVISION / COÛT FINAL</span>
            <span>k€ HT</span>
          </div>
          <div
            className={styles.mainMetric}
            aria-live="polite"
            aria-atomic="true"
          >
            <p style={{ color }}>
              {r.forecast === null ? "À estimer" : fmt(r.forecast)}
              <small>{r.forecast === null ? "" : "k€"}</small>
            </p>
            <span>
              {r.variance === null
                ? "La performance ne permet pas de projeter."
                : positive
                  ? "Dépassement prévisionnel"
                  : r.variance < 0
                    ? "Économie prévisionnelle"
                    : "À la cible"}
            </span>
          </div>
          <div className={styles.consequence} style={{ borderColor: color }}>
            <span>ÉCART / BUDGET À DATE</span>
            <strong style={{ color }}>
              {r.variance === null
                ? "Non calculable"
                : `${signed(r.variance)} k€`}
              <small>
                {r.ratio === null
                  ? "Ratio non calculable"
                  : `${signed(r.ratio)} %`}
              </small>
            </strong>
          </div>
          <div className={styles.chart} aria-hidden="true">
            <div className={styles.chartTop}>
              <span>DÉCOMPOSITION DU COÛT</span>
              <span>Échelle commune</span>
            </div>
            <div className={styles.chartArea}>
              <div
                className={styles.reference}
                style={{ left: `${(r.budget / scale) * 100}%` }}
              >
                <span>BàD</span>
              </div>
              <div className={styles.costTrack}>
                <span
                  className={styles.spent}
                  style={{ width: `${(expenses / scale) * 100}%` }}
                />
                <span
                  className={styles.remaining}
                  style={{
                    width: `${((r.remaining ?? 0) / scale) * 100}%`,
                    left: `${(expenses / scale) * 100}%`,
                  }}
                />
              </div>
              <div className={styles.chartAxis}>
                <span>0</span>
                <span>{fmt(scale, 0)} k€</span>
              </div>
            </div>
            <div className={styles.legend}>
              <span>
                <i className={styles.spentKey} />
                Dépensé <strong>{fmt(expenses)} k€</strong>
              </span>
              <span>
                <i className={styles.remainingKey} />
                Reste à faire{" "}
                <strong>
                  {r.remaining === null
                    ? "À estimer"
                    : `${fmt(r.remaining)} k€`}
                </strong>
              </span>
            </div>
          </div>
          {r.forecast === null && (
            <p role="status" className={styles.notice}>
              Sans dépenses ou sans valeur acquise, choisissez « Saisie métier »
              ou « Au budget » pour estimer le travail restant.
            </p>
          )}
          {r.budget === 0 && (
            <p className={styles.notice}>
              Budget à date nul : l’écart relatif ne peut pas être calculé.
            </p>
          )}
          <details className={styles.formulas}>
            <summary>
              Examiner les calculs <span aria-hidden="true">+</span>
            </summary>
            <table>
              <caption className="sr-only">
                Résultats calculés et formules ; montants en milliers d’euros
              </caption>
              <tbody>
                {results.map(([label, value, formula]) => (
                  <tr key={label}>
                    <th scope="row">
                      {label}
                      <small>{formula}</small>
                    </th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
          <p className={styles.disclaimer}>
            Ce modèle illustre la méthode, sans reproduire le moteur du
            logiciel. Calculs sans arrondi intermédiaire ; affichage à une
            décimale. Le contexte du projet détermine les décisions à prendre.
          </p>
        </section>
      </div>
    </div>
  );
}
export default ForecastSimulator;
