"use client";

import { useId, useState } from "react";
import {
  COST_ARRETE,
  COST_LIGNES,
  type LigneBudgetaire,
} from "@/content/cheetah";
import { sumVisibleCostRows } from "@/lib/finance";
import styles from "./ProductViewport.module.css";

type Measure = "budget" | "progress" | "forecast" | "variance";
type Column = { label: string; key: keyof LigneBudgetaire; percent?: boolean };
const fmt = (value: number | null, percent = false) =>
  value === null
    ? "—"
    : `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}${percent ? " %" : ""}`;
const CONFIG: Record<
  Measure,
  {
    label: string;
    code: string;
    headline: string;
    explanation: string;
    columns: Column[];
  }
> = {
  budget: {
    label: "Budget à date",
    code: "01 / RÉFÉRENCE",
    headline: "Un budget qui garde son origine.",
    explanation:
      "Le budget à date intègre les variations validées. Sur LB02, aucune variation n’est affichée : la référence reste à 260 k€.",
    columns: [
      { label: "Initial", key: "bi" },
      { label: "Variation", key: "variation" },
      { label: "À date", key: "bad" },
    ],
  },
  progress: {
    label: "Avancement",
    code: "02 / MESURE",
    headline: "La dépense ne mesure pas le travail.",
    explanation:
      "LB02 : 25 % de travail réalisé sur 260 k€ de budget représentent 65 k€ de valeur acquise. Les dépenses s’élèvent à 78,5 k€.",
    columns: [
      { label: "Dépenses", key: "depenses" },
      { label: "Physique", key: "avancement", percent: true },
      { label: "Val. acquise", key: "valeurAcquise" },
    ],
  },
  forecast: {
    label: "Coût prévisionnel",
    code: "03 / PROJECTION",
    headline: "Finir se chiffre dès aujourd’hui.",
    explanation:
      "Sur LB02, 78,5 k€ de dépenses et 210 k€ de reste à faire donnent 288,5 k€. La capture affiche 289 k€ ; sa convention d’arrondi n’est pas documentée.",
    columns: [
      { label: "Dépenses", key: "depenses" },
      { label: "Reste à faire", key: "raf" },
      { label: "Prévision", key: "cp" },
    ],
  },
  variance: {
    label: "Écart",
    code: "04 / DÉCISION",
    headline: "La tendance donne le signal.",
    explanation:
      "LB02 : l’écart source passe de 9 à 29 k€, soit +20 k€ en une période. Une évolution à investiguer sur une ligne avancée à 25 %.",
    columns: [
      { label: "Écart préc.", key: "ePrec" },
      { label: "Écart actuel", key: "e" },
      { label: "Évolution", key: "d" },
    ],
  },
};
const MEASURES = Object.keys(CONFIG) as Measure[];
const TOTALS = sumVisibleCostRows(COST_LIGNES);

/** A faithful reading of source values, not a screenshot or simulated product UI. */
export default function ProductViewport() {
  const [measure, setMeasure] = useState<Measure>("budget");
  const id = useId();
  const current = CONFIG[measure];
  const sourceRow = COST_LIGNES[1];
  const figure =
    measure === "progress"
      ? `${fmt(sourceRow.avancement)} %`
      : measure === "budget"
        ? `${fmt(TOTALS.budget)} k€`
        : measure === "forecast"
          ? `${fmt(TOTALS.forecast)} k€`
          : `${fmt(TOTALS.variance)} k€`;
  return (
    <div className={styles.viewport}>
      <div className={styles.register}>
        <span className={styles.signal}>CHEETAH COST</span>
        <span>RECONSTITUTION LISIBLE · VALEURS SOURCE</span>
        <span>{COST_ARRETE.date}</span>
      </div>
      <div
        className={styles.measureNav}
        aria-label="Choisir une lecture du tableau Cost"
      >
        {MEASURES.map((item, i) => (
          <button
            key={item}
            type="button"
            aria-pressed={measure === item}
            aria-controls={`${id}-reading`}
            onClick={() => setMeasure(item)}
          >
            <span>0{i + 1}</span>
            {CONFIG[item].label}
            <span aria-hidden="true">{measure === item ? "↗" : "+"}</span>
          </button>
        ))}
      </div>
      <div className={styles.instrument} id={`${id}-reading`}>
        <div className={styles.ledger}>
          <div className={styles.ledgerHeading}>
            <span>{COST_ARRETE.tableau}</span>
            <span>5 LIGNES / k€</span>
          </div>
          <div
            className={styles.tableScroll}
            tabIndex={0}
            role="region"
            aria-label="Valeurs de la capture Cost, lecture sélectionnée"
          >
            <table className={styles.table}>
              <caption className="sr-only">
                {current.label} : cinq lignes budgétaires de la capture
                d’origine, montants en milliers d’euros sauf avancement en
                pourcentage.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Ligne</th>
                  {current.columns.map((column) => (
                    <th scope="col" key={column.key}>
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COST_LIGNES.map((row) => (
                  <tr
                    key={row.code}
                    className={
                      row.code === "LB02" ? styles.focusRow : undefined
                    }
                  >
                    <th scope="row">
                      <span>{row.code}</span>
                      <small>{row.intitule}</small>
                    </th>
                    {current.columns.map((column, i) => {
                      const value = row[column.key] as number | null;
                      return (
                        <td
                          key={column.key}
                          className={
                            i === current.columns.length - 1
                              ? styles.focusColumn
                              : undefined
                          }
                          data-unfavorable={
                            measure === "variance" &&
                            value !== null &&
                            value > 0
                              ? "true"
                              : undefined
                          }
                        >
                          {fmt(value, column.percent)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.ledgerFooter}>
            <span>LB02 · LIGNE DE LECTURE</span>
            <span aria-hidden="true">RÉF. → MESURE → PROJECTION</span>
          </div>
        </div>
        <aside className={styles.reading} aria-live="polite" aria-atomic="true">
          <p className={styles.code}>{current.code}</p>
          <div className={styles.readout}>
            <span>{figure}</span>
            <small>
              {measure === "progress"
                ? "Avancement de LB02"
                : "Sous-total des cinq lignes visibles"}
            </small>
          </div>
          <h3>{current.headline}</h3>
          <p className={styles.explanation}>{current.explanation}</p>
          <div className={styles.sourceCase}>
            <span>CAS DE LECTURE</span>
            <strong>LB02 / Définition</strong>
            <span>Source produit, données de test de l’éditeur</span>
          </div>
        </aside>
      </div>
      <div className={styles.sourceNote}>
        <span aria-hidden="true">!</span>
        <p>
          BàD / coût prévisionnel / écart — source non réconciliée : les cinq
          lignes donnent <strong>795 / 784 / −11 k€</strong> ; le bandeau
          d’origine affiche <strong>800 / 798 / −3 k€</strong>. Aucun périmètre
          plus large n’est attesté. Les valeurs historiques sont conservées.
        </p>
      </div>
      <details className={styles.evidence}>
        <summary>
          Vérifier la source d’origine <span aria-hidden="true">+</span>
        </summary>
        <p>
          Cette présentation est une reconstitution des valeurs, pas une capture
          de l’interface. Le bandeau source implique arithmétiquement 798 − 800
          = −2 k€, différent de l’écart −3 k€ affiché. La capture n’a pas été
          retouchée.
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/screenshot-cost.webp`}
          target="_blank"
          rel="noreferrer"
        >
          Ouvrir la capture complète dans un nouvel onglet{" "}
          <span aria-hidden="true">↗</span>
        </a>
      </details>
    </div>
  );
}
