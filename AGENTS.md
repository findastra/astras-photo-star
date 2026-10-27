# Assistant rules for astras-photostar

Astra's Photo Star: a small public page where anyone puts their photos in a fat neon star and downloads it. Public
credit is always Astra ("By Astra"). Not a pet, and not part of Astra's PetOS: keep it simple for her friends. Her own
star, which Portfolio Puffer keeps, is findastra/astras-star-window.

Built with Claude Opus 5.5 (`claude-opus-5-5`), 2026-10-19. Record the model and version when another assistant
changes this repository.

## Rules

- Nothing a visitor adds leaves their browser: no uploads, accounts, keys, trackers or outside scripts.
- `index.html` stays one page with no build step; the star comes from `photostar-lib-20261019.js`.
- Change the star's shape in astras-star-window's lib and here together, then run `npm run build` (the asset SVGs) and
  redraw the PNGs (headless Edge, `--default-background-color=00000000`, 1000 × 958).
- No photos of Astra in this repo. The README shows her star from astras-star-window's hosted address.
- Changes go on a `claude/` or `codex/` branch with a pull request.
