/**
 * Vérification visuelle et fonctionnelle du site publié.
 *
 *   node scripts/verify.mjs [origine]
 *
 * Parcourt chaque route significative à cinq largeurs, capture les écrans,
 * relève les erreurs de console, les débordements horizontaux, les cibles
 * tactiles trop petites, et contrôle les deux modes dégradés : mouvement
 * réduit et absence de WebGL.
 *
 * Les captures sont écrites dans ./verif/.
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ORIGINE = process.argv[2] ?? 'http://localhost:3200';
const SORTIE = 'verif';

const ROUTES = [
  '/',
  '/solutions/',
  '/cheetah-cost/',
  '/cheetah-time/',
  '/cheetah-doc/',
  '/methodologie/',
  '/plateforme/',
  '/tarifs/',
  '/roadmap/',
  '/contact/',
  '/mentions-legales/',
  '/confidentialite/',
  '/404.html',
];

const LARGEURS = [
  { nom: '375', w: 375, h: 812 },
  { nom: '768', w: 768, h: 1024 },
  { nom: '1440', w: 1440, h: 900 },
  { nom: '1920', w: 1920, h: 1080 },
];

const probs = [];
const note = (s) => {
  probs.push(s);
  console.log('  ! ' + s);
};

fs.rmSync(SORTIE, { recursive: true, force: true });
fs.mkdirSync(SORTIE, { recursive: true });

const nav = async (page, route) => {
  const errs = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  await page.goto(ORIGINE + route, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1600);
  return errs;
};

const navigateur = await chromium.launch({
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});

/* ── 1. Parcours multi-largeurs ─────────────────────────────────────── */
for (const v of LARGEURS) {
  const ctx = await navigateur.newContext({
    viewport: { width: v.w, height: v.h },
    deviceScaleFactor: 1,
    isMobile: v.w < 768,
    hasTouch: v.w < 768,
  });
  const page = await ctx.newPage();
  console.log(`\n=== ${v.nom}px ===`);

  for (const route of ROUTES) {
    const errs = await nav(page, route);
    const nom = route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'accueil';
    await page.screenshot({ path: path.join(SORTIE, `${v.nom}-${nom}.png`), fullPage: false });

    const debord = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    );
    if (debord > 1) note(`${v.nom} ${route} : débordement horizontal de ${debord}px`);
    errs.forEach((e) => note(`${v.nom} ${route} : console — ${e.slice(0, 140)}`));

    if (v.w < 768) {
      // WCAG 2.2 — 2.5.8 Cible (minimum), niveau AA : 24 × 24 px CSS.
      // Les liens en ligne dans un bloc de texte bénéficient de l'exception
      // « inline » prévue par le critère et sont donc exclus.
      const petites = await page.evaluate(() => {
        const sel = 'a, button, input, select, textarea, [role="button"]';
        return [...document.querySelectorAll(sel)]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            if (r.width === 0 || r.height === 0 || s.visibility === 'hidden') return false;
            const enLigne = el.tagName === 'A' && el.closest('p, dd, li > p, figcaption');
            if (enLigne) return false;
            return r.height < 24 || r.width < 24;
          })
          .map((el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 34))
          .slice(0, 6);
      });
      if (petites.length) note(`375 ${route} : cibles tactiles < 24px — ${petites.join(' | ')}`);
    }
    console.log(`  ok ${route}`);
  }
  await ctx.close();
}

/* ── 2. Séquence narrative de l'accueil ─────────────────────────────── */
{
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await nav(page, '/');
  console.log('\n=== séquence 3D ===');
  for (const [i, p] of [0.06, 0.4, 0.78].entries()) {
    await page.evaluate((f) => window.scrollTo(0, document.body.scrollHeight * 0.33 * f * 3), p);
    await page.waitForTimeout(2200);
    await page.screenshot({ path: path.join(SORTIE, `sequence-${i + 1}.png`) });
    console.log(`  ok temps ${i + 1}`);
  }
  await ctx.close();
}

/* ── 3. Mouvement réduit ────────────────────────────────────────────── */
{
  const ctx = await navigateur.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  const errs = await nav(page, '/');
  errs.forEach((e) => note(`mouvement réduit : console — ${e.slice(0, 140)}`));
  await page.screenshot({ path: path.join(SORTIE, 'reduced-motion-haut.png') });

  const cache = await page.evaluate(
    () => document.querySelectorAll('.reveal:not([data-revealed])').length
  );
  if (cache > 0) note(`mouvement réduit : ${cache} éléments restent masqués`);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(SORTIE, 'reduced-motion-milieu.png') });
  console.log('\n=== mouvement réduit : ok ===');
  await ctx.close();
}

/* ── 4. Absence de WebGL ────────────────────────────────────────────── */
{
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    const origine = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...reste) {
      if (typeof type === 'string' && type.includes('webgl')) return null;
      return origine.call(this, type, ...reste);
    };
  });
  const page = await ctx.newPage();
  const errs = await nav(page, '/');
  errs.forEach((e) => note(`sans WebGL : console — ${e.slice(0, 140)}`));
  await page.screenshot({ path: path.join(SORTIE, 'sans-webgl.png') });

  const canvas = await page.evaluate(() => document.querySelectorAll('canvas').length);
  const svg = await page.evaluate(() => document.querySelectorAll('svg[role="presentation"]').length);
  if (svg === 0) note('sans WebGL : le repli SVG n’est pas rendu');
  console.log(`\n=== sans WebGL : canvas=${canvas} repliSVG=${svg} ===`);
  await ctx.close();
}

/* ── 5. Navigation clavier ──────────────────────────────────────────── */
{
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await nav(page, '/');
  const parcours = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    parcours.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        if (!a) return 'aucun';
        const r = a.getBoundingClientRect();
        const s = getComputedStyle(a);
        return `${a.tagName}:${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 26)} [outline:${s.outlineStyle !== 'none' ? 'oui' : 'non'} visible:${r.width > 0 && r.height > 0 ? 'oui' : 'non'}]`;
      })
    );
  }
  console.log('\n=== parcours clavier ===');
  parcours.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));
  if (parcours.filter((p) => p.includes('outline:non')).length > 2)
    note('clavier : plusieurs éléments sans indicateur de focus visible');
  await page.screenshot({ path: path.join(SORTIE, 'focus-clavier.png') });
  await ctx.close();
}

/* ── 6. Formulaire de contact ───────────────────────────────────────── */
{
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await nav(page, '/contact/');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);
  const alertes = await page.locator('[role="alert"]').count();
  if (alertes < 3) note(`contact : la validation ne signale que ${alertes} champs en erreur`);
  await page.screenshot({ path: path.join(SORTIE, 'contact-validation.png') });
  console.log(`\n=== formulaire : ${alertes} erreurs signalées sur soumission vide ===`);
  await ctx.close();
}

await navigateur.close();

console.log('\n════════════════════════════════════════');
console.log(probs.length === 0 ? 'AUCUN PROBLEME DETECTE' : `${probs.length} PROBLEME(S) :`);
probs.forEach((p) => console.log('  - ' + p));
console.log(`Captures : ./${SORTIE}/`);
