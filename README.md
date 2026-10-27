# Astra's Photostar

By Astra

<img align="right" width="180" src="https://findastra.github.io/astras-star-window/star-window.svg" alt="Astra's own photo star: a fat neon star fading between pictures of her avatar">

Put your favorite photos in a fat neon star. Drag each photo until it sits right, then download your photo star: a
PNG, or an SVG that fades from one photo to the next. Your photos never leave your device.

**Make yours:** https://findastra.github.io/astras-photostar/

## How

1. Open the page and choose a photo (or drop or paste one). Drag it until it sits right in the star; scroll or pinch to
   zoom. **Add to my star.**
2. Add more photos if you like: they fade from one to the next. Click a photo in the strip to pick it for the PNG, or
   × to take it out.
3. Pick an outline: Neon, Gold, Pearl or None.
4. **Download PNG** (the photo you picked, see-through around the star) or **Download SVG** (all of them, fading).

Nothing is uploaded: the page cuts your photos in your own browser, and nothing is kept after you close it.

## Put it on your GitHub profile or website

Put `photostar.svg` in your profile repo (the one named like your username), then add this above your title:

```html
<img align="right" width="160" src="photostar.svg" alt="My photo star">
```

On a website, an `<img>` with the SVG works the same way. The SVG holds its photos inside it, so it needs nothing else.

## Free star assets

| File | What it is |
|---|---|
| [`assets/fat-star-frame.svg`](assets/fat-star-frame.svg), [`.png`](assets/fat-star-frame.png) | the neon outline, empty inside |
| [`assets/fat-star-shape.svg`](assets/fat-star-shape.svg), [`.png`](assets/fat-star-shape.png) | the solid star, for masks and stickers |

PNGs are 1000 × 958 with a see-through background. Use them for anything.

## Files

- `index.html`: the whole maker, no build step and no install. Download the repo and open it from a local web server,
  or use the page above.
- `photostar-lib-20261019.js`: the fat star's shape and the SVG writer. It is the same star as
  [Astra's own star](https://github.com/findastra/astras-star-window).
- `scripts/build-assets-20261019.mjs`: rebuilds the asset SVGs. `npm test` checks the star and the assets.

## Credits

By Astra. MIT license: use the code and the star assets for anything. Built with Claude Opus 5.5 (`claude-opus-5-5`),
2026-10-19.
