/**
 * Mesure de laboratoire sur l'export statique servi en local.
 *
 *   node scripts/perf.mjs [origine]
 *
 * Ce ne sont PAS des données terrain : pas de latence réseau réelle, pas de
 * diversité d'appareils, rendu WebGL logiciel (SwiftShader). Les valeurs
 * servent à comparer des versions entre elles, pas à certifier un score.
 */

import { chromium } from 'playwright';

const ORIGINE = process.argv[2] ?? 'http://localhost:3200';
const ROUTES = ['/', '/cheetah-cost/', '/methodologie/', '/tarifs/'];

const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});

console.log('Mesure de laboratoire — localhost, Chromium headless, WebGL logiciel.\n');

for (const route of ROUTES) {
  const ctx = await navigateur.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const transferts = { total: 0, js: 0, css: 0, images: 0, polices: 0 };
  page.on('response', async (r) => {
    try {
      const h = r.headers();
      const taille = Number(h['content-length'] ?? 0);
      if (!taille) return;
      const u = r.url();
      transferts.total += taille;
      if (/\.js(\?|$)/.test(u)) transferts.js += taille;
      else if (/\.css(\?|$)/.test(u)) transferts.css += taille;
      else if (/\.(webp|png|jpe?g|svg|avif)(\?|$)/.test(u)) transferts.images += taille;
      else if (/\.(woff2?|ttf)(\?|$)/.test(u)) transferts.polices += taille;
    } catch {
      /* ignoré */
    }
  });

  await page.addInitScript(() => {
    window.__lab = { lcp: null, cls: 0 };
    new PerformanceObserver(list => { for (const e of list.getEntries()) window.__lab.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__lab.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(ORIGINE + route, { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const m = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
    const { lcp, cls } = window.__lab;
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      fcp,
      lcp,
      cls,
      dcl: nav ? nav.domContentLoadedEventEnd : null,
      charge: nav ? nav.loadEventEnd : null,
    };
  });

  const ko = (n) => (n / 1024).toFixed(0) + ' ko';
  console.log(`${route}`);
  console.log(
    `  FCP ${m.fcp?.toFixed(0) ?? '?'} ms · LCP ${m.lcp?.toFixed(0) ?? '?'} ms · CLS ${m.cls.toFixed(4)}`
  );
  console.log(
    `  transfert ${ko(transferts.total)} (js ${ko(transferts.js)} · css ${ko(transferts.css)} · images ${ko(transferts.images)} · polices ${ko(transferts.polices)})`
  );

  if (route === '/') {
    const fps = await page.evaluate(
      () =>
        new Promise((res) => {
          let n = 0;
          const t0 = performance.now();
          const tick = () => {
            n++;
            if (performance.now() - t0 < 3000) requestAnimationFrame(tick);
            else res(Math.round((n / (performance.now() - t0)) * 1000));
          };
          requestAnimationFrame(tick);
        })
    );
    console.log(`  cadence requestAnimationFrame, accueil SVG : ~${fps} images/s`);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.8));
    await page.waitForTimeout(1500);
    const fpsBas = await page.evaluate(
      () =>
        new Promise((res) => {
          let n = 0;
          const t0 = performance.now();
          const tick = () => {
            n++;
            if (performance.now() - t0 < 2000) requestAnimationFrame(tick);
            else res(Math.round((n / (performance.now() - t0)) * 1000));
          };
          requestAnimationFrame(tick);
        })
    );
    console.log(`  cadence requestAnimationFrame après défilement : ~${fpsBas} images/s`);
  }

  console.log('');
  await ctx.close();
}

await navigateur.close();
