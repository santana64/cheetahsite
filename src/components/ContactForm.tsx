'use client';

/**
 * Formulaire de prise de contact.
 *
 * Le site est publié en export statique : il n'y a pas de serveur pour
 * recevoir une soumission. Plutôt qu'un formulaire décoratif qui ne mène
 * nulle part, celui-ci compose un message structuré et l'ouvre dans le client
 * de messagerie de l'utilisateur. Le comportement est annoncé explicitement
 * avant l'envoi, et l'adresse reste copiable pour ceux qui préfèrent écrire
 * eux-mêmes.
 */

import { FormEvent, useRef, useState } from 'react';
import { CONTACT } from '@/content/cheetah';

type Champs = {
  nom: string;
  organisation: string;
  email: string;
  role: string;
  contexte: string;
};

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
        <p id={`${id}-hint`} className="mt-1 text-xs text-steel-500">
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
  'w-full rounded-sm border border-white/[0.12] bg-ink-800 px-3.5 py-3 text-sm text-paper placeholder:text-steel-500 transition-colors focus:border-volt focus:outline-none';

export function ContactForm() {
  const [v, setV] = useState<Champs>(VIDE);
  const [errors, setErrors] = useState<Partial<Record<keyof Champs, string>>>({});
  const [envoye, setEnvoye] = useState(false);
  const [copie, setCopie] = useState(false);
  const resume = useRef<HTMLParagraphElement>(null);

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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = valider(v);
    setErrors(err);
    if (Object.keys(err).length > 0) {
      const first = document.getElementById(`c-${Object.keys(err)[0]}`);
      first?.focus();
      return;
    }

    const corps = [
      `Nom : ${v.nom}`,
      `Organisation : ${v.organisation}`,
      `E-mail : ${v.email}`,
      v.role ? `Fonction : ${v.role}` : null,
      '',
      'Contexte :',
      v.contexte,
      '',
      '— Envoyé depuis le site CheetahSoft',
    ]
      .filter((l) => l !== null)
      .join('\n');

    const sujet = `Demande de démonstration — ${v.organisation}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      sujet
    )}&body=${encodeURIComponent(corps)}`;
    setEnvoye(true);
    window.setTimeout(() => resume.current?.focus(), 80);
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

  return (
    <div className="panel corner-ticks p-6 sm:p-9">
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="c-nom" label="Nom" error={errors.nom}>
            <input
              id="c-nom"
              name="nom"
              type="text"
              autoComplete="name"
              value={v.nom}
              onChange={set('nom')}
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
              autoComplete="organization"
              value={v.organisation}
              onChange={set('organisation')}
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
              autoComplete="email"
              inputMode="email"
              value={v.email}
              onChange={set('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'c-email-err' : undefined}
              className={champClass}
            />
          </Field>

          <Field id="c-role" label="Fonction" hint="Facultatif">
            <select id="c-role" name="role" value={v.role} onChange={set('role')} className={champClass}>
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
            value={v.contexte}
            onChange={set('contexte')}
            aria-invalid={!!errors.contexte}
            aria-describedby={
              errors.contexte ? 'c-contexte-err c-contexte-hint' : 'c-contexte-hint'
            }
            className={`${champClass} resize-y`}
          />
        </Field>

        <div className="rounded-sm border border-white/[0.09] bg-ink-800/60 p-4">
          <p className="text-xs leading-relaxed text-steel-400">
            <strong className="text-steel-200">Comment fonctionne l’envoi.</strong> Ce site est
            publié en pages statiques et ne conserve aucune donnée. Le bouton ci-dessous compose le
            message dans votre logiciel de messagerie ; rien n’est transmis tant que vous ne
            l’envoyez pas vous-même.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primary">
            Préparer le message
          </button>
          <button type="button" onClick={copier} className="btn btn-ghost">
            {copie ? 'Adresse copiée' : 'Copier l’adresse'}
          </button>
        </div>

        <p
          ref={resume}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={`text-sm ${envoye ? 'text-volt' : 'sr-only'}`}
        >
          {envoye
            ? `Votre logiciel de messagerie devrait s’être ouvert avec le message pré-rempli à destination de ${CONTACT.email}. S’il ne s’ouvre pas, copiez l’adresse et écrivez-nous directement.`
            : ''}
        </p>
      </form>
    </div>
  );
}

export default ContactForm;
