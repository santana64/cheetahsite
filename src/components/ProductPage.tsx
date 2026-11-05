import type { ReactNode } from "react";
import Link from "next/link";
import { CtaBand, PageHero, ProofTag } from "@/components/ui";
import ProductViewport from "@/components/product/ProductViewport";
import PreuveCapture from "@/components/product/PreuveCapture";
import TimeCard from "@/components/product/TimeCard";
import { MODULES, type Module } from "@/content/cheetah";

function DocSchema() {
  return (
    <figure className="reveal">
      <div className="panel corner-ticks overflow-hidden">
        <div className="border-b border-white/[0.07] px-5 py-3">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-amber">
            Schéma de principe — ce n’est pas une capture du logiciel
          </p>
        </div>
        <svg
          viewBox="0 0 640 340"
          className="h-auto w-full"
          role="img"
          aria-labelledby="doc-schema-t"
        >
          <title id="doc-schema-t">
            Schéma : un livrable porte plusieurs versions successives, dont une
            seule fait foi, et chaque version est rattachée à la ligne
            budgétaire et au jalon qu’elle justifie.
          </title>
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              transform={`translate(${40 + i * 14} ${48 + i * 22})`}
              opacity={i === 2 ? 1 : 0.35}
            >
              <rect
                width="240"
                height="150"
                rx="2"
                fill="#12171e"
                stroke={i === 2 ? "#e9c9a0" : "#2e3946"}
                strokeWidth="1"
              />
              <text
                x="16"
                y="28"
                fill="#93a3b5"
                fontSize="10"
                fontFamily="monospace"
                letterSpacing="1.6"
              >
                VERSION {String(i + 1).padStart(2, "0")}
              </text>
              {[0, 1, 2, 3].map((l) => (
                <rect
                  key={l}
                  x="16"
                  y={48 + l * 18}
                  width={l === 3 ? 120 : 200}
                  height="6"
                  rx="1"
                  fill="#222b37"
                />
              ))}
            </g>
          ))}
          <text
            x="68"
            y="34"
            fill="#e9c9a0"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="1.6"
          >
            LIVRABLE
          </text>

          <g stroke="#e9c9a0" strokeWidth="1" opacity="0.5" fill="none">
            <path d="M322 168 H 420" />
            <path d="M420 168 V 104 H 470" />
            <path d="M420 168 V 232 H 470" />
          </g>
          <g>
            <rect
              x="470"
              y="84"
              width="132"
              height="42"
              rx="2"
              fill="#12171e"
              stroke="#cdf564"
              strokeWidth="1"
            />
            <text
              x="486"
              y="100"
              fill="#cdf564"
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="1.4"
            >
              LIGNE LB02
            </text>
            <text
              x="486"
              y="116"
              fill="#6b7a8d"
              fontSize="9"
              fontFamily="monospace"
            >
              justifie une variation
            </text>

            <rect
              x="470"
              y="212"
              width="132"
              height="42"
              rx="2"
              fill="#12171e"
              stroke="#f2a93b"
              strokeWidth="1"
            />
            <text
              x="486"
              y="228"
              fill="#f2a93b"
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="1.4"
            >
              JALON J-07
            </text>
            <text
              x="486"
              y="244"
              fill="#6b7a8d"
              fontSize="9"
              fontFamily="monospace"
            >
              conditionne la levée
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-4 text-xs leading-relaxed text-steel-500">
        Aucune capture de Cheetah Doc n’est publiée dans ce dépôt. Ce schéma
        illustre le principe décrit par l’éditeur ; il ne représente pas
        l’interface réelle. Demandez une démonstration pour voir le module en
        fonctionnement.
      </figcaption>
    </figure>
  );
}

const TITRES: Record<Module["slug"], string> = {
  cost: "L’écran de travail, colonne par colonne.",
  time: "La fiche projet telle qu’elle remonte au portefeuille.",
  doc: "Le principe, faute de capture publiée.",
};

