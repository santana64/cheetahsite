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
  '/cgv/',
  '/confidentialite/',
  '/404.html',
];

/** Titre de l'accueil, releve au premier passage (voir le garde-fou). */
const TITRE_ACCUEIL = { valeur: '' };

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
  await page.waitForTimeout(2200);

  // Garde-fou : servi en mode page unique (`serve -s`), un serveur statique
  // renvoie l'accueil pour TOUTES les routes. Toute la suite passerait alors
  // au vert en validant quatorze fois la même page. On refuse de continuer
  // plutôt que de rendre un rapport qui ne veut rien dire.
  const titre = await page.title();
  if (route === '/') {
    TITRE_ACCUEIL.valeur = titre;
  } else if (TITRE_ACCUEIL.valeur && titre === TITRE_ACCUEIL.valeur) {
    console.error('');
    console.error(`ARRET : ${route} renvoie le titre de l’accueil (« ${titre} »).`);
    console.error('Le serveur reecrit les routes vers index.html, donc toute la');
    console.error('suite validerait la meme page. Servir l’export sans le drapeau');
    console.error('page unique : « npx serve out -l 3501 », et non « serve -s ».');
    process.exit(2);
  }

  return errs;
};

const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
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
            const enLigne = el.tagName === 'A' && el.closest('p, dd, li, figcaption, summary');
            if (enLigne) return false;
            return r.height < 24 || r.width < 24;
          })
          .map((el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 34))
          .slice(0, 6);
      });
      if (petites.length) note(`375 ${route} : cibles tactiles < 24px — ${petites.join(' | ')}`);
    }
    // Contenu invisible — le défaut que cette suite avait laissé passer :
    // une page peut compiler, ne produire aucune erreur et n'afficher aucune
    // donnée si un effet d'entrée reste bloqué. On vérifie donc que tout bloc
    // porteur de texte est réellement peint.
    const fantomes = await page.evaluate(() => {
      const sortie = [];
      for (const el of document.querySelectorAll('tr, li, p, h1, h2, h3, h4, dd, figcaption')) {
        const texte = (el.textContent || '').trim();
        if (texte.length < 12) continue;
        // Les temps de la séquence narrative se relaient au défilement :
        // leur opacité est un contenu piloté, pas un contenu masqué.
        if (el.closest('[data-sequence]')) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // Seul ce qui est dans la fenêtre doit être peint : un bloc encore
        // sous le pli attend légitimement sa révélation au défilement.
        if (r.top > window.innerHeight * 0.8 || r.bottom < 0) continue;
        // Opacité effective, en remontant la chaîne des ancêtres.
        let o = 1;
        let n = el;
        while (n && n !== document.documentElement) {
          o *= parseFloat(getComputedStyle(n).opacity);
          n = n.parentElement;
        }
        const s = getComputedStyle(el);
        const clip = s.clipPath && s.clipPath !== 'none' ? s.clipPath : '';
        const masqueTotal = /inset\((?:100%|\s*0[a-z%]*\s+0[a-z%]*\s+100%)/.test(clip);
        if (o < 0.08 || masqueTotal) {
          sortie.push(`${el.tagName.toLowerCase()} opacité ${o.toFixed(2)} — « ${texte.slice(0, 44)} »`);
        }
      }
      return sortie.slice(0, 5);
    });
    fantomes.forEach((f) => note(`contenu invisible ${v.nom} ${route} : ${f}`));

    // Contraste du texte — WCAG 2.2, critère 1.4.3 (AA).
    // Le fond effectif est résolu en remontant jusqu'au premier ancêtre opaque.
    // Les textes posés sur un dégradé ou sur la scène 3D sont écartés : leur
    // fond réel n'est pas déterminable par cette méthode.
    if (v.w === 1440) {
      const faibles = await page.evaluate(() => {
        const lum = (c) => {
          const [r, g, b] = c.map((v) => {
            const s = v / 255;
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const parse = (s) => {
          const m = s.match(/rgba?\(([^)]+)\)/);
          if (!m) return null;
          const p = m[1].split(',').map((x) => parseFloat(x));
          return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
        };
        const fondOpaque = (el) => {
          let n = el;
          while (n && n !== document.documentElement) {
            const s = getComputedStyle(n);
            if (s.backgroundImage && s.backgroundImage !== 'none') return null;
            const bg = parse(s.backgroundColor);
            if (bg && bg.a >= 0.99) return bg.rgb;
            if (bg && bg.a > 0) return null;
            n = n.parentElement;
          }
          return parse(getComputedStyle(document.body).backgroundColor)?.rgb ?? null;
        };

        const sortie = [];
        const vus = new Set();
        for (const el of document.querySelectorAll('p, span, a, li, dt, dd, h1, h2, h3, h4, td, th, figcaption, label, button, summary')) {
          const texte = [...el.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent.trim())
            .join(' ')
            .trim();
          if (texte.length < 3) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const s = getComputedStyle(el);
          if (s.visibility === 'hidden' || parseFloat(s.opacity) < 0.95) continue;
          const fg = parse(s.color);
          const bg = fondOpaque(el);
          if (!fg || !bg) continue;
          // Texte semi-transparent : on le compose sur le fond résolu plutôt
          // que de l'écarter — c'est le cas de toutes les sections claires.
          const avant = fg.a >= 0.99 ? fg.rgb : fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));
          const l1 = lum(avant);
          const l2 = lum(bg);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          const px = parseFloat(s.fontSize);
          const gras = parseInt(s.fontWeight, 10) >= 700;
          const grand = px >= 24 || (gras && px >= 18.66);
          const seuil = grand ? 3 : 4.5;
          if (ratio + 0.005 < seuil) {
            const cle = s.color + '|' + ratio.toFixed(2);
            if (vus.has(cle)) continue;
            vus.add(cle);
            sortie.push(
              `${ratio.toFixed(2)}:1 (exigé ${seuil}) ${s.color} ${px}px — « ${texte.slice(0, 38)} »`
            );
          }
        }
        return sortie.slice(0, 8);
      });
      faibles.forEach((f) => note(`contraste ${route} : ${f}`));
    }

    console.log(`  ok ${route}`);
  }
  await ctx.close();
}

