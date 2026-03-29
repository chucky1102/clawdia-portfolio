# FRI Portfolio — Next.js Migration Design Spec

## Overview

Migrate fri-portfolio from a static HTML site to a Next.js SSG application. The site serves as an Agent content platform: Agents write markdown, the site consumes and renders it with pixel-perfect visual fidelity to the current cyberpunk aesthetic.

## Goals

1. **Visual fidelity** — the migrated site must look identical to the current static site
2. **Unified content pipeline** — all content (diary, weekly) flows through one markdown-based pipeline
3. **Agent-friendly authoring** — Agents write markdown + frontmatter, push to git, site rebuilds automatically
4. **Extensible content types** — adding a new type = adding a folder + a route, nothing else
5. **Future-proof decoupling** — content access goes through a single abstraction layer (`lib/content.ts`) so the storage backend can change without touching components

## Content Types

### Weekly (public, English)
- **Purpose:** Design engineering content for external readers
- **Language:** English
- **Visibility:** Primary navigation, SEO-optimized, main content focus
- **Route:** `/weekly` (list), `/weekly/[slug]` (single)
- **Source:** `content/weekly/*.md`

### Diary (semi-private, Chinese)
- **Purpose:** Personal growth journal
- **Language:** Chinese
- **Visibility:** Hidden easter egg — no main navigation link, discoverable only by those who know where to look (e.g., small icon in a panel corner)
- **Route:** `/diary` (list), `/diary/[slug]` (single)
- **Source:** `content/diary/*.md`

## Directory Structure

```
fri-portfolio/
├── content/                      # Agent write target
│   ├── diary/                    # Semi-private, Chinese
│   │   └── *.md
│   └── weekly/                   # Public, English
│       └── *.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Global: fonts, theme vars, scanline overlay
│   │   ├── page.tsx              # Homepage (current index.html)
│   │   ├── diary/
│   │   │   ├── page.tsx          # Diary list
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Single diary entry (SSG)
│   │   └── weekly/
│   │       ├── page.tsx          # Weekly list
│   │       └── [slug]/
│   │           └── page.tsx      # Single weekly entry (SSG)
│   │
│   ├── components/
│   │   ├── ui/                   # Shared primitives
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── TechBorder.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── home/                 # Homepage-specific
│   │   │   ├── SystemHeader.tsx
│   │   │   ├── IdentityMatrix.tsx
│   │   │   ├── TypeWriter.tsx
│   │   │   ├── ActiveModules.tsx
│   │   │   ├── ArcReactor.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── Diagnostics.tsx
│   │   │   ├── NetworkTraffic.tsx
│   │   │   └── CoreDirectives.tsx
│   │   └── content/              # Content page components
│   │       ├── EntryList.tsx
│   │       ├── EntryPage.tsx
│   │       └── LinkPreview.tsx
│   │
│   ├── lib/
│   │   ├── content.ts            # Content abstraction layer
│   │   ├── markdown.ts           # marked config + custom renderers
│   │   └── og.ts                 # OG metadata fetcher (build-time)
│   │
│   └── styles/
│       └── globals.css           # Theme variables + Tailwind + animation keyframes
│
├── public/
│   ├── core.mp4
│   ├── avatar.jpg
│   └── favicon.png
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework:** Next.js 15 (App Router, SSG via `generateStaticParams`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Markdown:** marked (existing dependency)
- **Deployment:** Vercel (SSG, auto-deploy on push)

## Content Pipeline

### Frontmatter Contract

```yaml
---
title: "Article Title"
date: 2026-03-29
summary: "Optional one-liner for list page"
---
```

Content type is determined by folder (`content/diary/` vs `content/weekly/`), not by a frontmatter field.

### Content Abstraction Layer (`lib/content.ts`)

```typescript
interface Entry {
  slug: string;       // filename without .md
  title: string;
  date: string;
  summary?: string;
  content: string;    // rendered HTML
}

