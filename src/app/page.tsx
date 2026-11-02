import Link from 'next/link';
import ForecastSimulator from '@/components/ForecastSimulator';
import CostGrid from '@/components/product/CostGrid';
import Stage from '@/components/home/Stage';
import { CtaBand, ProofTag, SectionHead } from '@/components/ui';
import { CIBLES, FRICTIONS, METHODE_ETAPES, MODULES, PLATEFORME } from '@/content/cheetah';

export default function Accueil() {
  const cost = MODULES[0];

  return (
    <>
      <Stage />

      {/* ═══ Les trois dimensions ═══════════════════════════════════ */}
      <section className="relative border-b border-white/[0.07] bg-ink-900 py-24 md:py-36">
        <div className="shell">
          <SectionHead
            acte="Acte 04 — Les trois dimensions"
            titre={
              <>
                Un projet se tient sur trois appuis.
                <br />
                Il suffit qu’un seul cède.
              </>
            }
            chapeau="Cost, Time et Doc ne sont pas trois produits vendus ensemble. Ce sont les trois mesures d’un même objet : ce que le projet coûte, quand il livre, et ce qui le prouve."
          />

          <div className="mt-20 space-y-px">
            {MODULES.map((m, i) => (
              <Link
                key={m.slug}
                href={`/cheetah-${m.slug}/`}
                className="reveal group relative block border-t border-white/[0.08] py-9 transition-colors hover:bg-white/[0.02] md:py-12"
                data-reveal-delay={i * 90}
              >
                <span
                  className="absolute left-0 top-0 h-px w-0 transition-[width] duration-700 ease-cheetah group-hover:w-full"
                  style={{ background: m.accentHex }}
                  aria-hidden="true"
                />
                <div className="grid items-start gap-6 md:grid-cols-12">
                  <div className="md:col-span-1">
                    <span className="num text-sm text-steel-500">0{i + 1}</span>
                  </div>
                  <div className="md:col-span-4">
                    <p
                      className="font-mono text-[0.625rem] uppercase tracking-[0.22em]"
                      style={{ color: m.accentHex }}
                    >
                      {m.dimension}
                    </p>
                    <h3 className="display-md mt-3 text-paper">{m.nom}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-lg leading-snug text-paper">{m.promesse}</p>
                    <p className="body-copy mt-3 max-w-prose">{m.intro}</p>
                  </div>
                  <div className="flex md:col-span-1 md:justify-end">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-current"
                      style={{ color: m.accentHex }}
                      aria-hidden="true"
                    >
                      <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                        <path
                          d="M9 1l5 5-5 5M14 6H0"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Le produit, enfin visible ═══════════════════════════════ */}
      <section
        id="produit"
        className="relative scroll-mt-24 border-b border-white/[0.07] bg-ink-900 py-24 md:py-36"
      >
        <div className="techgrid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHead
                acte="Acte 05 — Le logiciel"
                titre={
                  <>
                    Voilà l’écran de travail.
                    <br />
                    Pas une illustration.
                  </>
                }
                chapeau="Douze colonnes, cinq opérations, une date d’arrêté. Chaque ligne budgétaire porte sa référence, sa mesure et sa projection."
              />
            </div>
            <div className="lg:col-span-6 lg:pt-20">
              <p className="reveal body-copy max-w-prose">
                Ce tableau n’est pas une maquette : colonnes, groupes d’en-tête et valeurs sont
                relevés sur l’écran réel du module Cost. Nous l’avons simplement composé dans la
                typographie de ce site, pour qu’il reste lisible au lieu d’être une image.
              </p>
              <p className="reveal body-copy mt-4 max-w-prose">
                Rien n’est allégé pour la photo. C’est dense parce que le métier l’est.
              </p>
              <div className="reveal mt-8 flex flex-wrap gap-3">
                <Link href="/cheetah-cost/" className="btn btn-primary">
                  Explorer Cheetah Cost
                </Link>
                <Link href="/methodologie/" className="btn btn-ghost">
                  Comprendre la méthode
                </Link>
              </div>
            </div>
          </div>

          <div className="reveal mt-16">
            <CostGrid />
          </div>

          {/* Lecture commentée de deux lignes réelles */}
          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="eyebrow">Lire une dérive</p>
              <h3 className="display-md mt-5 text-paper">
                Deux lignes, deux situations opposées.
              </h3>
              <p className="body-copy mt-4 max-w-prose">
                Le niveau de l’écart ne dit presque rien. C’est sa variation d’un arrêté à l’autre
                — la colonne D — qui déclenche l’action.
              </p>
            </div>
            <div className="grid gap-px lg:col-span-8 lg:grid-cols-2">
              <div className="reveal border-t border-drift/40 py-7 lg:pr-10">
                <p className="num text-xs font-semibold text-drift">
                  LB02 · E 29 · E/BàD 11 % · E préc. 9 · D +20
                </p>
                <h4 className="mt-3 text-lg font-semibold tracking-tight text-paper">
                  La ligne qui se dégrade
                </h4>
                <p className="body-copy mt-2 max-w-prose text-sm">
                  Le coût prévisionnel dépasse le budget à date de 11 %. Mais l’information utile
                  est la tendance : l’écart valait 9 à l’arrêté précédent, il vaut 29 aujourd’hui.
                  Vingt points de dégradation en une période, sur une ligne avancée à 25 %. C’est
                  là qu’on intervient, pas à la livraison.
                </p>
              </div>
              <div className="reveal border-t border-volt/40 py-7 lg:pl-10" data-reveal-delay="120">
                <p className="num text-xs font-semibold text-volt">
                  LB04 · E −40 · E/BàD −12 % · D −40
                </p>
                <h4 className="mt-3 text-lg font-semibold tracking-tight text-paper">
                  L’économie qui pose question
                </h4>
                <p className="body-copy mt-2 max-w-prose text-sm">
                  Écart négatif : la ligne coûtera quarante de moins que son budget à date. Elle
                  mérite pourtant la même attention — apparue d’un seul coup depuis le dernier
                  arrêté, sans dépense ni avancement enregistrés, une économie de 12 % signale
                  plus souvent un périmètre qui a bougé qu’une bonne surprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Lire la grille ═══════════════════════════════════════════ */}
      <section className="border-b border-white/[0.07] bg-bone py-20 text-ink-800 md:py-28">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow !text-ink-500">Lire la grille</p>
              <h2 className="display-md mt-6 text-ink-900">
                Six colonnes suffisent à savoir si un projet tient.
              </h2>
            </div>
            <dl className="grid gap-x-12 gap-y-5 lg:col-span-8 lg:grid-cols-2">
              {cost.lexique!.map((l) => (
                <div key={l.terme} className="reveal flex gap-4 border-t border-ink-800/12 pt-4">
                  <dt className="num w-24 shrink-0 text-xs font-semibold text-ink-900">{l.terme}</dt>
                  <dd className="text-xs leading-relaxed text-ink-800/70">{l.sens}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ═══ Méthode + simulateur ═══════════════════════════════════ */}
      <section className="relative border-b border-white/[0.07] bg-ink-900 py-24 md:py-36">
        <div className="techgrid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="shell relative">
          <SectionHead
            acte="Acte 06 — L’intelligence métier"
            titre={
              <>
                Cinq gestes, dans cet ordre.
                <br />
                C’est tout le contrôle de coûts.
              </>
            }
            chapeau="La méthode que Cheetah Cost outille ne tient pas en un acronyme. Elle tient dans l’enchaînement rigoureux de cinq opérations, dont chacune produit une colonne de la grille."
          />

          <ol className="mt-20 grid gap-px border-t border-white/[0.08] md:grid-cols-5">
            {METHODE_ETAPES.map((e, i) => (
              <li
                key={e.n}
                className="reveal relative border-b border-white/[0.08] py-8 md:border-b-0 md:border-r md:border-white/[0.08] md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                data-reveal-delay={i * 80}
              >
                <span className="num text-xs text-volt">{e.n}</span>
                <h3 className="display-sm mt-4 text-paper">{e.titre}</h3>
                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-steel-500">
                  {e.sous}
                </p>
                <p className="body-copy mt-4 text-sm">{e.texte}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {e.colonnes.map((c) => (
                    <span
                      key={c}
                      className="num rounded-sm bg-volt/10 px-1.5 py-0.5 text-[0.625rem] text-volt"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <div className="reveal mt-20">
            <ForecastSimulator />
          </div>

          <p className="reveal mt-6 max-w-3xl text-xs leading-relaxed text-steel-500">
            Note de transparence — le sigle <span className="num text-steel-300">FGF</span> apparaît
            dans l’interface du produit comme nom interne de cette méthode. Nous ne disposons
            d’aucune documentation publique en définissant le développé exact, et nous ne le
            présentons donc pas comme une norme reconnue. Les opérations décrites ci-dessus, elles,
            sont directement lisibles dans les colonnes du logiciel.
          </p>
        </div>
      </section>

      {/* ═══ Ce que ça remplace ═════════════════════════════════════ */}
      <section className="border-b border-white/[0.07] bg-ink-850 py-24 md:py-32">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHead
                acte="Acte 07 — Le terrain"
                titre={
                  <>
                    Ce qui casse,
                    <br />
                    aujourd’hui.
                  </>
                }
              />
            </div>
            <ul className="lg:col-span-8">
              {FRICTIONS.map((f, i) => (
                <li
                  key={f.code}
                  className="reveal flex gap-6 border-t border-white/[0.08] py-7"
                  data-reveal-delay={i * 70}
                >
                  <span className="num pt-1 text-xs text-drift">{f.code}</span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-paper">{f.titre}</h3>
                    <p className="body-copy mt-2 max-w-prose">{f.texte}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ Pour qui ═══════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.07] bg-ink-900 py-24 md:py-32">
        <div className="shell">
          <SectionHead
            acte="Destinataires"
            titre="Conçu pour ceux qui doivent rendre des comptes."
            chapeau="Cheetah s’adresse aux organisations qui engagent des budgets et doivent les justifier — pas aux équipes qui cherchent un outil de suivi de tâches."
          />
          <div className="mt-16 grid gap-px border-t border-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {CIBLES.map((c, i) => (
              <div
                key={c.role}
                className="reveal border-b border-white/[0.08] py-7 sm:odd:pr-8 lg:px-7 lg:first:pl-0"
                data-reveal-delay={i * 60}
              >
                <h3 className="text-base font-semibold text-paper">{c.role}</h3>
                <p className="body-copy mt-2 text-sm">{c.besoin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Les preuves ════════════════════════════════════════════ */}
      <section className="border-b border-white/[0.07] bg-ink-850 py-24 md:py-32">
        <div className="shell">
          <SectionHead
            acte="Acte 08 — Les preuves"
            titre="Ce que nous affirmons, et sur quelle base."
            chapeau="Chaque capacité de cette page porte son niveau de preuve. Démontré veut dire visible dans une capture du logiciel. Décrit veut dire annoncé par l’éditeur, sans démonstration jointe ici."
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="eyebrow mb-6">Plateforme</h3>
              <ul className="space-y-px">
                {PLATEFORME.map((p, i) => (
                  <li
                    key={p.titre}
                    className="reveal border-t border-white/[0.08] py-5"
                    data-reveal-delay={i * 50}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-paper">{p.titre}</h4>
                      <ProofTag preuve={p.preuve} compact />
                    </div>
                    <p className="body-copy mt-2 text-sm">{p.texte}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal">
              <h3 className="eyebrow mb-6">Ce que nous ne prétendons pas</h3>
              <div className="panel corner-ticks p-7">
                <ul className="space-y-5 text-sm leading-relaxed text-steel-300">
                  <li>
                    <strong className="text-paper">Aucune certification affichée.</strong> Les
                    labels de sécurité et d’hébergement ne figurent pas sur ce site tant que les
                    attestations correspondantes ne sont pas publiées.
                  </li>
                  <li>
                    <strong className="text-paper">Aucun engagement chiffré de disponibilité.</strong>{' '}
                    Les niveaux de service sont définis au contrat, pas en page d’accueil.
                  </li>
                  <li>
                    <strong className="text-paper">Aucune référence client.</strong> Pas de logos,
                    pas de témoignages, pas de gains chiffrés tant qu’ils ne sont pas autorisés par
                    les intéressés.
                  </li>
                  <li>
                    <strong className="text-paper">Aucun chiffre de performance commerciale.</strong>{' '}
                    Les projets affichés dans les captures sont des jeux de test de l’éditeur.
                  </li>
                </ul>
                <p className="mt-7 border-t border-white/[0.08] pt-5 text-xs leading-relaxed text-steel-500">
                  C’est un choix. Un logiciel de contrôle de coûts qui exagérerait sur sa propre
                  page n’aurait pas grand-chose à dire sur la rigueur des chiffres de ses clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        titre="Prenez trente minutes. Apportez un projet qui dérive."
        texte="On le monte dans Cheetah avec vos lignes budgétaires et votre dernier arrêté. À la fin de l’échange, vous savez si l’outil vous sert — ou non."
        secondaire={{ label: 'Voir les tarifs', href: '/tarifs/' }}
      />
    </>
  );
}
