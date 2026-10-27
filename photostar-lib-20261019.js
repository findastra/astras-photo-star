// Astra's Photo Star: the fat star and the photo star SVG, used by the maker (index.html) and the asset script.
// The same fat star as Astra's own star window (findastra/astras-star-window). Plain ES module, no dependencies.

// The star's shape (Astra, 2026-10-19: "the star is fat"): five chunky points, a high waist and round tips.
export const STAR = { points: 5, inner: 0.6, tipRound: 0.46, waistRound: 0.26 };

// The frame every picture is cut to, in frame units. The star fills it, with room for the neon outline.
export const UNIT = 1000;

const round = (n) => Math.round(n * 10) / 10;

// The star's corners, outer tip first at the top, then alternating waist and tip, clockwise.
function corners({ points, inner }, r) {
  const out = [];
  for (let i = 0; i < points * 2; i += 1) {
    const a = -Math.PI / 2 + (i * Math.PI) / points;
    const rad = i % 2 ? r * inner : r;
    out.push([rad * Math.cos(a), rad * Math.sin(a)]);
  }
  return out;
}

// Each corner becomes a curve: it starts part of the way along one edge and ends part of the way along the next,
// with the corner itself as the control point, so tips are round and the waists are soft.
function roundedPath(pts, star) {
  const n = pts.length;
  const at = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  let d = '';
  for (let i = 0; i < n; i += 1) {
    const prev = pts[(i - 1 + n) % n], cur = pts[i], next = pts[(i + 1) % n];
    const t = i % 2 ? star.waistRound : star.tipRound;
    const a = at(cur, prev, t / 2), b = at(cur, next, t / 2);
    d += `${i ? 'L' : 'M'}${round(a[0])} ${round(a[1])}Q${round(cur[0])} ${round(cur[1])} ${round(b[0])} ${round(b[1])}`;
  }
  return `${d}Z`;
}

