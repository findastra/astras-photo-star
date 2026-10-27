// Checks for Astra's Photo Star: the star assets match the star, a photo star loads nothing from outside, and the fade
// never leaves the star see-through. Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildSvg, frame, keyframes, OUTLINES, UNIT } from '../photostar-lib-20261019.js';
import { assets, ROOT } from '../scripts/build-assets-20261019.mjs';

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('the asset SVGs are the fat star (run npm run build)', () => {
  for (const [file, text] of Object.entries(assets())) assert.equal(read(file), text, file);
  for (const f of ['assets/fat-star-frame.png', 'assets/fat-star-shape.png']) {
    const png = fs.readFileSync(path.join(ROOT, f));
    assert.equal(png.toString('latin1', 1, 4), 'PNG', f);
    assert.equal(png.readUInt32BE(16), UNIT, `${f} is ${UNIT} wide`);
    assert.equal(png.readUInt32BE(20), frame().height, `${f} is as tall as the star's frame`);
  }
});

test('a photo star holds its photos inside it and nothing else', () => {
  for (const outline of Object.values(OUTLINES)) {
    const svg = buildSvg({ outline }, [{ href: 'data:image/jpeg;base64,AAAA', alt: 'a' }, { href: 'data:image/jpeg;base64,BBBB', alt: 'b' }]);
    const refs = [...svg.matchAll(/(?:href|src)="([^"]*)"|url\(([^)]*)\)/g)].map((m) => m[1] ?? m[2]);
    for (const r of refs) assert.ok(r.startsWith('data:image/jpeg;base64,') || r.startsWith('#'), r);
    assert.doesNotMatch(svg, /<script|on\w+=/i);
    assert.equal(/stroke=/.test(svg), outline.length > 0, 'an outline only when one is picked');
  }
});

function opacityAt(css, t, total) {
  const stops = [...css.matchAll(/([\d.]+)%\{opacity:([\d.]+)\}/g)].map((m) => [Number(m[1]) / 100 * total, Number(m[2])]);
  for (let i = 1; i < stops.length; i += 1) {
    const [t0, a0] = stops[i - 1], [t1, a1] = stops[i];
    if (t <= t1) return t1 === t0 ? a1 : a0 + (a1 - a0) * ((t - t0) / (t1 - t0));
  }
  return stops.at(-1)[1];
}

test('the star is never see-through while the photos fade', () => {
  for (let n = 2; n <= 8; n += 1) {
    const hold = 5, fade = 1.2, total = n * hold;
    const frames = Array.from({ length: n }, (_, i) => keyframes(i, n, hold, fade));
    for (let t = 0; t <= total; t += total / 2000) {
      const cover = 1 - frames.reduce((clear, css) => clear * (1 - opacityAt(css, t, total)), 1);
      assert.ok(cover > 0.999, `${n} photos at ${t.toFixed(2)} s`);
    }
  }
});

test('the maker loads only its own files, and offers the assets', () => {
  const page = read('index.html');
  assert.match(page, /from '\.\/photostar-lib-20261019\.js'/);
  for (const a of ['fat-star-frame.svg', 'fat-star-frame.png', 'fat-star-shape.svg', 'fat-star-shape.png']) assert.ok(page.includes(`assets/${a}`), a);
  assert.doesNotMatch(page, /api\.github\.com|fetch\(['"`]http/, 'nothing is uploaded or fetched from elsewhere');
});
