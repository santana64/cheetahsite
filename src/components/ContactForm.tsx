'use client';

/**
 * Formulaire de prise de contact.
 *
 * Le site est publié en export statique : il n'y a aucun serveur applicatif
 * pour recevoir une soumission. La demande part donc vers Web3Forms, service
 * tiers d'acheminement de formulaires.
 *
 *   NEXT_PUBLIC_FORM_ACCESS_KEY   clé d'accès du formulaire (seule variable
 *                                 nécessaire)
 *   NEXT_PUBLIC_FORM_ENDPOINT     URL de dépôt, si l'on change de prestataire
 *
 * La clé d'accès est publique par conception : la documentation de Web3Forms
 * précise qu'elle peut figurer dans une page. Le préfixe NEXT_PUBLIC_ est donc
 * correct, rien de confidentiel n'est exposé. Un secret d'API n'aurait rien à
 * faire ici et imposerait un serveur.
 *
 * Contrat respecté ci-dessous, relevé dans la documentation de l'éditeur :
 * POST JSON sur /submit, en-têtes Content-Type et Accept en application/json,
 * champ access_key obligatoire, champs spéciaux subject, from_name et replyto,
 * succès signalé par un code 200 et corps portant un champ message.
 *
 * Le piège à robots `botcheck` du prestataire est marqué déprécié dans sa
 * documentation : on garde le nôtre, filtré côté client et jamais transmis.
 *
 * Tant que la clé n'est pas renseignée, le formulaire bascule sur la
 * composition d'un message dans la messagerie de l'utilisateur. Le comportement
 * effectif est annoncé dans l'interface, dans les deux cas : on ne laisse jamais
 * croire à un envoi qui n'a pas lieu.
 */

import Link from 'next/link';
import { FormEvent, useRef, useState } from 'react';
import { contactAcknowledgement } from '@/lib/contact-response';
import { CONTACT } from '@/content/cheetah';

const ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? '';
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || 'https://api.web3forms.com/submit';
const ENVOI_DIRECT = ACCESS_KEY.length > 0;

type Champs = {
  nom: string;
  organisation: string;
  email: string;
  role: string;
  contexte: string;
};

type Etat = 'saisie' | 'envoi' | 'envoye' | 'echec';

const ROLES = [
  'Direction de projet / PMO',
  'Contrôle de gestion',
  'Maîtrise d’ouvrage / AMO',
  'Bureau d’études / ingénierie',
  'Direction générale',
  'Autre',
];

const VIDE: Champs = { nom: '', organisation: '', email: '', role: '', contexte: '' };

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-paper">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-steel-400">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-xs text-drift">
          {error}
        </p>
      )}
    </div>
  );
}

const champClass =
  'w-full rounded-sm border border-white/[0.12] bg-ink-800 px-3.5 py-3 text-sm text-paper placeholder:text-steel-400 transition-colors focus:border-volt focus:outline-none disabled:opacity-60';

function corpsLisible(v: Champs) {
  return [
    `Nom : ${v.nom}`,
    `Organisation : ${v.organisation}`,
    `E-mail : ${v.email}`,
    v.role ? `Fonction : ${v.role}` : null,
    '',
    'Contexte :',
    v.contexte,
  ]
    .filter((l) => l !== null)
    .join('\n');
}

