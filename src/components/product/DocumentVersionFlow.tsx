"use client";

import { useId, useState } from "react";
import styles from "./demonstrations.module.css";

const VERSIONS = [
  {
    version: "V1",
    status: "En préparation",
    role: "Ingénierie · rédaction",
    action: "Émission pour revue",
    change: "Première définition des interfaces du lot.",
    decision: "La revue reste ouverte.",
    evidence:
      "Le document constitue une proposition. Il ne justifie pas encore une décision de réalisation.",
  },
  {
    version: "V2",
    status: "En revue",
    role: "Responsable de lot · revue",
    action: "Réserves consolidées",
    change: "Commentaires techniques et points de coordination rassemblés.",
    decision: "Les réserves doivent être levées.",
    evidence:
      "Les écarts entre V1 et V2 sont conservés. La version en revue ne vaut pas une approbation.",
  },
  {
    version: "V3",
    status: "Approuvé dans cet exemple",
    role: "Direction de projet · approbation",
    action: "Décision reliée à sa pièce",
    change: "Réserves levées ; périmètre de réalisation documenté.",
    decision: "Le jalon peut être présenté à la décision.",
    evidence:
      "Dans ce scénario fictif, la décision D-07 cite précisément la version V3 du livrable, et non un fichier dont le contenu pourrait changer.",
  },
];

