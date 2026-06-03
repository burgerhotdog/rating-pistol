# Copilot Instructions — rating-pistol

## Project Overview
React 18 + Vite + MUI 7 + Firebase web app for rating game equipment builds across four games:
`genshin-impact`, `honkai-star-rail`, `wuthering-waves`, `zenless-zone-zero`.

All game-specific data lives under `src/data/<gameId>/` and public images under `public/<gameId>/`.
The multi-game pattern is consistent — changes to data shape or rating logic typically apply to all four games.

## Tech Stack
- **UI**: React 18, MUI 7 (Emotion), React Router 7
- **Build**: Vite (ES modules, no Babel, no jQuery)
- **State**: React Context (`src/contexts/`) — Auth, Build, User
- **Backend**: Firebase (Firestore + Auth)
- **Workers**: Web Workers for OCR (`tesseract.js`) and simulation
- **Charts**: Recharts, DnD Kit for sortable lists

## Key Conventions

### Routing
- Route pattern: `/:gameId/:characterId?`
- Use `navigate(path, { replace: true })` when switching characters to avoid history stacking.
- Parse only the first pathname segment to determine the active game.

### Data Files
- `character.json`, `weapon.json`, `set.json` follow a consistent schema across all games.
- `mv.json` holds motion value data.

## JavaScript Style
- ES2020+: `const`/`let` only, arrow functions, async/await, optional chaining (`?.`), nullish coalescing (`??`), destructuring, template literals.
- No `var`, no jQuery, no `eval()`, no CommonJS `require()`.
- Use ES module imports/exports throughout.
- Handle promise rejections explicitly; use `try/catch` for async operations.

## Large File Protocol
For files over 300 lines or changes touching multiple interconnected parts:
1. Outline the full plan (files affected, order of edits, dependencies) before making any changes.
2. Wait for confirmation, then execute one logical edit at a time.
3. Note if additional changes are discovered mid-edit and update the plan before continuing.

## What to Avoid
- Do not refactor or rename beyond what is requested.
- Do not add error handling for scenarios that cannot occur given the call site.
- Do not suggest PHP, SQLite, or non-project technologies.
- Do not alter the folder structure — it is intentional.