// The bounds of the rounded star of radius 1 (the curves stay inside their corners, so sampling them is enough).
function bounds(pts, star) {
  const n = pts.length;
  const xs = [], ys = [];
  for (let i = 0; i < n; i += 1) {
    const prev = pts[(i - 1 + n) % n], cur = pts[i], next = pts[(i + 1) % n];
    const t = (i % 2 ? star.waistRound : star.tipRound) / 2;
    const a = [cur[0] + (prev[0] - cur[0]) * t, cur[1] + (prev[1] - cur[1]) * t];
    const b = [cur[0] + (next[0] - cur[0]) * t, cur[1] + (next[1] - cur[1]) * t];
    for (let k = 0; k <= 20; k += 1) {
      const s = k / 20, u = 1 - s;
      xs.push(u * u * a[0] + 2 * u * s * cur[0] + s * s * b[0]);
      ys.push(u * u * a[1] + 2 * u * s * cur[1] + s * s * b[1]);
    }
  }
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

// The frame: UNIT wide, as tall as the star needs, with `pad` units around the star for the outline and its glow.
export function frame(star = STAR, pad = 34) {
  const unit = corners(star, 1);
  const b = bounds(unit, star);
  const r = (UNIT - 2 * pad) / (b.maxX - b.minX);
  const height = Math.round((b.maxY - b.minY) * r + 2 * pad);
  const cx = UNIT / 2, cy = pad - b.minY * r;
  const pts = corners(star, r).map(([x, y]) => [x + cx, y + cy]);
  return { width: UNIT, height, path: roundedPath(pts, star) };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Opacity keyframes for picture i of n: each picture holds, then the next one fades in on top of it. At the end of
// the round the last picture fades out over the first, which has come back underneath, so the star is never see-through.
export function keyframes(i, n, hold, fade) {
  const total = n * hold;
  const p = (t) => `${round((t / total) * 1000) / 10}%`;
  const tiny = total / 2000;
  if (i === 0) return `0%{opacity:1}${p(hold)}{opacity:1}${p(hold + tiny)}{opacity:0}${p(total - fade - tiny)}{opacity:0}${p(total - fade)}{opacity:1}100%{opacity:1}`;
  const start = i * hold - fade;
  if (i === n - 1) return `0%{opacity:0}${p(start)}{opacity:0}${p(i * hold)}{opacity:1}${p(total - fade)}{opacity:1}100%{opacity:0}`;
  return `0%{opacity:0}${p(start)}{opacity:0}${p(i * hold)}{opacity:1}${p((i + 1) * hold)}{opacity:1}${p((i + 1) * hold + tiny)}{opacity:0}100%{opacity:0}`;
}

// The hosted picture. `pictures` are [{ href, alt }] where href is a data: URL, because a picture used in an <img>
// (a GitHub README, another site) may not load anything else. The pictures fade from one to the next in the star.
// The outlines a maker can pick; an empty list means no outline.
export const OUTLINES = {
  neon: ['#ff5fd2', '#b388ff', '#3ff3ff'],
  gold: ['#fff1a8', '#ffc83d', '#ff9a3d'],
  pearl: ['#ffffff', '#e6e1ff', '#cfeeff'],
  none: [],
};

export function buildSvg({ title = 'My photo star', seconds = 5, fade = 1.2, outline = OUTLINES.neon } = {}, pictures = [], star = STAR) {
  const f = frame(star);
  const n = pictures.length;
  const hold = Math.max(2, Number(seconds) || 5), fadeS = Math.min(Math.max(0.2, Number(fade) || 1.2), hold / 2);
  const total = round(n * hold);
  const alt = pictures.map((p) => p.alt).filter(Boolean).join(' · ');
  const edge = outline.length > 0;
  const stops = outline.map((c, i) => `<stop offset="${round((i / Math.max(1, outline.length - 1)) * 100)}%" stop-color="${esc(c)}"/>`).join('');
  const css = n > 1
    ? pictures.map((_, i) => `.p${i}{animation:k${i} ${total}s linear infinite}@keyframes k${i}{${keyframes(i, n, hold, fadeS)}}`).join('')
    : '';
  const images = pictures.map((p, i) =>
    `<image class="p p${i}" href="${esc(p.href)}" x="0" y="0" width="${f.width}" height="${f.height}" preserveAspectRatio="xMidYMid slice"/>`).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f.width} ${f.height}" width="${f.width / 4}" height="${round(f.height / 4)}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(alt || 'An empty star window')}</desc>
<style>.p{opacity:0}.p0{opacity:1}${css}</style>
<defs>
<clipPath id="star"><path d="${f.path}"/></clipPath>
${edge ? `<linearGradient id="neon" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient>
<filter id="glow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
` : ''}</defs>
<path d="${f.path}" fill="#26272b"/>
<g clip-path="url(#star)">
${images}
</g>
${edge ? `<path d="${f.path}" fill="none" stroke="url(#neon)" stroke-width="22" opacity="0.55" filter="url(#glow)"/>
<path d="${f.path}" fill="none" stroke="url(#neon)" stroke-width="10" stroke-linejoin="round"/>
` : ''}</svg>
`;
}

// Where a photo sits in the frame: `x` and `y` are the frame point under the photo's centre, `zoom` is frame units per
// photo pixel. A new photo starts out covering the whole frame, centred.
export function coverPlace(photoW, photoH, star = STAR) {
  const f = frame(star);
  return { x: f.width / 2, y: f.height / 2, zoom: Math.max(f.width / photoW, f.height / photoH) };
}

// Cut a placed photo to the frame on a 2D canvas context of `outW` pixels wide (the browser's canvas or any
// compatible one). Outside the photo stays the graphite background.
export function drawPlaced(ctx, img, photoW, photoH, place, outW, star = STAR) {
  const f = frame(star);
  const k = outW / f.width;
  const outH = Math.round(f.height * k);
  ctx.fillStyle = '#26272b';
  ctx.fillRect(0, 0, outW, outH);
  const w = photoW * place.zoom * k, h = photoH * place.zoom * k;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, place.x * k - w / 2, place.y * k - h / 2, w, h);
  return { width: outW, height: outH };
}