export default function DocumentVersionFlow() {
  const [selected, setSelected] = useState(2);
  const id = useId();
  const version = VERSIONS[selected];
  const reviewY = 84 + selected * 62;
  return (
    <section
      className={`${styles.demo} ${styles.doc}`}
      aria-labelledby={`${id}-title`}
    >
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>Laboratoire Doc · scénario fictif</p>
          <h2 id={`${id}-title`}>Une décision. La bonne pièce.</h2>
        </div>
        <p>
          Un livrable évolue. La preuve d’une décision doit rester rattachée à
          une version précise. Sélectionnez une version pour suivre ce parcours
          de principe.
        </p>
      </div>
      <div className={styles.instrumentHeader}>
        <span>02 / CHAÎNE DE PROVENANCE</span>
        <span>
          DOC-014 <b>→ {version.version} → D-07</b>
        </span>
      </div>
      <div className={styles.provenance}>
        <svg
          className={styles.provenanceGraph}
          viewBox="0 0 1000 310"
          role="img"
          aria-label={`Graphe de provenance fictif : livrable DOC-014, version ${version.version}, ${version.status}, ${selected === 2 ? "reliée à la décision D-07" : "décision D-07 en attente"}.`}
        >
          <defs>
            <marker
              id={`${id}-arrow`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M0 0L8 4L0 8" fill="#d7bd93" />
            </marker>
          </defs>
          <text x="22" y="25" className={styles.svgCaption}>
            01 / LIVRABLE
          </text>
          <text x="300" y="25" className={styles.svgCaption}>
            02 / VERSION FIGÉE
          </text>
          <text x="554" y="25" className={styles.svgCaption}>
            03 / REVUE
          </text>
          <text x="810" y="25" className={styles.svgCaption}>
            04 / DÉCISION
          </text>
          <path
            d="M22 69 H174 L204 99 V256 H22 Z"
            fill="#171c20"
            stroke="#677078"
          />
          <path d="M174 69 V99 H204" fill="none" stroke="#677078" />
          <text x="40" y="119" className={styles.svgPaperCode}>
            DOC-014
          </text>
          <text x="40" y="148" className={styles.svgName}>
            Note d’interfaces
          </text>
          <text x="40" y="166" className={styles.svgCaption}>
            LOT TECHNIQUE / FICTIF
          </text>
          {[192, 204, 216, 228].map((y, i) => (
            <line
              key={y}
              x1="40"
              x2={i === 3 ? 116 : 180}
              y1={y}
              y2={y}
              stroke="#394047"
            />
          ))}
          {VERSIONS.map((v, index) => {
            const nodeY = 64 + index * 78;
            return (
              <g key={v.version}>
                <path
                  d={`M204 160 H244 V${nodeY + 23} H300`}
                  fill="none"
                  stroke={selected === index ? "#d7bd93" : "#3b454c"}
                  strokeWidth={selected === index ? 2 : 1}
                />
                <rect
                  x="300"
                  y={nodeY}
                  width="160"
                  height="46"
                  rx="2"
                  fill={selected === index ? "#ddc39d" : "#12171c"}
                  stroke={selected === index ? "#ddc39d" : "#3b454c"}
                />
                <text
                  x="318"
                  y={nodeY + 29}
                  fill={selected === index ? "#15191c" : "#9ca8b2"}
                  className={styles.svgVersion}
                >
                  {v.version}
                </text>
                <text
                  x="361"
                  y={nodeY + 28}
                  fill={selected === index ? "#15191c" : "#9ca8b2"}
                  className={styles.svgCaption}
                >
                  {index === 0
                    ? "PRÉPARER"
                    : index === 1
                      ? "REVOIR"
                      : "APPROUVER"}
                </text>
              </g>
            );
          })}
          <path
            d={`M460 ${87 + selected * 78} H508 V${reviewY + 34} H554`}
            fill="none"
            stroke="#d7bd93"
            strokeWidth="2"
            markerEnd={`url(#${id}-arrow)`}
          />
          <rect
            x="554"
            y={reviewY}
            width="190"
            height="68"
            fill="#202321"
            stroke="#b9a481"
          />
          <text x="570" y={reviewY + 26} className={styles.svgPaperCode}>
            {selected === 0
              ? "REVUE À OUVRIR"
              : selected === 1
                ? "RÉSERVES OUVERTES"
                : "RÉSERVES LEVÉES"}
          </text>
          <text x="570" y={reviewY + 48} className={styles.svgCaption}>
            {selected === 0
              ? "Proposition émise"
              : selected === 1
                ? "Coordination technique"
                : "Version de référence"}
          </text>
          <path
            d={`M744 ${reviewY + 34} H776 V168 H810`}
            fill="none"
            stroke={selected === 2 ? "#d7bd93" : "#667078"}
            strokeWidth={selected === 2 ? 2 : 1}
            strokeDasharray={selected === 2 ? undefined : "4 5"}
            markerEnd={`url(#${id}-arrow)`}
          />
          <path
            d="M810 133 H976 V203 H810 Z"
            fill={selected === 2 ? "#302d26" : "#14191d"}
            stroke={selected === 2 ? "#d7bd93" : "#667078"}
            strokeDasharray={selected === 2 ? undefined : "4 5"}
          />
          <text x="827" y="161" className={styles.svgPaperCode}>
            D-07
          </text>
          <text x="827" y="184" className={styles.svgCaption}>
            {selected === 2 ? "PIÈCE RELIÉE · V3" : "EN ATTENTE"}
          </text>
        </svg>
        <ol
          className={styles.mobileProvenance}
          aria-label="Parcours de la pièce sélectionnée"
        >
          <li>
            <span>01 / LIVRABLE</span>
            <strong>DOC-014</strong>
            <small>Note d’interfaces · lot technique</small>
          </li>
          <li className={styles.activeNode}>
            <span>02 / VERSION FIGÉE</span>
            <strong>{version.version}</strong>
            <small>{version.status}</small>
          </li>
          <li>
            <span>03 / REVUE</span>
            <strong>
              {selected === 0
                ? "À ouvrir"
                : selected === 1
                  ? "Réserves ouvertes"
                  : "Réserves levées"}
            </strong>
            <small>{version.role}</small>
          </li>
          <li
            className={selected === 2 ? styles.linkedNode : styles.pendingNode}
          >
            <span>04 / DÉCISION</span>
            <strong>
              D-07 {selected === 2 ? `← ${version.version}` : "· en attente"}
            </strong>
            <small>Comité de projet fictif</small>
          </li>
        </ol>
      </div>
      <div
        className={styles.versionButtons}
        role="group"
        aria-label="Version du livrable"
      >
        {VERSIONS.map((v, index) => (
          <button
            key={v.version}
            type="button"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
            aria-controls={`${id}-document`}
          >
            {v.version}
            <small>
              {index === 0 ? "Préparer" : index === 1 ? "Revoir" : "Approuver"}
            </small>
          </button>
        ))}
      </div>
      <div
        className={styles.document}
        id={`${id}-document`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <p className={styles.code}>
            Projet de démonstration / Lot technique / Livrables
          </p>
          <h3>Note d’interfaces — {version.version}</h3>
          <dl>
            <dt>Référence</dt>
            <dd>DOC-014 · {version.version}</dd>
            <dt>Statut</dt>
            <dd>{version.status}</dd>
            <dt>Rôle illustré</dt>
            <dd>{version.role}</dd>
            <dt>Évolution</dt>
            <dd>{version.change}</dd>
          </dl>
        </div>
        <div className={styles.decision} data-linked={selected === 2}>
          <p className={styles.code}>D-07 · Comité de projet fictif</p>
          <h3>{version.decision}</h3>
          <p>{version.evidence}</p>
        </div>
      </div>
      <ol className={styles.history} aria-label="Historique fictif du livrable">
        {VERSIONS.map((v) => (
          <li key={v.version}>
            <strong>{v.version}</strong>
            {v.action}
          </li>
        ))}
      </ol>
      <p className={styles.disclaimer}>
        Représentation pédagogique, pas une capture ni une reproduction de
        Cheetah Doc. Références, rôles et historique inventés pour cet exemple.
        Les capacités du module restent déclaratives faute de capture publiée ;
        ce schéma ne prouve ni un circuit d’approbation configurable, ni une
        signature électronique, ni une certification.
      </p>
    </section>
  );
}
