# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at localhost:4321
npm run build        # astro check (TypeScript) + astro build
npm run preview      # preview built output
npm run analyze      # bundle visualizer (after build)

npm run optimize-images       # resize/compress/webp public/images/
npm run generate-gallery-json # extract EXIF + generate JSON stubs for new photo collections
npm run perf-test             # build + lighthouse CI
```

`npm run build` runs `astro check` first — TypeScript errors fail the build.

## Architecture

**Framework:** Astro 6 (static output), Tailwind CSS v4 via Vite plugin, TypeScript strict.

**Content collections** (`src/content.config.ts`):
- `writing` — Markdown/MDX from `src/content/writing/` (cloned from a private `writings` repo at deploy time via `GH_PAT` secret; not present locally unless manually cloned)
- `gallery` — JSON files in `src/content/gallery/<collection-slug>/`, one JSON per photo

**Routing:**
- File-based pages in `src/pages/`
- Writing slugs: `src/pages/writing/[...slug].astro`
- Gallery collections: `src/pages/gallery/[collection].astro`
- Category filter pages: `src/pages/writing/{tech,geopolitics,literature,philosophy,fiction,activities}.astro`
- Tag pages: `src/pages/writing/tags/[tag].astro`

**Layouts:**
- `BaseLayout.astro` — HTML shell with SEO, GA, fonts, named slots (`navbar`, `footer`, `head`)
- `WritingLayout.astro` — wraps BaseLayout for article pages

**Config & constants** (`src/config/constants.ts`):
All static site metadata (`SITE_CONFIG`), social links (`SOCIAL_LINKS`), writing categories (`WRITING_CATEGORIES`), and nav links live here. Env vars (`SITE_URL`, `GA_MEASUREMENT_ID`) go in `.env` (see `.env.example`).

**Gallery workflow:**
1. Add images to `public/images/gallery/<collection>/`
2. Run `npm run generate-gallery-json <input-dir> <output-dir>` — reads EXIF, writes JSON stubs
3. Fill in `title`, `description`, `location`, `collection` fields in generated JSONs
4. Run `npm run optimize-images` before committing

**Resume:** `src/utils/resume.ts` auto-detects `arafat-hasan-resume-*.pdf` from `public/`; drop new PDF there and delete the old one.

**Deployment:** GitHub Actions (`.github/workflows/`) — manual trigger only (`workflow_dispatch`). Clones the private `writings` repo, builds, deploys to GitHub Pages. Lighthouse and image optimization steps exist but are commented out.

**SEO / Structured data:** `src/components/common/SEO.astro` and `Schema.astro` handle OG tags and JSON-LD. `BaseLayout` accepts `ogType`, `article` props for per-page overrides.

**Client-side scripts** (`src/scripts/`): TypeScript modules for navbar toggle, gallery lightbox, writing category toggle, and dropdown — loaded as `<script>` tags in components, not bundled globally.
