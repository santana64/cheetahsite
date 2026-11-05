import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const origin = process.argv[2] || "http://127.0.0.1:3200";
const output = process.env.V2_OUTPUT || "/tmp/cheetah-v2-qa";
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
});
const findings = [];
try {
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
    const page = await browser.newPage({
      viewport: { width, height: width < 600 ? 844 : 900 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin + "/");
    await page.waitForTimeout(350);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(
      await page.locator('img[src*="screenshot-cost"]').count(),
      0,
      "raw screenshot on homepage",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `home overflow ${width}`,
    );
    if ([390, 768, 1440].includes(width)) {
      for (const mode of ["cost", "time", "doc"]) {
        await page
          .getByRole("button", { name: new RegExp(mode, "i") })
          .first()
          .click();
        await page.locator(`[data-field-geometry="${mode}"]`).waitFor();
        assert.equal(
          await page.locator(`[data-field-geometry="${mode}"]`).count(),
          1,
        );
        await page.screenshot({ path: `${output}/hero-${width}-${mode}.png` });
      }
      const slider = page.locator("#reading-progress");
      await slider.scrollIntoViewIfNeeded();
      await slider.click();
      await slider.press("Home");
      for (let i = 0; i < 5; i++) await slider.press("ArrowRight");
      await page.waitForFunction(() =>
        document.querySelector(".reading-bars").textContent.includes("1 200"),
      );
      await page.getByText("Comparer les montants", { exact: false }).click();
      const bars = await page
        .locator(".reading-track > span")
        .evaluateAll((nodes) =>
          nodes.map((n) => n.getBoundingClientRect().width),
        );
      assert(bars[2] > bars[0] && bars[0] > bars[1]);
      for (const label of [
        "Budget à date",
        "Avancement",
        "Coût prévisionnel",
        "Écart",
      ]) {
        const nav = page.locator(
          '[aria-label="Choisir une lecture du tableau Cost"]',
        );
        await nav.getByRole("button", { name: new RegExp(label) }).click();
        assert.equal(
          await nav
            .getByRole("button", { name: new RegExp(label) })
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      const result = page.getByRole("region", { name: "Résultat de la simulation", exact: true });
      await page.getByRole("button", { name: "Au budget", exact: true }).click();
      await page.waitForFunction(() => document.querySelector('[aria-label="Résultat de la simulation"]').textContent.includes("860"));
      await page.getByRole("button", { name: "Saisie métier", exact: true }).click();
      const remaining = page.getByLabel("Reste à faire estimé", { exact: true });
      await remaining.scrollIntoViewIfNeeded(); await remaining.click(); await remaining.press("Home");
      await page.waitForFunction(() => document.querySelector('[aria-label="Résultat de la simulation"]').textContent.includes("420"));
      await page.getByRole("button", { name: "Corrigé de la performance", exact: true }).click();
      const physical = page.getByLabel("Avancement physique", { exact: true });
      await physical.scrollIntoViewIfNeeded(); await physical.click(); await physical.press("Home");
      await page.waitForFunction(() => document.querySelector('[aria-label="Résultat de la simulation"]').textContent.includes("À estimer"));
      assert(!/NaN|Infinity/.test(await result.innerText()), "undefined projection must be explicit");
      await page.screenshot({
        path: `${output}/home-${width}-full.png`,
        fullPage: true,
      });
    }
    assert.deepEqual(errors, [], `home pageerrors ${width}`);
    findings.push({ route: "/", width, errors, overflow: false });
    await page.close();
  }
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920])
    for (const route of [
      "cheetah-cost",
      "cheetah-time",
      "cheetah-doc",
      "tarifs",
      "contact",
      "solutions",
      "plateforme",
      "methodologie",
      "roadmap",
    ]) {
      const page = await browser.newPage({
        viewport: { width, height: width < 600 ? 844 : 900 },
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const response = await page.goto(`${origin}/${route}/`);
      assert.equal(response.status(), 200);
      await page.waitForTimeout(250);
      if (route === "cheetah-time") {
        const slider = page.locator('input[type="range"]').first();
        await slider.scrollIntoViewIfNeeded();
        await slider.click();
        await slider.press("Home");
        for (let i = 0; i < 5; i++) await slider.press("ArrowRight");
        await page.waitForFunction(() =>
          document.body.innerText.includes("J+16"),
        );
        const inspect = page.getByRole("group", {
          name: "Inspecter une tâche",
        });
        await inspect.getByRole("button").first().click();
        assert.equal(
          await inspect
            .getByRole("button")
            .first()
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      if (route === "cheetah-doc") {
        await page.getByRole("button", { name: /V1/ }).click();
        assert.equal(
          await page
            .getByRole("button", { name: /V1/ })
            .getAttribute("aria-pressed"),
          "true",
        );
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${route} overflow ${width}`,
      );
      assert.deepEqual(errors, [], `${route} errors ${width}`);
      if ([390, 768, 1440].includes(width)) await page.screenshot({
        path: `${output}/${route}-${width}.png`,
        fullPage: true,
      });
      findings.push({ route, width, errors, overflow: false });
      await page.close();
    }
  for (const options of [
    { reducedMotion: "reduce" },
    { javaScriptEnabled: false },
  ]) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      ...options,
    });
    await page.goto(origin + "/");
    assert(await page.locator("h1").isVisible());
    assert(await page.locator("svg.project-cutaway").isVisible());
    if (options.reducedMotion) {
      assert.equal(
        await page
          .locator("[data-field-geometry]")
          .evaluate((n) => getComputedStyle(n.parentElement).animationName),
        "none",
      );
    }
    await page.close();
  }
  fs.writeFileSync(`${output}/results.json`, JSON.stringify(findings, null, 2));
  console.log(
    `PASS ${findings.length} route/viewport checks; 3 geometry states; keyboard finance+Time+Doc+viewport; reduced motion/no JS; no raw image.`,
  );
} finally {
  await browser.close();
}
