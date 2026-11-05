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
  const [selected, setSelected] = useState("C");
  const id = useId();
  const plan = scheduleProject(TASKS, { C: delay });
  const drift = plan.finish - BASELINE.finish;
  const scale = 22;
  const active = plan.tasks.find((task) => task.id === selected)!;
  const activeName = TASKS.find((task) => task.id === selected)!.name;
  const x = (day: number) => 170 + day * 30;
  const y = (index: number) => 88 + index * 76;
  const criticalBranches = ["B", "C"].filter(
    (taskId) => plan.tasks.find((task) => task.id === taskId)!.float === 0,
  );
  const criticalPath = criticalBranches
    .map((branch) => `A → ${branch} → D`)
    .join(" / ");
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
      <div className={styles.instrumentHeader}>
        <span>01 / RÉSEAU FS</span>
        <span>
          CHEMIN CRITIQUE <b>{criticalPath}</b>
        </span>
      </div>
      <div className={styles.chart}>
        <svg
          className={styles.gantt}
          viewBox="0 0 890 386"
          role="img"
          aria-label={`Planning en jours ouvrés relatifs. Chemin critique ${criticalPath}. Fin prévisionnelle J+${plan.finish}. Les traits fins relient chaque fin à son successeur.`}
        >
          <defs>
            <pattern
              id={`${id}-float`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <path d="M-1 7L7-1" stroke="#9b844f" strokeWidth="1" />
            </pattern>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0L8 4L0 8" fill="context-stroke" />
            </marker>
          </defs>
          <text x="0" y="23" className={styles.svgCaption}>
            WBS / ACTIVITÉ
          </text>
          {Array.from({ length: 12 }, (_, i) => i * 2).map((day) => (
            <g key={day}>
              <line
                x1={x(day)}
                x2={x(day)}
                y1="40"
                y2="346"
                className={styles.gridLine}
              />
              <text
                x={x(day)}
                y="23"
                textAnchor="middle"
                className={styles.svgCaption}
              >
                J+{day}
              </text>
            </g>
          ))}
          <line
            x1={x(14)}
            x2={x(14)}
            y1="36"
            y2="350"
            className={styles.baselineTarget}
          />
          {plan.tasks.flatMap((task, index) =>
            task.predecessors.map((predecessor) => {
              const pi = plan.tasks.findIndex((p) => p.id === predecessor);
              const parent = plan.tasks[pi];
              const end = x(parent.finish);
              const start = x(task.start);
              const elbow =
                end + (start > end ? Math.min((start - end) / 2, 16) : 13);
              return (
                <path
                  key={`${predecessor}-${task.id}`}
                  d={`M${end},${y(pi)} H${elbow} V${y(index) - 24} H${start - 7} V${y(index)}`}
                  fill="none"
                  stroke={
                    parent.float === 0 && task.float === 0
                      ? "#dca54b"
                      : "#64707a"
                  }
                  strokeWidth="1.4"
                  markerEnd={`url(#${id}-arrow)`}
                />
              );
            }),
          )}
          {plan.tasks.map((task, index) => (
            <g key={task.id}>
              <text x="0" y={y(index) - 4} className={styles.svgName}>
                {task.id} <tspan dx="8">{TASKS[index].name}</tspan>
              </text>
              <text x="0" y={y(index) + 14} className={styles.svgCaption}>
                {index + 1}.0 ·{" "}
                {task.float === 0 ? "CRITIQUE" : `MARGE ${task.float} J`}
              </text>
              {task.float > 0 && (
                <rect
                  x={x(task.finish)}
                  y={y(index) - 12}
                  width={task.float * 30}
                  height="24"
                  fill={`url(#${id}-float)`}
                  opacity=".65"
                />
              )}
              <rect
                x={x(task.start)}
                y={y(index) - 12}
                width={task.duration * 30}
                height="24"
                fill={task.float === 0 ? "#e8b45f" : "#6d8190"}
                className={
                  selected === task.id ? styles.selectedBar : undefined
                }
              />
              <text
                x={x(task.start) + 8}
                y={y(index) + 4}
                className={styles.svgBarLabel}
              >
                {task.id} · {task.duration} j
              </text>
              <rect
                x={x(BASELINE.tasks[index].start)}
                y={y(index) + 18}
                width={BASELINE.tasks[index].duration * 30}
                height="4"
                fill="#667078"
              />
            </g>
          ))}
          <path d={`M${x(plan.finish)},329 l7,7 -7,7 -7,-7 Z`} fill="#e8b45f" />
          <text
            x={x(plan.finish) - 12}
            y="373"
            textAnchor="end"
            className={styles.svgCaption}
          >
            JALON FINAL
          </text>
          <text x={x(plan.finish) + 8} y="373" className={styles.svgMilestone}>
            J+{plan.finish}
          </text>
        </svg>
        <div
          className={styles.mobileGantt}
          aria-label="Vue compacte du planning"
        >
          <div className={styles.mobileAxis}>
            <span>J+0</span>
            <span>J+11</span>
            <span>J+22</span>
          </div>
          {plan.tasks.map((task, index) => (
            <div className={styles.mobileLane} key={task.id}>
              <div>
                <b>
                  {task.id} / {TASKS[index].name}
                </b>
                <span>
                  {task.float === 0 ? "Critique" : `${task.float} j de marge`}
                </span>
              </div>
              <div className={styles.mobileTrack}>
                {task.float > 0 && (
                  <i
                    className={styles.mobileFloat}
                    style={{
                      left: `${(task.finish / scale) * 100}%`,
                      width: `${(task.float / scale) * 100}%`,
                    }}
                  />
                )}
                <i
                  className={
                    task.float === 0 ? styles.mobileCritical : styles.mobileBar
                  }
                  style={{
                    left: `${(task.start / scale) * 100}%`,
                    width: `${(task.duration / scale) * 100}%`,
                  }}
                />
                <i
                  className={styles.mobileBaseline}
                  style={{
                    left: `${(BASELINE.tasks[index].start / scale) * 100}%`,
                    width: `${(BASELINE.tasks[index].duration / scale) * 100}%`,
                  }}
                />
                <i
                  className={styles.mobileTarget}
                  style={{ left: `${(14 / scale) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <p className={styles.mobileFinish}>
            ◇ Jalon final <strong>J+{plan.finish}</strong>
          </p>
        </div>
      </div>
      <div className={styles.legend}>
        <span>
          <i className={styles.legendCritical} />
          Chemin critique
        </span>
        <span>
          <i className={styles.legendFloat} />
          Marge disponible
        </span>
        <span>
          <i className={styles.legendBaseline} />
          Baseline · J+14
        </span>
        <span>↳ Liens fin → début</span>
      </div>
      <div className={styles.taskInspector}>
        <div
          className={styles.taskTabs}
          role="group"
          aria-label="Inspecter une tâche"
        >
          {TASKS.map((task) => (
            <button
              key={task.id}
              type="button"
              aria-pressed={selected === task.id}
              aria-controls={`${id}-task`}
              onClick={() => setSelected(task.id)}
            >
              {task.id}
              <span>{task.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.taskDetail} id={`${id}-task`} aria-live="polite">
          <div>
            <span className={styles.kicker}>
              ACTIVITÉ {active.id} /{" "}
              {active.float === 0 ? "CRITIQUE" : "NON CRITIQUE"}
            </span>
            <h3>{activeName}</h3>
            <p>
              {active.predecessors.length
                ? `Après ${active.predecessors.join(" + ")} · liaison FS`
                : "Origine du réseau · aucun prédécesseur"}
            </p>
          </div>
          <dl>
            <div>
              <dt>Début</dt>
              <dd>J+{active.start}</dd>
            </div>
            <div>
              <dt>Fin</dt>
              <dd>J+{active.finish}</dd>
            </div>
            <div>
              <dt>Durée</dt>
              <dd>{active.duration} j</dd>
            </div>
            <div>
              <dt>Marge</dt>
              <dd>{active.float} j</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className={styles.signal}>
        <span>LECTURE DU RÉSEAU</span>
        {drift
          ? `La marge est consommée. Le retard déplace la fin du projet de ${drift} jour${drift > 1 ? "s" : ""}.`
          : `La préparation dispose encore de ${Math.max(0, 3 - delay)} jours de marge. Le jalon reste à J+14.`}
      </p>
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
