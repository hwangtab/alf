# Repository Guidelines

## Project Structure & Module Organization
This Next.js App Router repo keeps route code in `src/app`, where each segment (e.g., `gallery`, `videos`, `news`) holds its `page.tsx`, optional loading/error files, and route-specific styles. Reusable UI lives in `src/components`, helpers in `src/utils`, and data files (timelines, copy decks, metadata) in `src/data`. Custom fonts are stored in `src/fonts`, static media in `public/`, and automation scripts such as `convert-gallery.js` in `scripts/`. Keep any additional documentation or research artifacts inside `docs/` so runtime bundles stay lean.

## Build, Test, and Development Commands
`npm run dev` starts the hot-reloading dev server on `http://localhost:3000`. `npm run build` compiles an optimized bundle; run it before every PR. `npm run start` serves the last build for staging-style smoke tests. `npm run lint` applies the `eslint-config-next` rule set and should finish clean. `npm run analyze` visualizes route-level bundle weights, and `npm run build:prod` adds `next export` for static hosting drops. `npm run convert:gallery` executes `scripts/convert-gallery.js` to convert `public/images/gallery/*.png` files to `.webp` while removing the originals.

## Coding Style & Naming Conventions
Author components in TypeScript with 2-space indents, preferring functional components and early returns. Use PascalCase filenames for components (`LatestActivities.tsx`), camelCase for hooks/utilities, and kebab-case folders for routes below `src/app`. Keep Tailwind utility classes inline in JSX and reserve `src/app/globals.css` for tokens or layout resets. Run `npm run lint` (or your editor ESLint integration) before committing so formatting-only diffs stay small.

## Testing Guidelines
Automated testing is not yet wired in, so add focused React Testing Library specs when introducing nontrivial state (store them alongside the component as `ComponentName.test.tsx`). Regardless of tests, manually verify the main flows (`/gallery`, `/videos`, `/news`, contact forms) while running `npm run dev`, covering desktop/tablet/mobile widths and light/dark contrast. Document reproduction steps, datasets, and QA notes in the PR description so reviewers can mirror them quickly.

## Commit & Pull Request Guidelines
Follow the conventional style used in `git log` (`feat:`, `fix:`, `chore:`) with short, imperative subjects; localized summaries are fine. Split unrelated work into separate commits and mention any asset migrations (e.g., gallery conversions) to ease deployment audits. Pull requests must include a concise summary, screenshots for visual changes, linked issues, and the results of `npm run build` plus `npm run lint`; call out TODOs or follow-ups explicitly.
