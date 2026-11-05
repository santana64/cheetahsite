"use client";
import { useState } from "react";

export default function VarianceReading() {
  const [progress, setProgress] = useState(45);
  const budget = 800,
    expenses = 420;
  const earned = (budget * progress) / 100;
  const forecast = (expenses * 100) / progress;
  const scale = Math.max(budget, forecast) * 1.1;
  return (
    <div className="reading-bars">
      <p className="eyebrow !text-ink-500">
        Scénario fictif · arrêté de projet
      </p>
      <div>
        <label>
          <span>Budget à date</span>
          <strong>800 k€</strong>
        </label>
        <div className="reading-track">
          <span style={{ width: `${(budget / scale) * 100}%` }} />
        </div>
      </div>
      <div>
        <label>
          <span>Dépenses engagées</span>
          <strong>420 k€ · 52,5 %</strong>
        </label>
        <div className="reading-track">
          <span style={{ width: `${(expenses / scale) * 100}%` }} />
        </div>
      </div>
      <div>
        <label htmlFor="reading-progress">
          <span>Avancement physique</span>
          <strong>
            {progress} % · {earned} k€ acquis
          </strong>
        </label>
        <input
          id="reading-progress"
          type="range"
          min="30"
          max="70"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          aria-describedby="reading-help"
        />
      </div>
      <div aria-live="polite">
        <label>
          <span>Coût final anticipé</span>
          <strong>{Math.round(forecast).toLocaleString("fr-FR")} k€</strong>
        </label>
        <div className="reading-track">
          <span
            className={forecast > budget ? "reading-alert" : ""}
            style={{ width: `${(forecast / scale) * 100}%` }}
          />
        </div>
      </div>
      <p id="reading-help" className="reading-context">
        Déplacez l’avancement. Les dépenses restent identiques ; la projection
        change. Hypothèse : la performance constatée se poursuit. CP = dépenses
        ÷ avancement. Ce modèle pédagogique ne reproduit pas le moteur du
        logiciel.
      </p>
    </div>
  );
}
