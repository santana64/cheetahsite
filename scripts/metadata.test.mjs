import assert from 'node:assert/strict';
import test from 'node:test';
let run = 0;
const canonical = async (site, base) => {
  process.env.NEXT_PUBLIC_SITE_URL = site;
  process.env.NEXT_PUBLIC_BASE_PATH = base;
  const { pageMetadata } = await import(`../src/lib/metadata.ts?test=${run++}`);
  return pageMetadata('/contact/', 'Contact', 'Description').alternates.canonical;
};
test('Vercel canonical uses the public root', async () => assert.equal(await canonical('https://cheetahsite.vercel.app',''), 'https://cheetahsite.vercel.app/contact/'));
test('Pages canonical adds a configured subpath once', async () => assert.equal(await canonical('https://santana64.github.io','/site-vitrine'), 'https://santana64.github.io/site-vitrine/contact/'));
test('existing Pages public URL does not duplicate the subpath', async () => assert.equal(await canonical('https://santana64.github.io/site-vitrine','/site-vitrine'), 'https://santana64.github.io/site-vitrine/contact/'));
