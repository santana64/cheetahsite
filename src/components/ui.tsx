import Link from "next/link";
import styles from "./ui.module.css";
import { ReactNode } from "react";
import { PREUVE_LABEL, type Preuve } from "@/content/cheetah";

/* ── En-tête de section éditoriale ──────────────────────────────────── */

export function SectionHead({
  acte,
  titre,
  chapeau,
  align = "left",
  tone = "dark",
}: {
  acte: string;
  titre: ReactNode;
  chapeau?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={`reveal ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
    >
      <p className={`eyebrow ${tone === "light" ? "!text-ink-500" : ""}`}>
        {acte}
      </p>
      <h2
        className={`display-lg reveal-mask mt-6 ${tone === "light" ? "text-ink-900" : "text-paper"}`}
      >
        {titre}
      </h2>
      {chapeau && (
        <div
          className={`lede mt-6 ${tone === "light" ? "!text-ink-700" : ""} ${align === "center" ? "mx-auto" : ""}`}
        >
          {chapeau}
        </div>
      )}
    </div>
  );
}

/* ── Marqueur de fiabilité ──────────────────────────────────────────── */

const PREUVE_STYLE: Record<Preuve, string> = {
  demontre: "border-volt/35 text-volt",
  decrit: "border-steel-400/35 text-steel-300",
  roadmap: "border-amber/35 text-amber",
};

export function ProofTag({
  preuve,
  compact = false,
}: {
  preuve: Preuve;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] ${PREUVE_STYLE[preuve]}`}
      title={PREUVE_LABEL[preuve]}
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      {compact
        ? preuve === "demontre"
          ? "Démontré"
          : preuve === "decrit"
            ? "Décrit"
            : "À venir"
        : PREUVE_LABEL[preuve]}
    </span>
  );
}

/* ── Bandeau de conversion ──────────────────────────────────────────── */

export function CtaBand({
  titre,
  texte,
  primaire = { label: "Demander une démonstration", href: "/contact/" },
  secondaire,
}: {
  titre: string;
  texte: string;
  primaire?: { label: string; href: string };
  secondaire?: { label: string; href: string };
}) {
  return (
    <section className={styles.cta}>
      <div className={`shell ${styles.ctaGrid}`}>
        <div>
          <p className={styles.serial}>PROCHAINE ÉTAPE / VOTRE PROJET</p>
          <h2 className="display-lg reveal mt-6 text-paper">{titre}</h2>
        </div>
        <div className={styles.ctaActions}>
          <p className="body-copy reveal">{texte}</p>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            <Link href={primaire.href} className="btn btn-primary">
              {primaire.label}
              <span aria-hidden="true">↗</span>
            </Link>
            {secondaire && (
              <Link href={secondaire.href} className="btn btn-ghost">
                {secondaire.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Fil d'ariane simple ────────────────────────────────────────────── */

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Fil d’ariane"
      className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]"
    >
      <ol className="flex flex-wrap items-center gap-2 text-steel-500">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex min-h-[26px] items-center transition-colors hover:text-volt"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-steel-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ── En-tête de page intérieure ─────────────────────────────────────── */

export function PageHero({
  fil,
  eyebrow,
  titre,
  chapeau,
  accent = "#cdf564",
  scene,
  code,
  entries,
  children,
}: {
  fil: { label: string; href?: string }[];
  eyebrow: string;
  titre: ReactNode;
  chapeau: ReactNode;
  accent?: string;
  /** Scène 3D posée derrière l'en-tête, quand la page en a une. */
  scene?: ReactNode;
  code?: string;
  entries?: { label: string; value: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section
      className={`${styles.hero} ${scene ? styles.heroScene : ""}`}
      style={{ "--page-accent": accent } as React.CSSProperties}
    >
      {scene && (
        <div className={styles.scene} aria-hidden="true">
          {scene}
        </div>
      )}
      <div className="shell relative">
        <div className={styles.heroTop}>
          <Breadcrumb items={fil} />
          <span className={styles.serial}>
            {code || "CHEETAH / CONTROL FIELD"}
          </span>
        </div>
        <div className={styles.heroGrid}>
          <div>
            <p className={`eyebrow ${styles.heroEyebrow}`}>{eyebrow}</p>
            <h1 className={styles.heroTitle}>{titre}</h1>
            <div className={`lede ${styles.heroLead}`}>{chapeau}</div>
            {children}
          </div>
          {entries && (
            <aside
              className={styles.instrument}
              aria-label="Repères de la page"
            >
              <div className={styles.instrumentHead}>
                <span>REPÈRES / {eyebrow}</span>
                <span aria-hidden="true">＋</span>
              </div>
              <div className={styles.instrumentMark} aria-hidden="true">
                <svg viewBox="0 0 300 100" fill="none">
                  <path
                    d="M0 78H300M0 28H300M60 0V100M150 0V100M240 0V100"
                    stroke="currentColor"
                    opacity=".12"
                  />
                  {code?.startsWith("04") ? (
                    <>
                      <path
                        d="M20 18H130V82H20ZM170 18H280V82H170Z"
                        stroke="currentColor"
                        opacity=".4"
                      />
                      <path
                        d="M140 50H160M150 40V60"
                        stroke="var(--page-accent)"
                      />
                      <text
                        x="75"
                        y="54"
                        textAnchor="middle"
                        fill="var(--page-accent)"
                        fontSize="11"
                      >
                        ABONNEMENT
                      </text>
                      <text
                        x="225"
                        y="54"
                        textAnchor="middle"
                        fill="var(--page-accent)"
                        fontSize="10"
                      >
                        MISE EN SERVICE
                      </text>
                    </>
                  ) : code?.startsWith("03") ? (
                    <>
                      <path
                        d="M15 20H95V80H15ZM205 20H285V80H205ZM115 35H185V65H115Z"
                        stroke="currentColor"
                        opacity=".55"
                      />
                      <path
                        d="M95 50H115M185 50H205"
                        stroke="var(--page-accent)"
                      />
                      <circle
                        cx="150"
                        cy="50"
                        r="4"
                        fill="var(--page-accent)"
                      />
                    </>
                  ) : code?.startsWith("05") ? (
                    <>
                      <path
                        d="M30 50H270"
                        stroke="var(--page-accent)"
                        strokeDasharray="4 6"
                      />
                      {[50, 150, 250].map((x) => (
                        <circle
                          key={x}
                          cx={x}
                          cy="50"
                          r="10"
                          stroke="var(--page-accent)"
                          fill="#090c0e"
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      <path d="M30 50H270" stroke="var(--page-accent)" />
                      {[50, 150, 250].map((x, i) => (
                        <g key={x}>
                          <rect
                            x={x - 16}
                            y="34"
                            width="32"
                            height="32"
                            stroke="var(--page-accent)"
                            fill="#090c0e"
                          />
                          <text
                            x={x}
                            y="54"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="10"
                          >
                            0{i + 1}
                          </text>
                        </g>
                      ))}
                    </>
                  )}
                </svg>
              </div>
              <ol>
                {entries.map((entry, i) => (
                  <li key={entry.label}>
                    <span className={styles.instrumentIndex}>0{i + 1}</span>
                    <div>
                      <span className={styles.instrumentLabel}>
                        {entry.label}
                      </span>
                      {entry.href ? (
                        <Link href={entry.href}>
                          {entry.value}
                          <span aria-hidden="true"> ↗</span>
                        </Link>
                      ) : (
                        <strong>{entry.value}</strong>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
              <p className={styles.instrumentFoot}>
                CHEETAHSOFT / PRECISION IN MOTION
              </p>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