export function ContactForm() {
  const [v, setV] = useState<Champs>(VIDE);
  const [errors, setErrors] = useState<Partial<Record<keyof Champs, string>>>({});
  const [etat, setEtat] = useState<Etat>('saisie');
  const [motif, setMotif] = useState('');
  const [copie, setCopie] = useState(false);
  const leurre = useRef<HTMLInputElement>(null);
  const statut = useRef<HTMLParagraphElement>(null);

  const set = (k: keyof Champs) => (e: { target: { value: string } }) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  function valider(c: Champs) {
    const err: Partial<Record<keyof Champs, string>> = {};
    if (c.nom.trim().length < 2) err.nom = 'Indiquez votre nom.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim()))
      err.email = 'Adresse e-mail professionnelle invalide.';
    if (c.organisation.trim().length < 2) err.organisation = 'Indiquez votre organisation.';
    if (c.contexte.trim().length < 20)
      err.contexte = 'Donnez au moins une phrase sur votre contexte — cela évite un échange inutile.';
    return err;
  }

  function versMessagerie(c: Champs) {
    const sujet = `Demande de démonstration — ${c.organisation}`;
    const corps = `${corpsLisible(c)}\n\n— Envoyé depuis le site CheetahSoft`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      sujet
    )}&body=${encodeURIComponent(corps)}`;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (etat === 'envoi') return;

    const err = valider(v);
    setErrors(err);
    if (Object.keys(err).length > 0) {
      document.getElementById(`c-${Object.keys(err)[0]}`)?.focus();
      return;
    }

    // Piège à robots : un champ invisible que seul un automate remplit.
    // On simule une réussite plutôt que de signaler la détection.
    if (leurre.current?.value) {
      setEtat('envoye');
      return;
    }

    if (!ENVOI_DIRECT) {
      versMessagerie(v);
      setEtat('envoye');
      window.setTimeout(() => statut.current?.focus(), 80);
      return;
    }

    setEtat('envoi');
    setMotif('');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const reponse = await fetch(ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Demande de démonstration — ${v.organisation}`,
          from_name: v.nom,
          replyto: v.email,
          email: v.email,
          organisation: v.organisation,
          fonction: v.role || 'non précisée',
          contexte: v.contexte,
          message: corpsLisible(v),
        }),
      });

      const body: unknown = await reponse.json().catch(() => null);
      const acknowledgement = contactAcknowledgement(reponse.ok, reponse.status, body);
      if (!acknowledgement.accepted) {
        setMotif(acknowledgement.message);
        setEtat('echec');
      } else {
        setEtat('envoye');
        setV(VIDE);
      }
    } catch {
      setMotif('La requête n’a pas abouti — connexion interrompue ou service injoignable.');
      setEtat('echec');
    } finally {
      window.clearTimeout(timeout);
    }
    window.setTimeout(() => statut.current?.focus(), 80);
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 2500);
    } catch {
      setCopie(false);
    }
  }

  const enCours = etat === 'envoi';

  return (
    <div className="panel corner-ticks p-6 sm:p-9">
      {etat === 'envoye' ? (
        <div role="status" aria-live="polite">
          <p ref={statut} tabIndex={-1} className="eyebrow !text-volt">{ENVOI_DIRECT ? 'Demande transmise' : 'Message à envoyer'}</p>
          <h2 className="display-sm mt-5 text-paper">
            {ENVOI_DIRECT ? 'C’est parti.' : 'Votre messagerie devrait s’être ouverte.'}
          </h2>
          <p className="body-copy mt-4 max-w-prose">
            {ENVOI_DIRECT
              ? `Nous revenons vers vous à l’adresse indiquée. Si vous voulez ajouter une pièce — un extrait de votre structure budgétaire, un arrêté — écrivez directement à ${CONTACT.email}.`
              : `Le message est pré-rempli à destination de ${CONTACT.email}. Il ne partira que lorsque vous l’enverrez vous-même. Si rien ne s’est ouvert, copiez l’adresse ci-dessous.`}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={copier} className="btn btn-ghost">
              {copie ? 'Adresse copiée' : 'Copier l’adresse'}
            </button>
            <button type="button" onClick={() => setEtat('saisie')} className="btn btn-ghost">
              Envoyer une autre demande
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="c-nom" label="Nom" error={errors.nom}>
              <input
                id="c-nom"
                name="nom"
                type="text"
                maxLength={120}
                autoComplete="name"
                value={v.nom}
                onChange={set('nom')}
                disabled={enCours}
                aria-invalid={!!errors.nom}
                aria-describedby={errors.nom ? 'c-nom-err' : undefined}
                className={champClass}
              />
            </Field>

            <Field id="c-organisation" label="Organisation" error={errors.organisation}>
              <input
                id="c-organisation"
                name="organisation"
                type="text"
                maxLength={160}
                autoComplete="organization"
                value={v.organisation}
                onChange={set('organisation')}
                disabled={enCours}
                aria-invalid={!!errors.organisation}
                aria-describedby={errors.organisation ? 'c-organisation-err' : undefined}
                className={champClass}
              />
            </Field>

            <Field id="c-email" label="E-mail professionnel" error={errors.email}>
              <input
                id="c-email"
                name="email"
                type="email"
                maxLength={254}
                autoComplete="email"
                inputMode="email"
                value={v.email}
                onChange={set('email')}
                disabled={enCours}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'c-email-err' : undefined}
                className={champClass}
              />
            </Field>

            <Field id="c-role" label="Fonction" hint="Facultatif">
              <select
                id="c-role"
                aria-describedby="c-role-hint"
                name="role"
                value={v.role}
                onChange={set('role')}
                disabled={enCours}
                className={champClass}
              >
                <option value="">—</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            id="c-contexte"
            label="Votre contexte"
            error={errors.contexte}
            hint="Combien de projets en parallèle, comment le budget est suivi aujourd’hui, ce qui vous pose problème."
          >
            <textarea
              id="c-contexte"
              name="contexte"
              rows={6}
              maxLength={5000}
              value={v.contexte}
              onChange={set('contexte')}
              disabled={enCours}
              aria-invalid={!!errors.contexte}
              aria-describedby={
                errors.contexte ? 'c-contexte-err c-contexte-hint' : 'c-contexte-hint'
              }
              className={`${champClass} resize-y`}
            />
          </Field>

          {/* Piège à robots — hors du flux, hors du parcours clavier, non annoncé */}
          <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
            <label htmlFor="c-site">Ne pas remplir</label>
            <input id="c-site" name="site" type="text" ref={leurre} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="rounded-sm border border-white/[0.09] bg-ink-800/60 p-4">
            <p className="text-xs leading-relaxed text-steel-400">
              <strong className="text-steel-200">Ce qui se passe à l’envoi.</strong>{' '}
              {ENVOI_DIRECT ? (
                <>
                  Votre demande est transmise par un prestataire d’acheminement de formulaires, qui
                  nous la relaie par e-mail. Les champs saisis sont transmis avec les informations techniques nécessaires à
                  l’acheminement et à la protection antispam. Ce site ne dépose aucun cookie de suivi. Le
                  détail figure dans la{' '}
                  <Link
                    href="/confidentialite/"
                    className="text-volt underline-offset-4 hover:underline"
                  >
                    page confidentialité
                  </Link>
                  .
                </>
              ) : (
                <>
                  Le bouton compose le message dans
                  votre logiciel de messagerie, et rien n’est transmis tant que vous ne l’envoyez
                  pas vous-même.
                </>
              )}
            </p>
          </div>

          {etat === 'echec' && (
            <div
              role="alert"
              className="rounded-sm border-l-2 border-drift bg-drift/[0.07] p-4 text-xs leading-relaxed text-steel-200"
            >
              <strong className="text-drift">L’envoi a échoué.</strong>{' '}
              {motif && <span className="text-steel-300">{motif} </span>}Votre saisie est conservée
              ci-dessus. Réessayez, ou envoyez-la directement par e-mail — le bouton ci-dessous
              recompose le même message dans votre messagerie.
              <span className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => versMessagerie(v)}
                  className="btn btn-ghost !min-h-0 !px-3 !py-1.5 !text-xs"
                >
                  Passer par ma messagerie
                </button>
                <button
                  type="button"
                  onClick={copier}
                  className="btn btn-ghost !min-h-0 !px-3 !py-1.5 !text-xs"
                >
                  {copie ? 'Adresse copiée' : CONTACT.email}
                </button>
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={enCours} className="btn btn-primary">
              {enCours ? 'Envoi en cours…' : ENVOI_DIRECT ? 'Envoyer la demande' : 'Préparer le message'}
            </button>
            <button type="button" onClick={copier} disabled={enCours} className="btn btn-ghost">
              {copie ? 'Adresse copiée' : 'Copier l’adresse'}
            </button>
          </div>

          <p ref={statut} tabIndex={-1} role="status" aria-live="polite" className="sr-only">
            {enCours ? 'Envoi en cours' : ''}
          </p>
        </form>
      )}
    </div>
  );
}

export default ContactForm;
