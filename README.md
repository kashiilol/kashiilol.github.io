# kashii-music.github.io

Astro portfolio for Brisbane producer kashii, featuring original music, reinterpretations, embedded SoundCloud players, and commission information.

## Requirements

- Node.js 24
- npm

## Development

```bash
npm ci
npm run dev
```

Track and commission data live in `src/data`; shared site metadata and navigation live in `src/site.config.ts`.

## Validation

```bash
npm run check
npm run lint
npm run format:check
npm run build
```

## Deployment

Pushes to `main` are validated and deployed to [kashiilol.github.io](https://kashiilol.github.io/) through GitHub Actions and GitHub Pages.
