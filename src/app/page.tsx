import Link from "next/link";
import ForecastSimulator from "@/components/ForecastSimulator";
import CostGrid from "@/components/product/CostGrid";
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
          <SectionHead
            acte="Trois dimensions, une lecture du projet"
            titre={
              <>
                Le coût d’une décision.
                <br />
                Le temps de la prendre.
                <br />
                La preuve de son exécution.
              </>
            }
            chapeau="Explorez chaque module, son périmètre et les éléments qui attestent ses capacités. Les fonctions décrites et les démonstrations sont identifiées séparément."
          />
          <div className="module-editorial">
            {MODULES.map((m, i) => (
              <Link key={m.slug} href={`/cheetah-${m.slug}/`}>
                <span className="num text-xs" style={{ color: m.accentHex }}>
                  0{i + 1} / {m.dimension}
                </span>
                <h3>{m.nom}</h3>
                <p>{m.promesse}</p>
                <span className="module-link">
                  Explorer le module{" "}
                  <span aria-hidden="true" style={{ color: m.accentHex }}>
                    ↗
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-bone py-16 text-ink-900 md:py-20">
        <div className="shell grid items-start gap-8 md:grid-cols-2 md:gap-16">
          <div>
            <p className="eyebrow !text-ink-500">Cheetah Cost</p>
            <h2 className="display-md mt-5">Une référence.<br />Une mesure.<br />Une décision.</h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-ink-700">Budget à date, avancement physique, coût prévisionnel : lisez le projet dans une seule grille.</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">La présentation ci-dessous reprend les données du logiciel dans une interface lisible. Les différences avec le récapitulatif source sont signalées.</p>
            <Link href="/cheetah-cost/" className="btn btn-dark mt-6">Découvrir Cheetah Cost ↗</Link>
          </div>
        </div>
      </section>
      <section
        id="produit"
        className="scroll-mt-24 border-b border-white/[0.07] py-20 md:py-28"
      >
        <div className="shell">
          <SectionHead
            acte="Lecture de l’arrêté"
            titre={
              <>
                De la ligne budgétaire
                <br />à la décision.
              </>
            }
            chapeau="Reconstitution des colonnes de la capture Cost, dans l’habillage du site. Montants en k€. La preuve reste l’image d’origine, pas cette présentation."
          />
          <div className="mt-12">
            <CostGrid />
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="border-t border-drift/40 pt-6">
              <p className="num text-xs text-drift">LB02 / ÉCART 9 → 29 k€</p>
              <h3 className="display-sm mt-4">+20 k€ de dégradation.</h3>
              <p className="body-copy mt-3 text-sm">
                L’évolution de l’écart se mesure en milliers d’euros. La ligne
                n’est avancée qu’à 25 % : la tendance mérite une investigation
                avant la livraison.
              </p>
            </div>
            <div className="border-t border-volt/40 pt-6">
              <p className="num text-xs text-volt">LB04 / ÉCART −40 k€</p>
              <h3 className="display-sm mt-4">Une économie à expliquer.</h3>
              <p className="body-copy mt-3 text-sm">
                Sans dépense ni avancement enregistrés, ce montant ne prouve pas
                un gain de performance. Vérifiez le périmètre et la qualité de
                la prévision.
              </p>
            </div>
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