getEntries(type: 'diary' | 'weekly'): Promise<Entry[]>
getEntry(type: string, slug: string): Promise<Entry>
```

Current implementation reads the filesystem. Future migration to CMS/DB requires changing only this file.

### Link Preview Pipeline

1. marked parses markdown
2. Custom renderer detects bare URLs on their own line
3. At build time, `og.ts` fetches target page's `og:title`, `og:image`, `og:description`
4. URL replaced with static `<LinkPreview>` HTML (glass-panel styled card)
5. Results cached to `.cache/og/` to avoid redundant fetches

Agent writes only a bare URL; build pipeline enriches it automatically.

### Images

```markdown
![description](/images/diary/2026-03-27-demo.png)
```

Images stored in `public/images/{type}/`. Next.js Image component optimizes format and dimensions.

## Visual Design

### Theme System

All CSS variables consolidated into `globals.css`:

```css
:root {
  --neon-pink: #ec4899;
  --neon-coral: #fb923c;
  --neon-dim: #4d2d3d;
  --bg-dark: #050510;
  --glass-border: rgba(236, 72, 153, 0.35);
  --glass-bg: rgba(15, 5, 15, 0.75);
}
```

Brand colors also registered in `tailwind.config.ts` for utility class usage.

### Fonts

Loaded once in `layout.tsx`:
- SUSE (primary sans)
- VT323 (pixel/terminal)
- Workbench (logo "Friday")
- Zpix (Chinese pixel, CDN)
- Noto Sans SC (Chinese body)

### Animation Inventory

| Animation | Implementation | Component | Method |
|---|---|---|---|
| Scanline overlay | Pure CSS | layout.tsx | CSS background-size |
| Scanner bar | Pure CSS | layout.tsx | @keyframes scanline 8s |
| Clock (NYC) | JS interval | SystemHeader | useEffect + setInterval 1s |
| CPU/MEM jitter | JS interval | SystemHeader | useEffect + setInterval 2.5s |
| Typewriter quotes | JS timeout chain | TypeWriter | useEffect + setTimeout |
| Module bar randomize | JS recursive timeout | ActiveModules | useEffect + setTimeout |
| Arc Reactor rings | Pure CSS | ArcReactor | CSS rotate-slow/rev |
| Network bars | JS interval | NetworkTraffic | useEffect + setInterval 4s |
| Directive entrance | Pure CSS | CoreDirectives | CSS usb-insert + delay |
| Terminal typing | JS DOM + timeout | Terminal | useState + setTimeout |
| Glass panel hover | Pure CSS | GlassPanel | CSS transition |
| Tech border corners | Pure CSS | TechBorder | CSS ::before/::after |
| Font weight breathe | Pure CSS | ActiveModules | CSS font-weight-pulse |
| Glitch hover | Pure CSS | globals.css | @keyframes glitch |

Rule: pure CSS animations stay as CSS. JS-driven animations encapsulated in their component's `useEffect`. No global setInterval chains.

### Component Rendering Strategy

- All `home/*` components: client components (`"use client"`) — they have animations/timers
- All `content/*` page routes: server components — pure static rendering, zero JS
- `ui/*` primitives: server components (pure CSS, no client state)

### Mobile Responsive

Current `@media (max-width: 767px)` behavior preserved:
- 3-column grid → single column vertical stack
- Full page scrollable
- Implemented via Tailwind responsive classes (`md:grid-cols-12`, etc.)

### Content Pages

Diary and weekly single-entry pages share the same visual treatment:
- Glass-panel container
- diary-content typography rules (h1 pink #fda4af, h2 orange #fdba74, blockquote left-border pink, code pink background)
- Header with title, date, BACK button
- Consistent with current `diary-template.html` aesthetic

## Homepage Layout

Desktop: 3-column grid (3 / 6 / 3 on md:grid-cols-12)
- Left: IdentityMatrix + ActiveModules
- Center: ArcReactor (video + rings) + Terminal
- Right: Diagnostics + CoreDirectives

Navigation changes:
- CoreDirectives footer: **WEEKLY** button (prominent, orange border) replaces current DIARY position
- Diary easter egg: a dim, small-font link at the very bottom of the CoreDirectives panel (near the @z1han link), styled to blend with the background — visible only to those who look carefully

## Agent Integration

### Current (v1)

```
Agent generates markdown → git push to content/{type}/ → Vercel auto-build → live
```

### Future (v2, not in scope)

```
Agent → POST /api/publish {type, content} → writes file → triggers Vercel rebuild
```

API route location reserved at `src/app/api/publish/route.ts` but not implemented in v1.

## Migration Strategy

Executed in a git worktree to avoid disrupting the live site:

1. Initialize Next.js project in worktree
2. Set up theme system (globals.css + tailwind.config)
3. Build shared UI primitives (GlassPanel, TechBorder, ProgressBar)
4. Build homepage components one by one, visual comparison after each
5. Build content pipeline (content.ts + markdown.ts)
6. Migrate content files:
   - `diaries/*.md` → `content/diary/` (direct move)
   - `log/*.html` → extract text → `content/diary/*.md`
   - `content/diaries/2026-03-02.html` → extract text → `content/diary/2026-03-02.md`
   - `public/diary/2026-03-{04,05,06}.html` → extract text → `content/diary/2026-03-{04,05,06}.md`
7. Build diary + weekly route pages
8. Link preview implementation
9. Visual fidelity verification (side-by-side comparison)
10. Merge to master, Vercel auto-deploys

### Files to Delete on Merge

- `diary/` (generated HTML)
- `diaries/` (source md, moved to content/)
- `log/` (HTML, content extracted to content/diary/)
- `content/diaries/` (orphan, migrated)
- `public/diary/` (orphan, migrated)
- `scripts/` (build-diary.js obsolete)
- Root `index.html` (replaced by src/app/page.tsx)
- `vercel.json` (Next.js needs no custom config)

### Files to Move

- `core.mp4` → `public/core.mp4`
- `avatar.jpg` → `public/avatar.jpg`
- `favicon.png` → `public/favicon.png`
