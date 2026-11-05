"use client";

import { useId, useRef, type PointerEvent } from "react";
import styles from "./control-field.module.css";

export type FieldMode = "cost" | "time" | "doc";
type Point = [number, number];
const project = (x: number, y: number, z = 0): Point => [
  380 + x * 0.82 - y * 0.68,
  300 + x * 0.36 + y * 0.36 - z,
];
const points = (vertices: Point[]) =>
  vertices.map((p) => p.join(",")).join(" ");
const line = (vertices: Point[]) =>
  vertices.map((p, i) => `${i ? "L" : "M"}${p.join(" ")}`).join(" ");
function Plate({
  z,
  color,
  opacity = 1,
}: {
  z: number;
  color: string;
  opacity?: number;
}) {
  const top = [
    project(-255, -160, z),
    project(255, -160, z),
    project(255, 160, z),
    project(-255, 160, z),
  ];
  return (
    <g opacity={opacity}>
      <polygon
        points={points([
          top[3],
          top[2],
          project(255, 160, z - 13),
          project(-255, 160, z - 13),
        ])}
        fill="#101820"
        stroke="#35424a"
        strokeWidth=".7"
      />
      <polygon
        points={points([
          top[1],
          top[2],
          project(255, 160, z - 13),
          project(255, -160, z - 13),
        ])}
        fill="#0b1218"
        stroke="#35424a"
        strokeWidth=".7"
      />
      <polygon
        points={points(top)}
        fill="#0d161c"
        fillOpacity=".88"
        stroke={color}
        strokeOpacity=".5"
        strokeWidth=".9"
      />
    </g>
  );
}
function CostGeometry() {
  const estimates = [760, 790, 825, 875, 920];
  const xs = [-200, -100, 0, 100, 200];
  const reference = xs.map((x) => project(x, 40, 100));
  const trajectory = estimates.map((v, i) =>
    project(xs[i], -40, (v - 600) / 2),
  );
  return (
    <g data-field-geometry="cost">
      {xs.map((x, i) => {
        const z = (estimates[i] - 600) / 2;
        const a = project(x - 15, -55, z),
          b = project(x + 15, -55, z),
          c = project(x + 15, -25, z),
          d = project(x - 15, -25, z);
        return (
          <g key={x}>
            <polygon
              points={points([
                d,
                c,
                project(x + 15, -25, 0),
                project(x - 15, -25, 0),
              ])}
              fill="#263b2a"
              stroke="#61734b"
              strokeWidth=".7"
            />
            <polygon
              points={points([
                b,
                c,
                project(x + 15, -25, 0),
                project(x + 15, -55, 0),
              ])}
              fill="#18281f"
              stroke="#61734b"
              strokeWidth=".6"
            />
            <polygon
              points={points([a, b, c, d])}
              fill="#536f38"
              stroke="#cdf564"
              strokeWidth=".9"
            />
            <path
              d={line([project(x, 40, 0), project(x, 40, 100)])}
              fill="none"
              stroke="#7f8d9d"
              strokeDasharray="3 5"
              opacity=".6"
            />
            <circle
              cx={reference[i][0]}
              cy={reference[i][1]}
              r="3"
              fill="#b4c0cd"
            />
            <text
              x={project(x, 100)[0]}
              y={project(x, 100)[1] + 24}
              className={styles.tick}
            >
              A0{i + 1}
            </text>
          </g>
        );
      })}
      <path
        d={line(reference)}
        fill="none"
        stroke="#aebbc8"
        strokeWidth="1.5"
        strokeDasharray="5 6"
      />
      <path
        d={line(trajectory)}
        fill="none"
        stroke="#cdf564"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {trajectory.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={i === 4 ? 6 : 3}
          fill="#cdf564"
          stroke="#0d161c"
          strokeWidth="2"
        />
      ))}
      <path
        d={line([
          trajectory[4],
          [trajectory[4][0] + 32, trajectory[4][1] - 25],
          [679, trajectory[4][1] - 25],
        ])}
        fill="none"
        stroke="#cdf564"
        strokeWidth=".8"
      />
      <text
        x="685"
        y={trajectory[4][1] - 29}
        textAnchor="end"
        className={styles.annotation}
        fill="#cdf564"
      >
        920 / CP
      </text>
      <path
        d={line([
          reference[4],
          [reference[4][0] + 30, reference[4][1] + 20],
          [665, reference[4][1] + 20],
        ])}
        fill="none"
        stroke="#9daaba"
        strokeWidth=".8"
      />
      <text
        x="670"
        y={reference[4][1] + 14}
        textAnchor="end"
        className={styles.annotation}
        fill="#bac6d1"
      >
        800 / BàD
      </text>
      <text x="103" y="417" className={styles.tick}>
        5 ARRÊTÉS FICTIFS / k€
      </text>
    </g>
  );
}
function TimeGeometry() {
  const scale = (day: number) => -220 + day * 12;
  const tasks = [
    { start: 0, end: 8, baseStart: 0, baseEnd: 8, y: -90, label: "ÉTUDES" },
    {
      start: 8,
      end: 28,
      baseStart: 8,
      baseEnd: 16,
      y: 0,
      label: "RÉALISATION",
    },
    {
      start: 28,
      end: 36,
      baseStart: 16,
      baseEnd: 24,
      y: 90,
      label: "INTÉGRATION",
    },
  ];
  return (
    <g data-field-geometry="time">
      {[0, 12, 24, 36].map((day) => (
        <g key={day}>
          <path
            d={line([project(scale(day), -135), project(scale(day), 145)])}
            stroke={day === 24 ? "#eef2f6" : "#5a6876"}
            strokeDasharray={day === 24 ? "4 5" : "2 6"}
            opacity={day === 24 ? 0.8 : 0.4}
          />
          <text
            x={project(scale(day), 155)[0]}
            y={project(scale(day), 155)[1] + 24}
            textAnchor="middle"
            className={styles.tick}
          >
            J+{String(day).padStart(2, "0")}
          </text>
        </g>
      ))}
      {tasks.map((t, i) => {
        const top = [
          project(scale(t.start), t.y - 16, 23),
          project(scale(t.end), t.y - 16, 23),
          project(scale(t.end), t.y + 16, 23),
          project(scale(t.start), t.y + 16, 23),
        ];
        return (
          <g key={t.label}>
            <path
              d={line([
                project(scale(t.baseStart), t.y + 25),
                project(scale(t.baseEnd), t.y + 25),
              ])}
              stroke="#a2afbd"
              strokeWidth="3"
              opacity=".8"
            />
            <polygon
              points={points([
                top[3],
                top[2],
                project(scale(t.end), t.y + 16),
                project(scale(t.start), t.y + 16),
              ])}
              fill="#503915"
              stroke="#ab813f"
              strokeWidth=".7"
            />
            <polygon
              points={points(top)}
              fill={i === 1 ? "#a87729" : "#584527"}
              stroke="#f2a93b"
              strokeWidth="1"
            />
            <text
              x={top[0][0]}
              y={top[0][1] - 12}
              className={styles.annotation}
              fill="#f2a93b"
            >
              0{i + 1} / {t.label}
            </text>
            {i < 2 && (
              <path
                d={line([
                  project(scale(t.end), t.y, 25),
                  project(scale(t.end) + 16, t.y + 43, 25),
                  project(scale(tasks[i + 1].start), tasks[i + 1].y, 25),
                ])}
                stroke="#f2a93b"
                strokeWidth="1.4"
                fill="none"
              />
            )}
          </g>
        );
      })}
      <path
        d={line([project(scale(36), 90, 25), project(scale(36), 145, 25)])}
        stroke="#f2a93b"
        strokeWidth="1"
      />
      <circle
        cx={project(scale(36), 145, 25)[0]}
        cy={project(scale(36), 145, 25)[1]}
        r="6"
        fill="#f2a93b"
      />

    </g>
  );
}
function DocGeometry() {
  const nodes = [
    { x: -170, y: -65, z: 30, v: "V01", status: "ÉMISSION" },
    { x: -5, y: 0, z: 75, v: "V02", status: "REVUE" },
    { x: 155, y: 65, z: 120, v: "V03", status: "RÉFÉRENCE" },
  ];
  return (
    <g data-field-geometry="doc">
      <path
        d={line(nodes.map((n) => project(n.x, n.y, n.z + 12)))}
        fill="none"
        stroke="#e9c9a0"
        strokeWidth="1.2"
        strokeDasharray="5 5"
      />
      {nodes.map((n, i) => {
        const top = [
          project(n.x - 53, n.y - 68, n.z),
          project(n.x + 53, n.y - 68, n.z),
          project(n.x + 53, n.y + 68, n.z),
          project(n.x - 53, n.y + 68, n.z),
        ];
        return (
          <g key={n.v}>
            <path
              d={line([project(n.x, n.y, n.z), project(n.x, n.y, 0)])}
              stroke="#9daaba"
              strokeDasharray="2 5"
              opacity=".4"
            />
            <polygon
              points={points(top.map((p) => [p[0], p[1] + 7] as Point))}
              fill="#28251f"
              stroke="#85725b"
              strokeWidth=".8"
            />
            <polygon
              points={points(top)}
              fill={i === 2 ? "#504636" : "#262820"}
              stroke="#e9c9a0"
              strokeOpacity={i === 2 ? 1 : 0.55}
              strokeWidth="1"
            />
            {[0, 1, 2, 3].map((k) => (
              <path
                key={k}
                d={line([
                  project(n.x - 32, n.y - 35 + k * 19, n.z + 1),
                  project(n.x + 26 - (k % 2) * 12, n.y - 35 + k * 19, n.z + 1),
                ])}
                stroke="#e9c9a0"
                opacity={i === 2 ? 0.65 : 0.3}
                strokeWidth="2"
              />
            ))}
            <text
              x={top[0][0] - 6}
              y={top[0][1] - 18}
              fill="#e9c9a0"
              className={styles.documentVersion}
            >
              {n.v}
            </text>
            <text x={top[3][0] - 3} y={top[3][1] + 29} className={styles.tick}>
              {n.status}
            </text>
          </g>
        );
      })}
      <path
        d={line([project(155, 65, 120), [618, 201], [680, 201]])}
        fill="none"
        stroke="#e9c9a0"
      />
      <circle cx="680" cy="201" r="5" fill="#e9c9a0" />
      <text
        x="674"
        y="185"
        textAnchor="end"
        className={styles.annotation}
        fill="#e9c9a0"
      >
        DÉCISION LIÉE
      </text>
      <text x="88" y="416" className={styles.tick}>
        LIVRABLE / RÉVISION / JUSTIFICATIF
      </text>
    </g>
  );
}
export default function ControlField({ mode }: { mode: FieldMode }) {
  const id = useId().replace(/:/g, "");
  const host = useRef<HTMLDivElement>(null);
  const color = { cost: "#cdf564", time: "#f2a93b", doc: "#e9c9a0" }[mode];
  function pointer(e: PointerEvent<HTMLDivElement>) {
    if (
      e.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    host.current?.style.setProperty(
      "--field-rx",
      `${(-(e.clientY - rect.top - rect.height / 2) / rect.height) * 5}deg`,
    );
    host.current?.style.setProperty(
      "--field-ry",
      `${((e.clientX - rect.left - rect.width / 2) / rect.width) * 6}deg`,
    );
  }
  return (
    <div
      ref={host}
      className={styles.field}
      onPointerMove={pointer}
      onPointerLeave={() => {
        host.current?.style.setProperty("--field-rx", "0deg");
        host.current?.style.setProperty("--field-ry", "0deg");
      }}
    >
      <svg
        className={`project-cutaway ${styles.scene}`}
        viewBox="0 0 760 500"
        role="img"
        aria-label={
          mode === "cost"
            ? "Prévisions de coût sur cinq arrêtés fictifs, une trajectoire comparée au budget à date."
            : mode === "time"
              ? "Trois tâches liées de fin à début : douze jours ajoutés décalent la fin de J+24 à J+36."
              : "Trois versions d’un document, de l’émission à la référence associée à une décision."
        }
      >
        <defs>
          <radialGradient id={`${id}-field`}>
            <stop stopColor={color} stopOpacity=".09" />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="380"
          cy="300"
          rx="365"
          ry="185"
          fill={`url(#${id}-field)`}
        />
        <g className={styles.reference}>
          <path
            d="M36 280H724M380 30V463"
            fill="none"
            stroke="#7b8c9a"
            strokeWidth=".6"
            strokeDasharray="2 8"
            opacity=".45"
          />
          <ellipse
            cx="380"
            cy="310"
            rx="330"
            ry="151"
            stroke="#41505b"
            strokeWidth=".7"
            fill="none"
          />
          <path
            d="M50 310H60M700 310H710M380 154V164M380 456V466"
            stroke="#9daaba"
            strokeWidth="1"
          />
          <Plate z={-34} color="#53616b" opacity={0.4} />
          <Plate z={-17} color="#53616b" opacity={0.55} />
          <Plate z={0} color={color} />
          {[-200, -100, 0, 100, 200].map((x) => (
            <path
              key={x}
              d={line([project(x, -160), project(x, 160)])}
              stroke="#56646e"
              opacity=".24"
              strokeWidth=".6"
            />
          ))}
          {[-120, -60, 0, 60, 120].map((y) => (
            <path
              key={y}
              d={line([project(-255, y), project(255, y)])}
              stroke="#56646e"
              opacity=".24"
              strokeWidth=".6"
            />
          ))}
        </g>
        <g key={mode} className={styles.geometry}>
          {mode === "cost" ? (
            <CostGeometry />
          ) : mode === "time" ? (
            <TimeGeometry />
          ) : (
            <DocGeometry />
          )}
        </g>
        <text x="40" y="70" className={styles.register}>
          CF / 03
        </text>
        <text x="40" y="87" className={styles.tick}>
          CHAMP DE CONTRÔLE
        </text>
        <text x="718" y="447" textAnchor="end" className={styles.register}>
          {mode.toUpperCase()} / ACTIVE
        </text>
        <path
          d="M40 447h45M40 447v-12M718 63h-45M718 63v12"
          stroke={color}
          opacity=".6"
        />
      </svg>
    </div>
  );
}
