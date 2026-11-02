/**
 * Vérification fonctionnelle du formulaire de contact en mode envoi direct.
 *
 *   node scripts/verify-form.mjs <origine-du-site>
 *
 * Suppose que le site a été construit avec
 *   NEXT_PUBLIC_FORM_ACCESS_KEY=cle-de-test
 *   NEXT_PUBLIC_FORM_ENDPOINT=http://localhost:3400/submit
 *
 * Le script lève un faux service de dépôt : la première soumission réussit, la
 * seconde échoue. On contrôle donc les deux chemins — la confirmation, puis la
 * conservation de la saisie et le repli proposé au visiteur.
 */

import http from 'node:http';
import { chromium } from 'playwright';

const ORIGINE = process.argv[2] ?? 'http://localhost:3500';
const recues = [];
let appels = 0;
const MOTIF_REFUS = 'Access key is invalid.';

const service = http.createServer((req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    res.end();
    return;
  }
  let corps = '';
  req.on('data', (c) => (corps += c));
  req.on('end', () => {
    appels += 1;
    try {
      recues.push(JSON.parse(corps));
    } catch {
      recues.push({ illisible: corps.slice(0, 120) });
    }
    // Première soumission acceptée, seconde refusée avec un motif — le
    // prestataire renvoie un champ `message` que l'interface doit relayer.
    const code = appels === 1 ? 200 : 400;
    res.writeHead(code, { ...cors, 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify(
        code === 200
          ? { success: true, message: 'Email sent successfully' }
          : { success: false, message: MOTIF_REFUS }
      )
    );
  });
});
await new Promise((r) => service.listen(3400, r));

const probs = [];
const note = (s) => {
  probs.push(s);
  console.log('  ! ' + s);
};

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const erreurs = [];
page.on('pageerror', (e) => erreurs.push(e.message));

async function remplir() {
  await page.fill('#c-nom', 'Camille Rousseau');
  await page.fill('#c-organisation', 'Atelier Structure');
  await page.fill('#c-email', 'c.rousseau@exemple.fr');
  await page.selectOption('#c-role', 'Contrôle de gestion');
  await page.fill(
    '#c-contexte',
    'Quatre affaires en parallèle, budget suivi sous tableur, consolidation mensuelle manuelle et toujours en retard.'
  );
}

/* ── 1. Validation d'une soumission vide ─────────────────────────────── */
await page.goto(ORIGINE + '/contact/', { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.click('button[type="submit"]');
await page.waitForTimeout(400);
const alertes = await page.locator('[role="alert"]').count();
if (alertes < 4) note(`validation : seulement ${alertes} champs signalés sur 4 attendus`);
const focus = await page.evaluate(() => document.activeElement?.id);
if (focus !== 'c-nom') note(`validation : le focus devrait aller au premier champ fautif, il est sur « ${focus} »`);
console.log(`1. soumission vide — ${alertes} erreurs signalées, focus sur ${focus}`);

/* ── 2. Envoi accepté ────────────────────────────────────────────────── */
await remplir();
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
if (appels !== 1) note(`envoi : ${appels} requête(s) reçue(s) par le service, 1 attendue`);
const confirme = await page.locator('text=Demande transmise').count();
if (confirme === 0) note('envoi : aucune confirmation affichée après une réponse 200');
console.log(`2. envoi accepté — requêtes reçues : ${appels}, confirmation affichée : ${confirme > 0}`);

const charge = recues[0] ?? {};
// Contrat Web3Forms : access_key obligatoire, subject / from_name / replyto
// étant les champs spéciaux qui pilotent l'e-mail de notification.
const attendus = ['access_key', 'subject', 'from_name', 'replyto', 'email', 'organisation', 'contexte'];
const manquants = attendus.filter((k) => !charge[k]);
if (manquants.length) note(`charge utile : champs manquants — ${manquants.join(', ')}`);
if (charge.site !== undefined) note('charge utile : le champ-piège est transmis, il ne devrait pas l’être');
console.log('   champs reçus :', Object.keys(charge).join(', '));

/* ── 3. Envoi refusé — la saisie doit survivre ───────────────────────── */
await page.click('text=Envoyer une autre demande');
await page.waitForTimeout(400);
await remplir();
await page.click('button[type="submit"]');
await page.waitForTimeout(1800);
const echec = await page.locator('text=L’envoi a échoué').count();
if (echec === 0) note('échec : aucun message d’erreur après une réponse 400');
const motifAffiche = await page.locator(`text=${MOTIF_REFUS}`).count();
if (motifAffiche === 0)
  note('échec : le motif renvoyé par le prestataire n’est pas relayé au visiteur');
const conserve = await page.inputValue('#c-contexte');
if (conserve.length < 20) note('échec : la saisie n’a pas été conservée');
const repli = await page.locator('text=Passer par ma messagerie').count();
if (repli === 0) note('échec : aucun chemin de repli proposé');
console.log(
  `3. envoi refusé — erreur affichée : ${echec > 0}, motif du prestataire relayé : ${motifAffiche > 0}, saisie conservée : ${conserve.length >= 20}, repli proposé : ${repli > 0}`
);

/* ── 4. Champ-piège hors du parcours clavier ─────────────────────────── */
const piege = await page.evaluate(() => {
  const el = document.getElementById('c-site');
  if (!el) return null;
  const conteneur = el.closest('[aria-hidden="true"]');
  return { tabIndex: el.tabIndex, masque: !!conteneur };
});
if (!piege) note('piège : le champ est absent');
else if (piege.tabIndex !== -1 || !piege.masque)
  note(`piège : tabIndex ${piege.tabIndex}, masqué aux technologies d’assistance : ${piege.masque}`);
else console.log('4. champ-piège — hors tabulation et masqué aux lecteurs d’écran');

erreurs.forEach((e) => note(`erreur JavaScript : ${e.slice(0, 120)}`));

await navigateur.close();
service.close();

console.log('\n════════════════════════════════════════');
console.log(probs.length === 0 ? 'AUCUN PROBLEME DETECTE' : `${probs.length} PROBLEME(S) :`);
probs.forEach((p) => console.log('  - ' + p));
process.exit(probs.length === 0 ? 0 : 1);
