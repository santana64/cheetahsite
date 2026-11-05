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
        <div className={styles.decision}>
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
