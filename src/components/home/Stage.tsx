"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import ControlField, { type FieldMode } from "./ControlField";
import styles from "./control-field.module.css";

const DIMENSIONS = [
  {
    mode: "cost",
    name: "COST",
    color: "#cdf564",
    metric: "920 k€",
    title: "L’écart devient une décision.",
    label: "Coût final anticipé",
    detail: "800 k€ de budget · 420 k€ dépensés + 500 k€ de RàF saisi",
    secondary: "+120 k€",
    secondaryLabel: "Écart au budget",
    path: "/cheetah-cost/",
    link: "Explorer Cheetah Cost",
  },
  {
    mode: "time",
    name: "TIME",
    color: "#f2a93b",
    metric: "+12 j",
    title: "Le retard révèle sa trajectoire.",
    label: "Décalage du jalon",
    detail: "Chaîne FS simplifiée · 8 + 20 + 8 jours · baseline de 24 jours",
    secondary: "J+36",
    secondaryLabel: "Fin prévisionnelle",
    path: "/cheetah-time/",
    link: "Explorer Cheetah Time",
  },
  {
    mode: "doc",
    name: "DOC",
    color: "#e9c9a0",
    metric: "V03",
    title: "Chaque décision retrouve sa preuve.",
    label: "Version de référence",
    detail: "Émission → revue → référence · une décision reliée à sa pièce",
    secondary: "03",
    secondaryLabel: "Versions illustrées",
    path: "/cheetah-doc/",
    link: "Explorer Cheetah Doc",
  },
] as const;
export default function Stage() {
  const [active, setActive] = useState(0);
  const dimension = DIMENSIONS[active];
  return (
    <section
      className={styles.hero}
      aria-label="Présentation de CheetahSoft"
      style={{ "--field-accent": dimension.color } as CSSProperties}
    >
      <div className="shell">
        <div className={styles.masthead}>
          <span>CHEETAHSOFT / INDUSTRIAL INTELLIGENCE</span>
          <span>
            THE CONTROL FIELD <i aria-hidden="true" /> CF—02
          </span>
        </div>
        <div className={styles.composition}>
          <div className={styles.editorial}>
            <p className={styles.eyebrow}>Anticiper. Mesurer. Décider.</p>
            <h1>
              La dérive se voit
              <br />
              <span className={styles.lastLine}>
                <em>avant</em> de se payer.
              </span>
            </h1>
            <p className={styles.lede}>
              Le contrôle des coûts, des délais
              <br className={styles.desktopBreak} /> et des preuves de vos
              projets industriels.
            </p>
            <div className={styles.actions}>
              <Link href="/contact/" className="btn btn-primary">
                Demander une démonstration <span aria-hidden="true">↗</span>
              </Link>
              <a href="#logiciels">
                Explorer les logiciels <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className={styles.context}>
              <span aria-hidden="true">↳</span>
              <p>
                Une référence pour mesurer.
                <br />
                Une projection pour agir.
              </p>
            </div>
          </div>
          <div className={styles.instrument}>
            <div className={styles.sceneHeader}>
              <span>INSTRUMENT DE LECTURE</span>
              <span>Données fictives · modèle pédagogique</span>
            </div>
            <div
              className={styles.selectors}
              aria-label="Choisir une dimension du projet"
            >
              {DIMENSIONS.map((d, i) => (
                <button
                  key={d.name}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls="field-observation"
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  {d.name}
                  <span aria-hidden="true">{active === i ? "↗" : "+"}</span>
                </button>
              ))}
            </div>
            <ControlField mode={dimension.mode as FieldMode} />
            <div
              id="field-observation"
              className={styles.observation}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className={styles.primaryMetric}>
                <span className={styles.metricLabel}>{dimension.label}</span>
                <span className={`instrument-value ${styles.metric}`}>
                  {dimension.metric}
                </span>
              </div>
              <div className={styles.secondaryMetric}>
                <span className={styles.metricLabel}>
                  {dimension.secondaryLabel}
                </span>
                <span className={styles.secondValue}>
                  {dimension.secondary}
                </span>
              </div>
              <p className={styles.explanation}>{dimension.detail}</p>
            </div>
            <div className={styles.instrumentFooter}>
              <p>{dimension.title}</p>
              <Link href={dimension.path} aria-label={dimension.link}>
                Explorer <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.heroFooter}>
          <a href="#lecture">
            <span aria-hidden="true">↓</span>Observer ce qui échappe aux
            dépenses
          </a>
          <span>
            COST / TIME / DOC <i aria-hidden="true" /> UN MÊME PROJET
          </span>
        </div>
      </div>
    </section>
  );
}
