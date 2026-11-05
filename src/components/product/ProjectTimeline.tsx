"use client";

import { useId, useState } from "react";
import { scheduleProject } from "@/lib/schedule";
import styles from "./demonstrations.module.css";

const TASKS = [
  { id: "A", name: "Études", duration: 4, predecessors: [] },
  { id: "B", name: "Approvisionnement", duration: 6, predecessors: ["A"] },
  { id: "C", name: "Préparation du site", duration: 3, predecessors: ["A"] },
  { id: "D", name: "Installation", duration: 4, predecessors: ["B", "C"] },
];
const BASELINE = scheduleProject(TASKS);

export default function ProjectTimeline() {
  const [delay, setDelay] = useState(0);
  const id = useId();
  const plan = scheduleProject(TASKS, { C: delay });
  const drift = plan.finish - BASELINE.finish;
  const scale = 22;
  return (
    <section className={styles.demo} aria-labelledby={`${id}-title`}>
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>Laboratoire Time · données fictives</p>
          <h2 id={`${id}-title`}>Un retard ne reste jamais seul.</h2>
        </div>
        <p>
          Déplacez la durée de préparation. Ses trois jours de marge absorbent
          d’abord le retard. Au-delà, le jalon final se décale.
        </p>
      </div>
      <div className={styles.controls}>
        <label htmlFor={`${id}-delay`}>
          Prolongation de la préparation{" "}
          <output htmlFor={`${id}-delay`}>+{delay} jours ouvrés</output>
        </label>
        <input
          id={`${id}-delay`}
          type="range"
          min="0"
          max="8"
          step="1"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setDelay(0)}
        >
          Réinitialiser
        </button>
      </div>
      <div className={styles.metrics} aria-live="polite" aria-atomic="true">
        <div>
          <span>Baseline</span>
          <strong>J+{BASELINE.finish}</strong>
        </div>
        <div>
          <span>Fin prévisionnelle</span>
          <strong>J+{plan.finish}</strong>
        </div>
        <div>
          <span>Écart à la baseline</span>
          <strong className={drift ? styles.warning : ""}>
            {drift ? "+" : ""}
            {drift} j
          </strong>
        </div>
      </div>
      <div
        className={styles.chart}
        role="region"
        aria-label="Planning comparatif, faire défiler horizontalement si nécessaire"
        tabIndex={0}
      >
        <div className={styles.chartInner}>
          <div className={styles.axis}>
            <span>WBS / tâche</span>
            <span>J+0</span>
            <span>J+11</span>
            <span>J+22</span>
          </div>
          {plan.tasks.map((t, index) => {
            const base = BASELINE.tasks[index];
            return (
              <div className={styles.task} key={t.id}>
                <div>
                  <span className={styles.code}>{index + 1}.0</span>{" "}
                  {TASKS[index].name}
                  <small>
                    {t.predecessors.length
                      ? `Après ${t.predecessors.join(" + ")} · FS`
                      : "Départ du projet"}
                  </small>
                </div>
                <div
                  className={styles.track}
                  aria-label={`Début J+${t.start}, fin J+${t.finish}, marge ${t.float} jours${t.float === 0 ? ", critique" : ""}`}
                >
                  <span
                    className={styles.baseline}
                    style={{
                      left: `${(base.start / scale) * 100}%`,
                      width: `${(base.duration / scale) * 100}%`,
                    }}
                  />
                  <span
                    className={`${styles.bar} ${t.float === 0 ? styles.critical : ""}`}
                    style={{
                      left: `${(t.start / scale) * 100}%`,
                      width: `${(t.duration / scale) * 100}%`,
                    }}
                  >
                    {t.id} · {t.duration} j
                  </span>
                  <span
                    className={styles.target}
                    style={{ left: `${(BASELINE.finish / scale) * 100}%` }}
                  />
                </div>
                <span className={styles.float}>
                  {t.float === 0 ? "Critique · 0 j" : `Marge · ${t.float} j`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.legend}>
        <span>
          <i className={styles.legendCritical} />
          Chemin critique : marge nulle
        </span>
        <span>
          <i className={styles.legendBaseline} />
          Durée de référence
        </span>
        <span>│ Cible J+14</span>
      </div>
      <p className={styles.disclaimer}>
        Simulation pédagogique indépendante du logiciel. Calcul au plus tôt / au
        plus tard sur un réseau FS, sans calendrier réel, contrainte de
        ressources ni jours fériés. J+0 est une origine relative, pas une date
        de projet. La WBS identifie les tâches ; les liens décrivent leur ordre.
      </p>
      <details className={styles.details}>
        <summary>Comprendre FS, SS, FF et SF</summary>
        <dl>
          <dt>FS — fin → début</dt>
          <dd>
            Le successeur démarre après la fin du prédécesseur. Tous les liens
            de cette simulation sont FS, sans décalage.
          </dd>
          <dt>SS — début → début</dt>
          <dd>Le successeur ne démarre pas avant le début du prédécesseur.</dd>
          <dt>FF — fin → fin</dt>
          <dd>Le successeur ne se termine pas avant la fin du prédécesseur.</dd>
          <dt>SF — début → fin</dt>
          <dd>
            Le successeur ne se termine pas avant le début du prédécesseur.
          </dd>
        </dl>
        <p>
          SS, FF et SF sont expliqués ici, mais ne sont pas simulés par ce
          modèle.
        </p>
      </details>
    </section>
  );
}