export function ProductPage({
  module: m,
  demonstration,
}: {
  module: Module;
  demonstration?: ReactNode;
}) {
  const autres = MODULES.filter((x) => x.slug !== m.slug);
  const demontrees = m.capacites.filter((c) => c.preuve === "demontre");
  const decrites = m.capacites.filter((c) => c.preuve === "decrit");

  return (
    <>
      <PageHero
        fil={[
          { label: "Accueil", href: "/" },
          { label: "Produits", href: "/solutions/" },
          { label: m.nom },
        ]}
        eyebrow={`${m.dimension} · module disponible`}
        titre={m.promesse}
        chapeau={m.intro}
        accent={m.accentHex}
        code={`PRODUCT / ${m.slug.toUpperCase()}`}
        entries={
          m.slug === "cost"
            ? [
                { label: "Référence", value: "Budget à date" },
                { label: "Projection", value: "Coût prévisionnel" },
                { label: "Preuve", value: "Capture produit" },
              ]
            : m.slug === "time"
              ? [
                  { label: "Référence", value: "Baseline" },
                  { label: "Lecture", value: "Liens et marges" },
                  { label: "Preuve", value: "Capture produit" },
                ]
              : [
                  { label: "Traçabilité", value: "Versions" },
                  { label: "Statut", value: "Décrit par l’éditeur" },
                  { label: "Illustration", value: "Scénario pédagogique" },
                ]
        }
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/contact/" className="btn btn-primary">
            Demander une démonstration
          </Link>
          <Link href="/methodologie/" className="btn btn-ghost">
            La méthode derrière
          </Link>
        </div>
      </PageHero>

      <nav
        aria-label="Explorer les modules"
        className="border-b border-white/10 bg-ink-850"
      >
        <div className="shell flex flex-wrap gap-x-8">
          {MODULES.map((item) => (
            <Link
              key={item.slug}
              href={`/cheetah-${item.slug}/`}
              aria-current={item.slug === m.slug ? "page" : undefined}
              className="inline-flex min-h-14 items-center border-b-2 py-3 font-mono text-xs uppercase tracking-wider"
              style={{
                borderColor:
                  item.slug === m.slug ? item.accentHex : "transparent",
                color:
                  item.slug === m.slug ? item.accentHex : "var(--steel-300)",
              }}
            >
              {item.nom}
            </Link>
          ))}
        </div>
      </nav>

      {/* Preuve visuelle — reconstitution native, capture repliée */}
      <section className="border-b border-white/[0.07] bg-ink-850 py-20 md:py-28">
        <div className="shell">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Dans le produit</p>
              <h2 className="display-md mt-5 max-w-xl text-paper">
                {TITRES[m.slug]}
              </h2>
            </div>
            {m.capture && (
              <p className="max-w-sm text-xs leading-relaxed text-steel-500">
                Valeurs relevées sur la capture d’écran du produit, recomposées
                dans la typographie de ce site. Aucune donnée n’a été ajustée.
              </p>
            )}
          </div>

          <div className="reveal">
            {m.slug === "cost" && <ProductViewport />}
            {m.slug === "time" && <TimeCard />}
            {m.slug === "doc" && <DocSchema />}
          </div>

          {m.capture && m.slug !== "cost" && (
            <PreuveCapture
              src={m.capture.src}
              alt={m.capture.alt}
              width={1920}
              height={860}
              legende={m.capture.legende}
            />
          )}
        </div>
      </section>

      {demonstration && (
        <section className="border-b border-white/10 bg-ink-900 py-20 md:py-28">
          <div className="shell">{demonstration}</div>
        </section>
      )}

      {/* Capacités */}
      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Capacités</p>
            <h2 className="display-md mt-6 text-paper">
              Ce que le module fait, et ce qui reste déclaratif.
            </h2>
            <p className="body-copy mt-5 max-w-prose">
              {m.capture
                ? "Les capacités marquées « démontré » sont lisibles sur la capture ci-dessus. Les autres"
                : "Aucune capture Doc n’est disponible dans le dépôt. Les capacités ci-dessous"}{" "}
              sont décrites par l’éditeur et vous seront montrées en
              démonstration.
            </p>
          </div>

          <div className="lg:col-span-8">
            {[
              { titre: "Démontré par capture", items: demontrees },
              { titre: "Décrit par l’éditeur", items: decrites },
            ]
              .filter((g) => g.items.length > 0)
              .map((groupe) => (
                <div key={groupe.titre} className="mb-12 last:mb-0">
                  <h3 className="eyebrow mb-5">{groupe.titre}</h3>
                  <ul className="space-y-px">
                    {groupe.items.map((c, i) => (
                      <li
                        key={c.label}
                        className="reveal border-t border-white/[0.08] py-5"
                        data-reveal-delay={i * 45}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h4 className="text-[0.9375rem] font-semibold text-paper">
                            {c.label}
                          </h4>
                          <ProofTag preuve={c.preuve} compact />
                        </div>
                        {c.detail && (
                          <p className="body-copy mt-2 max-w-prose text-sm">
                            {c.detail}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Lexique */}
      {m.lexique && (
        <section className="border-b border-white/[0.07] bg-bone py-20 text-ink-800 md:py-28">
          <div className="shell">
            <p className="eyebrow !text-ink-500">Lire la grille</p>
            <h2 className="display-md mt-6 max-w-2xl text-ink-900">
              Six colonnes suffisent à savoir si un projet tient.
            </h2>
            <dl className="mt-12 grid gap-x-12 gap-y-6 md:grid-cols-2">
              {m.lexique.map((l) => (
                <div
                  key={l.terme}
                  className="reveal flex gap-5 border-t border-ink-800/12 pt-5"
                >
                  <dt className="num w-20 shrink-0 text-sm font-semibold text-ink-900">
                    {l.terme}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-800/70">
                    {l.sens}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Les deux autres dimensions */}
      <section className="border-b border-white/[0.07] bg-ink-850 py-20 md:py-24">
        <div className="shell">
          <p className="eyebrow mb-10">Les deux autres appuis</p>
          <div className="grid gap-px sm:grid-cols-2">
            {autres.map((o) => (
              <Link
                key={o.slug}
                href={`/cheetah-${o.slug}/`}
                className="group block border-t border-white/[0.08] py-8 transition-colors hover:bg-white/[0.02] sm:pr-10"
              >
                <p
                  className="font-mono text-[0.625rem] uppercase tracking-[0.22em]"
                  style={{ color: o.accentHex }}
                >
                  {o.dimension}
                </p>
                <h3 className="display-sm mt-3 text-paper transition-colors group-hover:text-volt">
                  {o.nom}
                </h3>
                <p className="body-copy mt-2 max-w-prose text-sm">
                  {o.promesse}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        titre={`Voir ${m.nom} sur un de vos projets.`}
        texte="La démonstration se fait sur vos propres données. C’est le seul moyen de savoir si le module tient face à votre réalité."
        secondaire={{ label: "Comparer les offres", href: "/tarifs/" }}
      />
    </>
  );
}

export default ProductPage;