/* ── 2. Instrument et lecture interactive ───────────────────────── */
{
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await nav(page, '/');
  for (const [i, name] of ['COST', 'TIME', 'DOC'].entries()) {
    const control = page.getByRole('button', { name: new RegExp(name) }).first();
    await control.click();
    if (await control.getAttribute('aria-pressed') !== 'true') note(`instrument : ${name} non sélectionné`);
    const expected = ['920 k€', '+12 j', 'V03'][i];
    if (!(await page.locator('.instrument-value').innerText()).includes(expected)) note(`instrument : métrique ${name} incorrecte`);
    await page.screenshot({ path: path.join(SORTIE, `instrument-${name.toLowerCase()}.png`) });
  }
  const slider = page.locator('#reading-progress');
  await slider.scrollIntoViewIfNeeded();
  await slider.click();
  await slider.press('Home');
  for (let i = 0; i < 5; i++) await slider.press('ArrowRight');
  try { await page.waitForFunction(() => document.querySelector('.reading-bars')?.textContent.includes('1 200'), { timeout: 3000 }); } catch { note('lecture : coût prévisionnel à 35 % incorrect'); }
  const bars = await page.locator('.reading-track > span').evaluateAll(nodes => nodes.map(n => n.getBoundingClientRect().width));
  if (!(bars[2] > bars[0] && bars[0] > bars[1])) note('lecture : les montants ne partagent pas une échelle cohérente');
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
  const svg = await page.evaluate(() => document.querySelectorAll('svg.project-cutaway[role="img"]').length);
  if (svg === 0) note('sans WebGL : la coupe technique SVG n’est pas rendue');
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

process.exitCode = probs.length ? 1 : 0;
