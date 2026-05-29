# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: Next.js version

This project runs **Next.js 16.2.6 with React 19.2** (App Router). These are newer than your training data — APIs, conventions, and file structure may differ from what you expect. **Before writing any Next.js / React code, read the relevant guide under `node_modules/next/dist/docs/`** (entry point: `node_modules/next/dist/docs/index.md`; app-router guides under `01-app/`). Heed deprecation notices. Do not assume an API exists from memory — verify it in the bundled docs.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # ESLint (flat config, eslint-config-next)
```

There is no test runner configured. The project uses npm (a `package-lock.json` is committed).

## Project

Marketing website for **Wae Watu Reef Resort**, a luxury overwater resort in Labuan Bajo, Komodo (NTT, Indonesia). It is a brochure / lead-gen site: the primary conversion action is **contacting the resort via WhatsApp** (and phone) — there is no online booking engine, so WhatsApp CTAs must be prominent on every page. Working language for content and many requests is **Indonesian**.

**`RANCANGAN.md` is the design & content source of truth.** It holds the resort facts, color palette, typography, per-page layout spec, and the owner's working-style rules. Read it before building or restyling pages, and update it there (not here) when the design changes — avoid duplicating its content into this file.

## Architecture

- **App Router** (`app/` directory). No `src/` folder, no `pages/` directory.
- **`app/layout.tsx`** — root layout. Loads Geist / Geist Mono via `next/font/google` as CSS variables (`--font-geist-sans`, `--font-geist-mono`); sets `<html>`/`<body>` flex-column scaffolding; holds global `metadata`. (The design system in `RANCANGAN.md` specifies different fonts — Cormorant Garamond / Jost / Lora — so expect to swap fonts here when building real pages.)
- **`app/page.tsx`** — homepage (currently the create-next-app starter, to be replaced).
- **`app/globals.css`** — Tailwind v4 entry, CSS-first config: `@import "tailwindcss"` + `@theme inline { ... }` mapping CSS variables to Tailwind tokens. **There is no `tailwind.config.js`** — extend the theme inside `globals.css` `@theme`, not a JS config. Dark mode via `prefers-color-scheme`.
- **Path alias**: `@/*` maps to the repo root.
- **Static assets** in `public/` (resort logo at `public/images/logo.webp`).

New pages follow the App Router convention of one folder per route segment under `app/` (e.g. `app/kamar/page.tsx`). Per `RANCANGAN.md`, build priority is **Home → Rooms → Contact**, and every page carries a navbar, a floating WhatsApp button, and a footer.
