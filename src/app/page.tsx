import Link from "next/link";
import ForecastSimulator from "@/components/ForecastSimulator";
import ProductViewport from "@/components/product/ProductViewport";
import styles from "@/components/home/home.module.css";
import Stage from "@/components/home/Stage";
import VarianceReading from "@/components/home/VarianceReading";
import { CtaBand, SectionHead } from "@/components/ui";
import { MODULES, METHODE_ETAPES } from "@/content/cheetah";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "/",
  "Contrôle de projets industriels : coûts, délais et preuves",
  "Anticipez les dérives de vos projets industriels avec Cheetah Cost, Time et Doc. Découvrez les interfaces réelles et explorez nos simulations pédagogiques.",
);

export default function Accueil() {
  return (
    <>
      <Stage />
      <section
        id="lecture"
        className="scroll-mt-24 bg-bone py-20 text-ink-900 md:py-28"
      >
        <div className="shell reading-grid">
          <div>
            <p className="eyebrow !text-ink-500">
              Le signal derrière les chiffres
            </p>
            <h2 className="display-lg mt-6">
              Dépenser comme prévu.
              <br />
              <span className="text-ink-500">Livrer moins que prévu.</span>
            </h2>
            <p className="mt-7 text-lg leading-relaxed text-ink-700">
              Un budget consommé à 52,5 % ne dit pas si la moitié du travail est
              faite.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              Le contrôle commence quand on rapproche la dépense du travail
              réellement produit. Faites varier l’avancement : une même
              situation comptable peut raconter une tout autre fin de projet.
            </p>
            <Link href="/methodologie/" className="btn btn-dark mt-7">
              Comprendre la méthode <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <VarianceReading />
        </div>
      </section>
      <section
        id="logiciels"
        className="scroll-mt-24 border-b border-white/[0.07] bg-ink-900 py-20 md:py-28"
      >
        <div className="shell">
          <div className={styles.moduleHeading}>
            <p className="eyebrow">Un même projet</p>
            <h2 className="display-lg">
              Trois dimensions.
              <br />
              Aucun angle mort.
            </h2>
            <p className="body-copy">
              L’argent, le temps, la preuve : trois lectures complémentaires,
              avec un périmètre et des capacités documentés.
            </p>
          </div>
          <div className={styles.moduleRows}>
            {MODULES.map((m, i) => (
              <Link
                key={m.slug}
                href={`/cheetah-${m.slug}/`}
                style={
                  { "--module-accent": m.accentHex } as React.CSSProperties
                }
              >
                <span className={styles.moduleCode}>
                  0{i + 1} / {m.slug.toUpperCase()}
                </span>
                <h3>{m.nom}</h3>
                <p>{m.promesse}</p>
                <svg viewBox="0 0 100 52" aria-hidden="true">
                  {i === 0 ? (
                    <>
                      <path d="M4 42H96M8 32L30 24L52 28L74 9L94 5" />
                      <path
                        d="M8 38L30 30L52 23L74 17L94 12"
                        strokeDasharray="3 4"
                      />
                    </>
                  ) : i === 1 ? (
                    <>
                      <path d="M8 9H38V25H67V42H94M8 6V12M38 22V28M67 39V45" />
                      <path
                        d="M8 18H35M41 33H64M70 49H94"
                        strokeDasharray="3 3"
                      />
                    </>
                  ) : (
                    <>
                      <path d="M8 16H31V43H8ZM39 9H62V36H39ZM70 2H93V29H70Z" />
                      <path d="M31 29H39M62 22H70" />
                    </>
                  )}
                </svg>
                <span className={styles.moduleArrow} aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section
        id="produit"
        className="scroll-mt-24 bg-bone py-20 text-ink-900 md:py-28"
      >
        <div className="shell">
          <SectionHead
            acte="Lecture du produit"
            tone="light"
            titre={
              <>
                De la ligne budgétaire
                <br />à la décision.
              </>
            }
            chapeau="Reconstitution des colonnes de la capture Cost, dans l’habillage du site. Montants en k€. La preuve reste l’image d’origine, pas cette présentation."
          />
          <div className="mt-12">
            <ProductViewport />
          </div>
        </div>
      </section>
      <section className="bg-ink-850 py-20 md:py-28">
        <div className="shell">
          <SectionHead
            acte="Prendre les commandes"
            titre={
              <>
                Changez une hypothèse.
                <br />
                Observez la conséquence.
              </>
            }
            chapeau="Des données fictives, des formules explicites. Faites varier budget, dépenses et avancement pour comprendre la construction d’un coût final anticipé."
          />
          <div className="mt-12">
            <ForecastSimulator />
          </div>
        </div>
      </section>
      <section className="bg-bone py-20 text-ink-900 md:py-28">
        <div className="shell">
          <p className="eyebrow !text-ink-500">De la méthode à l’outil</p>
          <h2 className="display-lg mt-6 max-w-4xl">
            Un contrôle qui se construit.
            <br />
            Arrêté après arrêté.
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-5">
            {METHODE_ETAPES.map((e) => (
              <li key={e.n} className="border-t border-ink-800/20 pt-5">
                <span className="num text-xs text-ink-500">{e.n}</span>
                <h3 className="mt-3 font-semibold">{e.titre}</h3>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/methodologie/" className="btn btn-dark">
              Explorer la méthodologie
            </Link>
            <Link href="/tarifs/" className="btn border border-ink-800/30">
              Comparer les offres
            </Link>
          </div>
        </div>
      </section>
      <CtaBand
        titre="Votre prochain arrêté mérite une meilleure lecture."
        texte="Échangeons sur votre organisation, vos données et les décisions que vous devez prendre. Une démonstration pour évaluer le périmètre utile à vos projets."
      />
    </>
  );
}
