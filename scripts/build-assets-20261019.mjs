// Writes the free star assets from the same fat star the maker uses:
//   assets/fat-star-frame.svg  the neon outline, empty inside
//   assets/fat-star-shape.svg  the solid star, for masks and stickers
// The PNGs next to them are these SVGs drawn at 1000 pixels wide on a see-through background.
// node scripts/build-assets-20261019.mjs [--check]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { frame, OUTLINES } from '../photostar-lib-20261019.js';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function assets() {
  const f = frame();
  const stops = OUTLINES.neon.map((c, i) => `<stop offset="${i * 50}%" stop-color="${c}"/>`).join('');
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f.width} ${f.height}" width="${f.width}" height="${f.height}">`;
  return {
    'assets/fat-star-frame.svg': `${open}
<title>Fat star frame, by Astra</title>
<defs><linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient>
<filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter></defs>
<path d="${f.path}" fill="none" stroke="url(#neon)" stroke-width="22" opacity="0.55" filter="url(#glow)"/>
<path d="${f.path}" fill="none" stroke="url(#neon)" stroke-width="10" stroke-linejoin="round"/>
</svg>
`,
    'assets/fat-star-shape.svg': `${open}
<title>Fat star shape, by Astra</title>
<path d="${f.path}" fill="#000"/>
</svg>
`,
  };
}

// Compare real paths: run through the "Astra's PetOS" junction, argv[1] and this file's URL differ.
const direct = process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (direct) {
  let stale = 0;
  for (const [file, text] of Object.entries(assets())) {
    const p = path.join(ROOT, file);
    const same = fs.existsSync(p) && fs.readFileSync(p, 'utf8') === text;
    if (process.argv.includes('--check')) { if (!same) { stale += 1; console.log(`${file} is out of date`); } continue; }
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, text);
    console.log(`wrote ${file}`);
  }
  process.exit(stale ? 1 : 0);
}
