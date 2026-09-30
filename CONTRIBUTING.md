# Contributing

Thanks for helping make Meeting RunBook better.

## Ground rules

- **Keep it simple.** The product's whole point is *the least process a small team needs*. A feature that adds a step for everyone needs a strong reason.
- **RTL first.** Every UI change must look right in Persian (RTL) *and* English (LTR). Use logical CSS properties (`margin-inline-start`, `inset-inline-end`, …), never `left`/`right` for layout.
- **No servers, no tracking.** Data stays in the browser. Don't add analytics, remote fonts (brand fonts are self-hosted in `public/fonts/`), or network calls.
- **Both languages.** Every user-facing string goes through `src/i18n/` — add the key to `fa.ts` and `en.ts` together.
- **Dependencies are a cost.** Prefer a small local implementation (see `src/lib/xlsx.ts`) over a new package unless the package clearly earns its place.

## Workflow

1. Open an issue first for anything bigger than a bug fix.
2. Fork → branch (`feat/…`, `fix/…`) → PR against `main`.
3. `npm run build` must pass (it runs the type check).
4. Describe what changed and why; include a screenshot for UI changes (RTL + LTR).

## Data schema

`src/model/types.ts` defines the runbook shape. Bump `SCHEMA_VERSION` and extend `normalizeRunbook()` in `src/store/store.tsx` whenever you change it, so old JSON files and share links keep opening.

## Code style

TypeScript, strict mode, React function components, no default exports except `App`. Small files over clever ones.

## Maintainer

Kourosh Sedigh ([@iamkourosh](https://github.com/iamkourosh)) — Powered by KarkhooneAI.
