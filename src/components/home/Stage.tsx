"use client";

import Link from "next/link";
import { useState } from "react";

const DIMENSIONS = [
  {
    name: "COST",
    label: "Maîtriser les coûts",
    color: "#cdf564",
    metric: "920 k€",
    detail: "Coût final anticipé",
    note: "800 k€ de budget à date · +120 k€ d’écart",
    path: "/cheetah-cost/",
  },
  {
    name: "TIME",
    label: "Anticiper les délais",
    color: "#f2a93b",
    metric: "+12 j",
    detail: "Décalage du jalon final",
    note: "Un retard se propage aux tâches dépendantes.",
    path: "/cheetah-time/",
  },
  {
    name: "DOC",
    label: "Relier les preuves",
    color: "#e9c9a0",
    metric: "V03",
    detail: "Révision de référence",
    note: "Une décision, une version, une pièce justificative.",
    path: "/cheetah-doc/",
  },
];

export default function Stage() {
  const [active, setActive] = useState(0);
  const d = DIMENSIONS[active];
  return (
    <section
      className="precision-hero"
      aria-label="Présentation de CheetahSoft"
    >
      <div className="shell">
        <div className="hero-register">
          <span>CHEETAHSOFT / CONTRÔLE DE PROJET</span>
          <span>PRECISION IN MOTION — FR</span>
        </div>
        <div className="hero-layout">
          <div className="hero-editorial">
            <p className="eyebrow">Logiciels pour les projets industriels</p>
            <h1>
              La dérive se voit
              <br />
              <em>avant</em> de se payer.
            </h1>
            <p className="hero-lede">
              Les coûts. Les délais. Les preuves.
              <br />
              Trois lectures pour décider pendant qu’il est encore temps.
            </p>
            <p className="hero-description">
              CheetahSoft relie budget à date, avancement physique et coût
              prévisionnel. Donnez une mesure à vos décisions de projet.
            </p>
            <div className="hero-actions">
              <Link href="/contact/" className="btn btn-primary">
                Demander une démonstration <span aria-hidden="true">↗</span>
              </Link>
              <Link href="#logiciels" className="hero-text-link">
                Explorer les logiciels <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
          <div
            className="project-instrument"
            style={{ "--instrument-accent": d.color } as React.CSSProperties}
          >
            <div className="instrument-heading">
              <span>OBJET / PROJET</span>
              <span>MODÈLE PÉDAGOGIQUE</span>
            </div>
            <svg
              className="project-cutaway"
              viewBox="0 0 620 480"
              role="img"
              aria-label={`Coupe technique des trois dimensions d’un projet. Dimension sélectionnée : ${d.name}.`}
            >
              <defs>
                <pattern
                  id="instrument-grid"
                  width="28"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M28 0H0V16"
                    fill="none"
                    stroke="#9daaba"
                    strokeWidth=".5"
                    opacity=".2"
                  />
                </pattern>
                <linearGradient id="instrument-plane" x2="1" y2="1">
                  <stop stopColor="#263240" />
                  <stop offset="1" stopColor="#0d1116" />
                </linearGradient>
              </defs>
              <path
                d="M35 300L300 145L590 305L325 460Z"
                fill="url(#instrument-grid)"
                opacity=".65"
              />
              <path
                d="M310 20V380M65 193L555 193"
                stroke="#9daaba"
                strokeDasharray="3 7"
                opacity=".25"
              />
              {[2, 1, 0].map((i) => {
                const y = 100 + i * 77;
                const on = i === active;
                return (
                  <g
                    key={i}
                    className={`instrument-layer ${on ? "is-selected" : ""}`}
                  >
                    <path
                      d={`M92 ${y + 75}L310 ${y - 45}L535 ${y + 75}L315 ${y + 196}Z`}
                      fill="url(#instrument-plane)"
                      stroke={on ? DIMENSIONS[i].color : "#44515f"}
                      strokeWidth={on ? 1.6 : 0.8}
                    />
                    <path
                      d={`M92 ${y + 75}V${y + 88}L315 ${y + 209}L535 ${y + 88}V${y + 75}M315 ${y + 196}V${y + 209}`}
                      fill="none"
                      stroke={on ? DIMENSIONS[i].color : "#44515f"}
                      opacity=".65"
                    />
                    <path
                      d={`M150 ${y + 75}L310 ${y - 12}L474 ${y + 75}L315 ${y + 163}Z M207 ${y + 75}L310 ${y + 20}L414 ${y + 75}L315 ${y + 131}Z`}
                      fill="none"
                      stroke={DIMENSIONS[i].color}
                      opacity={on ? ".55" : ".12"}
                    />
                    <path
                      d={`M150 ${y + 75}L230 ${y + 100}L290 ${y + 64}L355 ${y + 87}L420 ${y + 45}L473 ${y + 75}`}
                      fill="none"
                      stroke={DIMENSIONS[i].color}
                      strokeWidth={on ? 3 : 1}
                      opacity={on ? 1 : 0.25}
                    />
                    <circle
                      cx="355"
                      cy={y + 87}
                      r={on ? 5 : 3}
                      fill={DIMENSIONS[i].color}
                    />
                    <text
                      x="102"
                      y={y + 61}
                      fill={on ? DIMENSIONS[i].color : "#9daaba"}
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      0{i + 1} / {DIMENSIONS[i].name}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="instrument-readout" aria-live="polite">
              <div>
                <span className="instrument-value">{d.metric}</span>
                <span className="instrument-unit">{d.detail}</span>
              </div>
              <p>{d.note}</p>
            </div>
            <div
              className="instrument-controls"
              aria-label="Choisir une dimension du projet"
            >
              {DIMENSIONS.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  {item.name}
                  <span aria-hidden="true">{active === i ? "↗" : "+"}</span>
                </button>
              ))}
            </div>
            <Link href={d.path} className="instrument-discover">
              {d.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="hero-bottom">
          <span>Une référence. Une mesure. Une projection.</span>
          <a href="#lecture">
            Comprendre la dérive <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
