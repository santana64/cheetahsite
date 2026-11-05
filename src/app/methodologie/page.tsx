import type { Metadata } from 'next';
import styles from '@/components/ui.module.css';
import { pageMetadata } from '@/lib/metadata';
import ForecastSimulator from '@/components/ForecastSimulator';
import { CtaBand, PageHero } from '@/components/ui';
import { METHODE_ETAPES } from '@/content/cheetah';

export const metadata: Metadata = {
  ...pageMetadata('/methodologie/', 'La méthode de contrôle de coûts', 'Budget initial, budget à date, avancement physique, valeur acquise, reste à faire, coût prévisionnel, écart et dérive : la chaîne de mesure que Cheetah Cost outille, expliquée et simulable.'),
};

export default function Page() {
  return (
    <>
      <PageHero
        code="02 / MÉTHODE"
        entries={[{"label": "Référence", "value": "Budget initial → budget à date"}, {"label": "Mesure", "value": "Dépenses ≠ avancement"}, {"label": "Projection", "value": "Dépensé + reste à faire"}]}
        fil={[{ label: 'Accueil', href: '/' }, { label: 'Méthode' }]}
        eyebrow="Intelligence métier"
        titre="Un coût final ne se constate pas. Il se recalcule."
        chapeau="Le suivi comptable répond à une question : combien avons-nous dépensé. Le contrôle de coûts en pose une autre, plus difficile : combien aurons-nous dépensé à la fin. Voici la chaîne de calcul qui y répond, telle qu’elle est outillée dans Cheetah Cost."
      />

      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <ol className={styles.methodChain}>
            {METHODE_ETAPES.map((e) => (
              <li key={e.n} className={`reveal ${styles.methodStep}`}>
                <div className={styles.stepNumber}>
                  <span className="num text-sm text-volt">{e.n}</span>
                </div>
                <div className={styles.stepTitle}>
                  <h2 className="display-sm text-paper">{e.titre}</h2>
                  <p className="mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-steel-500">
                    {e.sous}
                  </p>
                </div>
                <div className={styles.stepText}>
                  <p className="body-copy max-w-prose">{e.texte}</p>
                </div>
                <div className={styles.stepFormula}>
                  {e.colonnes.map((c) => (
                    <span
                      key={c}
                      className="num h-fit rounded-sm bg-volt/10 px-2 py-1 text-[0.6875rem] text-volt"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-bone py-20 text-ink-800 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow !text-ink-500">Le point qui change tout</p>
            <h2 className="display-md mt-6 text-ink-900">
              Les dépenses et l’avancement doivent être saisis séparément.
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-ink-800/80">
              C’est la seule contrainte réellement exigeante de la méthode, et c’est elle qui
              produit toute la valeur. Tant que l’avancement est déduit des dépenses, un projet qui
              consomme son budget paraît avancer. Les deux grandeurs mesurent des choses
              différentes : l’une sort de la comptabilité, l’autre d’un jugement sur le terrain.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ink-800/65">
              Leur écart s’appelle l’indice de performance des coûts. Inférieur à 1, il indique
              qu’une unité de budget consommée produit moins d’une unité de travail. Appliqué au
              reste à faire, il transforme un retard discret en coût final chiffré — plusieurs
              arrêtés avant que la trésorerie ne le signale.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">Manipuler le modèle</p>
          <h2 className="display-md mt-6 max-w-2xl text-paper">
            Changez une hypothèse. Regardez la fin de projet bouger.
          </h2>
          <p className="body-copy mt-5 max-w-prose">
            Le simulateur ci-dessous applique exactement les formules décrites plus haut. Il sert à
            comprendre la mécanique : les valeurs sont fictives et il ne reproduit pas le moteur de
            calcul du logiciel.
          </p>
          <div className="reveal mt-12">
            <ForecastSimulator />
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-ink-850 py-16">
        <div className="shell max-w-3xl">
          <p className="eyebrow !text-amber">Note de transparence</p>
          <h2 className="display-sm mt-5 text-paper">Sur le sigle FGF</h2>
          <p className="body-copy mt-4">
            Le sigle <span className="num text-steel-200">FGF</span> apparaît dans l’interface de
            Cheetah Cost, où il désigne le cadre de suivi décrit sur cette page. Nous ne disposons
            d’aucune source publique en définissant le développé exact, et nous ne le présentons
            donc ni comme une norme sectorielle, ni comme un référentiel reconnu. Les opérations
            décrites ici, en revanche, sont directement lisibles dans les colonnes du produit et
            correspondent aux pratiques classiques de gestion par la valeur acquise.
          </p>
        </div>
      </section>

      <CtaBand
        titre="La méthode sur votre dernier arrêté."
        texte="Apportez un projet en cours. On applique la chaîne de calcul à vos lignes réelles et vous voyez ce que ça change."
        secondaire={{ label: 'Voir Cheetah Cost', href: '/cheetah-cost/' }}
      />
    </>
  );
}
