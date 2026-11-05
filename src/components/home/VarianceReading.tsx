"use client";
import { useState, type CSSProperties } from "react";
import { calculateForecast } from "@/lib/finance";
import styles from "./variance-reading.module.css";

const money = (value: number) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
export default function VarianceReading() {
  const [progress, setProgress] = useState(45);
  const budget = 800,
    expenses = 420;
  const r = calculateForecast({
    initialBudget: budget,
    variation: 0,
    expenses,
    progress,
    remaining: 0,
    previousVariance: 0,
    mode: "performance",
  });
  const forecast = r.forecast!;
  const consumption = (expenses / budget) * 100;
  const gap = expenses - r.earned;
  const overrun = forecast > budget;
  const scale = Math.max(budget, forecast) * 1.1;
  const y = (p: number) => 221 - p * 2.45;
  const trajectory = (value: number) =>
    `M 42 221 C 130 ${221 - value * 0.45}, 245 ${221 - value * 1.7}, 360 ${y(value)}`;
  return (
    <div
      className={`reading-bars ${styles.instrument}`}
      style={
        { "--trajectory": overrun ? "#9b351f" : "#496b29" } as CSSProperties
      }
    >
      <div className={styles.register}>
        <span>OBSERVATION / 01</span>
        <span>Scénario fictif</span>
      </div>
      <div className={styles.summary}>
        <p>
          La dépense ne mesure
          <br />
          pas le travail produit.
        </p>
        <span className={overrun ? styles.negative : styles.positive}>
          {gap >= 0 ? "+" : "−"}
          {money(Math.abs(gap))}
          <small>k€ dépensés − acquis</small>
        </span>
      </div>
      <div className={styles.graph}>
        <svg
          viewBox="0 0 420 265"
          role="img"
          aria-label={`Dépenses : 52,5 % du budget. Avancement réel : ${progress} %. Les trajectoires illustrent le décalage, pas un historique réel.`}
        >
          <defs>
            <pattern
              id="variance-hatch"
              width="7"
              height="7"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(35)"
            >
              <path
                d="M0 0V7"
                stroke={overrun ? "#9b351f" : "#496b29"}
                strokeWidth="1"
                opacity=".25"
              />
            </pattern>
          </defs>
          {[0, 20, 40, 60, 80].map((v) => (
            <g key={v}>
              <path
                d={`M42 ${y(v)}H385`}
                stroke="#596371"
                strokeOpacity=".17"
              />
              <text
                x="28"
                y={y(v) + 3}
                textAnchor="end"
                className={styles.svgLabel}
              >
                {v}
              </text>
            </g>
          ))}
          <path
            d="M42 15V221H385"
            fill="none"
            stroke="#687381"
            strokeWidth=".8"
          />
          <path
            d={`${trajectory(consumption)} L 360 ${y(progress)} C 245 ${221 - progress * 1.7}, 130 ${221 - progress * 0.45},42 221 Z`}
            fill="url(#variance-hatch)"
          />
          <path
            d={trajectory(consumption)}
            stroke="#28313c"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 5"
          />
          <path
            d={trajectory(progress)}
            stroke={overrun ? "#9b351f" : "#496b29"}
            strokeWidth="3"
            fill="none"
          />
          <path
            d={`M360 23V228`}
            stroke="#687381"
            strokeWidth=".8"
            strokeDasharray="2 5"
          />
          <path
            d={`M370 ${y(consumption)}h10M375 ${y(consumption)}V${y(progress)}M370 ${y(progress)}h10`}
            stroke={overrun ? "#9b351f" : "#496b29"}
            strokeWidth="1"
          />
          <circle
            cx="360"
            cy={y(consumption)}
            r="4"
            fill="#28313c"
            stroke="#f4f2ec"
            strokeWidth="2"
          />
          <circle
            cx="360"
            cy={y(progress)}
            r="5"
            fill={overrun ? "#9b351f" : "#496b29"}
            stroke="#f4f2ec"
            strokeWidth="2"
          />
          <text
            x="349"
            y={y(consumption) + (progress > consumption ? 22 : -13)}
            textAnchor="end"
            className={styles.svgValue}
          >
            52,5 %
          </text>
          <text
            x="349"
            y={y(progress) + (progress > consumption ? -13 : 22)}
            textAnchor="end"
            fill={overrun ? "#9b351f" : "#496b29"}
            className={styles.svgValue}
          >
            {progress} %
          </text>
          <text x="42" y="245" className={styles.svgLabel}>
            DÉPART
          </text>
          <text x="360" y="245" textAnchor="end" className={styles.svgLabel}>
            ARRÊTÉ SIMULÉ
          </text>
        </svg>
      </div>
      <div className={styles.legend}>
        <span>
          <i />
          Consommation budgétaire
        </span>
        <span>
          <i />
          Avancement physique
        </span>
      </div>
      <p className={styles.graphNote}>
        Trajectoires illustratives entre le départ et l’arrêté, sans historique
        réel.
      </p>
      <div className={styles.controller}>
        <label htmlFor="reading-progress">
          <span>Modifiez l’avancement</span>
          <strong>{progress} %</strong>
        </label>
        <input
          id="reading-progress"
          type="range"
          min="30"
          max="70"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          aria-label="Avancement physique de la comparaison"
          aria-describedby="reading-help"
        />
        <div>
          <span>30 % / moins produit</span>
          <span>70 % / plus produit</span>
        </div>
      </div>
      <div className={styles.forecast} aria-live="polite">
        <span>Coût final anticipé</span>
        <strong className={overrun ? styles.negative : styles.positive}>
          {money(forecast)} <small>k€</small>
        </strong>
        <p>
          Pour une dépense inchangée de <b>420 k€</b>.
        </p>
      </div>
      <details className={styles.breakdown}>
        <summary>
          Comparer les montants <span aria-hidden="true">+</span>
        </summary>
        <div className={styles.moneyBars}>
          {[
            { label: "Budget à date", value: budget },
            { label: "Dépenses engagées", value: expenses },
            { label: "Coût final anticipé", value: forecast },
          ].map(({ label, value }) => (
            <div key={label}>
              <label>
                <span>{label}</span>
                <strong>{money(value)} k€</strong>
              </label>
              <div className="reading-track">
                <span style={{ width: `${(value / scale) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </details>
      <p id="reading-help" className={styles.formula}>
        Valeur acquise = avancement × 800 k€. Projection = 420 k€ ÷ avancement.
        Hypothèse : la performance observée se poursuit. Modèle pédagogique,
        distinct du moteur du logiciel.
      </p>
    </div>
  );
}
