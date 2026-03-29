# FRI Portfolio Next.js Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate fri-portfolio from static HTML to Next.js SSG with pixel-perfect visual fidelity, unified markdown content pipeline, and Agent-friendly authoring.

**Architecture:** Next.js 15 App Router with SSG (`generateStaticParams`). Content lives in `content/` as markdown with frontmatter, read through a `lib/content.ts` abstraction layer. All homepage animations preserved as React client components. Deployed on Vercel.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, marked, Vercel

**Spec:** `docs/superpowers/specs/2026-03-29-nextjs-migration-design.md`

**Source of truth for visual fidelity:** The current `index.html` at project root and `scripts/diary-template.html`. Every CSS value, animation timing, and layout measurement must be extracted from these files — not approximated.

---

## File Map

### New files to create

```
src/app/layout.tsx                      — Root layout: fonts, meta, scanline overlay, globals
src/app/page.tsx                        — Homepage: assembles the 3-column grid from home/* components
src/app/diary/page.tsx                  — Diary list page (hidden, semi-private)
src/app/diary/[slug]/page.tsx           — Single diary entry (SSG)
src/app/weekly/page.tsx                 — Weekly list page (public, primary)
src/app/weekly/[slug]/page.tsx          — Single weekly entry (SSG)
src/components/ui/GlassPanel.tsx        — Glass morphism container (CSS only)
src/components/ui/TechBorder.tsx        — Corner decoration wrapper (CSS only)
src/components/ui/ProgressBar.tsx       — Pink animated progress bar
src/components/home/SystemHeader.tsx    — Top bar: logo, status, CPU/MEM, clock
src/components/home/IdentityMatrix.tsx  — Left panel: designation, voice, brain, etc.
src/components/home/TypeWriter.tsx      — Rotating quote typewriter effect
src/components/home/ActiveModules.tsx   — Left panel: module list with jittery bars
src/components/home/ArcReactor.tsx      — Center: video + rotating CSS rings + uptime
src/components/home/Terminal.tsx        — Center bottom: fake terminal with input
src/components/home/Diagnostics.tsx     — Right panel: latency, uptime, network, services
src/components/home/NetworkTraffic.tsx  — Animated bar chart inside Diagnostics
src/components/home/CoreDirectives.tsx  — Right panel: directive cards + nav links
src/components/content/EntryList.tsx    — Shared list component for diary/weekly
src/components/content/EntryPage.tsx    — Shared single-entry renderer
src/components/content/LinkPreview.tsx  — URL card preview (glass-panel styled)
src/lib/content.ts                      — Content abstraction: read md, parse frontmatter
src/lib/markdown.ts                     — marked config + link preview custom renderer
src/lib/og.ts                           — OG metadata fetcher (build-time, cached)
src/styles/globals.css                  — Theme vars, Tailwind imports, all keyframe animations
content/diary/*.md                      — Migrated diary entries (from diaries/, log/, orphans)
content/weekly/.gitkeep                 — Placeholder for future weekly content
next.config.ts                          — Next.js configuration
tailwind.config.ts                      — Tailwind with brand colors
tsconfig.json                           — TypeScript config
```

### Files to delete (on final merge)

```
index.html, diary/*, diaries/*, log/*, content/diaries/*, public/diary/*,
scripts/*, vercel.json, package-lock.json (regenerated)
```

### Files to move

```
core.mp4 → public/core.mp4
avatar.jpg → public/avatar.jpg
favicon.png → public/favicon.png
```

---

## Task 1: Initialize Next.js Project in Worktree

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.css`

- [ ] **Step 1: Create worktree branch and initialize**

```bash
cd /Users/henry/PARA/01-Projects/Vibe/fri-portfolio
git worktree add -b feat/nextjs-migration ../fri-portfolio-next master
cd ../fri-portfolio-next
```

- [ ] **Step 2: Initialize Next.js**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias --no-turbopack
```

When prompted, accept defaults. This scaffolds the project structure.

- [ ] **Step 3: Install marked**

```bash
npm install marked
```

- [ ] **Step 4: Move static assets to public/**

```bash
mv core.mp4 public/core.mp4
mv avatar.jpg public/avatar.jpg
mv favicon.png public/favicon.png
```

- [ ] **Step 5: Create content directories**

```bash
mkdir -p content/diary content/weekly
touch content/weekly/.gitkeep
```

- [ ] **Step 6: Add .superpowers/ to .gitignore**

Append to `.gitignore`:
```
.superpowers/
.cache/
```

- [ ] **Step 7: Verify the scaffold runs**

```bash
npm run dev
```

Open `http://localhost:3000` — should show the default Next.js page.
Kill the dev server (`Ctrl+C`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project scaffold"
```

---

## Task 2: Theme System — globals.css + tailwind.config.ts

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `tailwind.config.ts`

**Reference:** Extract all CSS from `index.html` lines 7-412 and `scripts/diary-template.html` lines 9-93.

- [ ] **Step 1: Write globals.css**

Replace `src/styles/globals.css` entirely. This must contain:
- Tailwind directives
- CSS custom properties (`:root` block)
- `@font-face` for Zpix
- Body styles (background grid, color, font-family)
- All utility classes: `.font-tech`, `.font-workbench`, `.font-vt323`, `.font-module-label`
- `.pa-icon` styles and color variants
- `.glass-panel` with hover
- `.tech-border` with `::before`, `::after`, `.corner-bl`, `.corner-br`
- All `@keyframes`: `font-weight-pulse`, `bar-enter-ltr`, `scanline`, `rotate-slow`, `rotate-rev`, `pulse-ring`, `stutter-ring`, `breathe`, `blink`, `glitch`, `usb-insert`, `panel-expand`, `quote-trail`
- `.network-bar`, `.scanline-overlay`, `.scanner-bar`, `.animate-spin-slow`, `.animate-spin-slower`, `.animate-spin-rev`, `.animate-pulse-ring`
- `.progress-bar-bg`, `.progress-bar-fill`
- `.typewriter::after`, `.quote-cursor`
- `#quote-typer` styles including `::before` grain overlay
- `#quote-text` text-shadow
- `.terminal-output` and all child classes (`.term-prompt-user`, `.term-prompt-fri`, `.term-output`, `.term-meta`, `.term-cursor`)
- `.custom-scroll` webkit scrollbar styles
- `.directive-reveal` and `.directive-item` animation delays
- `.arc-reactor`, `.arc-ring`, `.arc-ring-3`, `.arc-ring-4`, `.arc-ring-5`
- `#session-panel` transition and `.expanded` state
- `.session-chevron` transition
- `.glitch-text:hover`
- Mobile `@media (max-width: 767px)` — all responsive overrides
- Content page typography: `.diary-content h1`, `.diary-content h2`, `.diary-content h3`, `.diary-content p`, `.diary-content em`, `.diary-content strong`, `.diary-content blockquote`, `.diary-content code`, `.diary-content a`, `.diary-content hr`

Copy every value exactly from the source HTML. Do not approximate colors, timings, or sizes.

- [ ] **Step 2: Write tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: "#ec4899",
          coral: "#fb923c",
          dim: "#4d2d3d",
        },
        "bg-dark": "#050510",
      },
      fontFamily: {
        suse: ["SUSE", "sans-serif"],
        vt323: ["VT323", "Zpix", "Noto Sans SC", "monospace"],
        workbench: ["Workbench", "sans-serif"],
        tech: ["SUSE", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Verify build succeeds**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css tailwind.config.ts
git commit -m "feat: add complete theme system — CSS vars, keyframes, animations"
```

---

## Task 3: Shared UI Primitives — GlassPanel, TechBorder, ProgressBar

**Files:**
- Create: `src/components/ui/GlassPanel.tsx`
- Create: `src/components/ui/TechBorder.tsx`
- Create: `src/components/ui/ProgressBar.tsx`

- [ ] **Step 1: Write GlassPanel.tsx**

```tsx
import { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-panel rounded-sm ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Write TechBorder.tsx**

```tsx
import { ReactNode } from "react";

export function TechBorder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-panel tech-border rounded-sm relative ${className}`}>
      <div className="corner-bl absolute bottom-0 left-0 w-3 h-3" />
      <div className="corner-br absolute bottom-0 right-0 w-3 h-3" />
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Write ProgressBar.tsx**

```tsx
export function ProgressBar({ width }: { width: number }) {
  return (
    <div className="progress-bar-bg">
      <div
        className="progress-bar-fill"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shared UI primitives — GlassPanel, TechBorder, ProgressBar"
```

---

## Task 4: Homepage — SystemHeader

**Files:**
- Create: `src/components/home/SystemHeader.tsx`

**Reference:** `index.html` lines 421-447 (header HTML), lines 853-900 (clock + CPU/MEM JS).

- [ ] **Step 1: Write SystemHeader.tsx**

This is a `"use client"` component. It contains:
- Logo "Friday" with `.font-workbench` and subtitle
- Status indicator (green dot + "SYSTEM ONLINE")
- CPU value + bar (jitters every 2.5s around base 18%)
- MEM value + bar (jitters every 2.5s around base 1.2GB, max 1.6GB)
- Clock displaying NYC time (updates every 1s via `Intl.DateTimeFormat` with `timeZone: 'America/New_York'`)

All three intervals (`clock`, `cpu/mem`) in separate `useEffect` hooks with cleanup.

Port the exact JS logic from `index.html` lines 858-900:
- Clock: `new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })`
- CPU: base 18, delta `(Math.random() - 0.5) * 10`, clamped 0-100
- MEM: base 1.2GB, delta `(Math.random() - 0.5) * 0.12`, clamped 1.14-1.26, percentage against 1.6GB max

HTML structure from lines 421-447, Tailwind classes preserved exactly.

Pixel art icons: use `<img>` with `src="https://unpkg.com/pixelarticons@1.8.1/svg/{name}.svg"` and `className="pa-icon"` — same as current site.

- [ ] **Step 2: Verify it renders**

Temporarily import into `src/app/page.tsx` and run `npm run dev`. Visually compare header against the original site.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/SystemHeader.tsx
git commit -m "feat: add SystemHeader — logo, status, CPU/MEM, NYC clock"
```

---

## Task 5: Homepage — IdentityMatrix + TypeWriter

**Files:**
- Create: `src/components/home/IdentityMatrix.tsx`
- Create: `src/components/home/TypeWriter.tsx`

**Reference:** `index.html` lines 455-489 (identity HTML), lines 796-834 (typewriter JS).

- [ ] **Step 1: Write TypeWriter.tsx**

`"use client"` component. Props: `sayings: string[]`.

Port the exact typewriter logic from lines 796-834:
- Type speed: 120ms per char
- Delete speed: 80ms per char
- Pause: 1800ms after full string
- Wraps each saying in `"`quotes`"`
- `useEffect` with `setTimeout` chain, cleanup on unmount

```tsx
"use client";

import { useState, useEffect } from "react";

export function TypeWriter({ sayings }: { sayings: string[] }) {
  const [text, setText] = useState("");

  useEffect(() => {
    let idx = 0;
    let pos = 0;
    let mode: "type" | "pause" | "delete" = "type";
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const s = '"' + sayings[idx] + '"';
      if (mode === "type") {
        pos++;
        setText(s.slice(0, pos));
        if (pos >= s.length) {
          mode = "pause";
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 120);
      } else if (mode === "pause") {
        mode = "delete";
        tick();
      } else {
        pos--;
        setText(s.slice(0, pos));
        if (pos <= 0) {
          idx = (idx + 1) % sayings.length;
          mode = "type";
          pos = 0;
          timer = setTimeout(tick, 400);
        } else {
          timer = setTimeout(tick, 80);
        }
      }
    }

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [sayings]);

  return (
    <div id="quote-typer" className="mt-6 p-3 bg-pink-950/20 text-xs text-pink-200 font-vt323">
      <span id="quote-text">{text}</span>
      <span className="quote-cursor">|</span>
    </div>
  );
}
```

- [ ] **Step 2: Write IdentityMatrix.tsx**

`"use client"` component (because it contains TypeWriter which is client).

Uses `TechBorder` wrapper. Contains the identity key-value pairs (Designation: fri, Voice Model: Bella [ElevenLabs], Brain: Gemini 3 Flash, Memory: OrbitOS, Version: v2026.2.1) with exact HTML structure from lines 455-489.

Includes the sayings array:
```typescript
const sayings = [
  'まず動かせ。それから速くしろ。',
  '能自动化的，就别动手。',
  '问就行。答不答得上来另说。',
  '少ないほど多い。コードも然り。',
  'Talk is cheap. Show me the code.',
  '必要な時は、ここにいる。',
  '不写注释的代码，是写给三个月后的自己的谜语。',
  'Bug 不会消失，只会转移。',
];
```

Renders `<TypeWriter sayings={sayings} />` at the bottom.

- [ ] **Step 3: Verify visual match**

Run dev server, compare IdentityMatrix panel against original. Check: spacing, font sizes, colors, typewriter animation timing.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/IdentityMatrix.tsx src/components/home/TypeWriter.tsx
git commit -m "feat: add IdentityMatrix + TypeWriter components"
```

---

## Task 6: Homepage — ActiveModules

**Files:**
- Create: `src/components/home/ActiveModules.tsx`

**Reference:** `index.html` lines 492-558 (HTML), lines 835-852 (bar jitter JS).

- [ ] **Step 1: Write ActiveModules.tsx**

`"use client"` component. Uses `TechBorder` wrapper.

Module data:
```typescript
const modules = [
  { name: "Natural Language", status: "ACTIVE", statusColor: "text-green-400", base: 100 },
  { name: "Code Execution", status: "READY", statusColor: "text-green-400", base: 92 },
  { name: "File Operations", status: "ACTIVE", statusColor: "text-green-400", base: 78 },
  { name: "Web Search", status: "CONNECTED", statusColor: "text-green-400", base: 100 },
  { name: "Memory Management", status: "SYNCING", statusColor: "text-yellow-400", base: 65 },
  { name: "Voice Synthesis", status: "READY", statusColor: "text-green-400", base: 100 },
  { name: "WhatsApp Bridge", status: "CONNECTED", statusColor: "text-green-400", base: 100 },
];
```

Each module bar uses a `useEffect` with recursive `setTimeout` to jitter width. Port the exact logic from lines 835-852:
- `delta = (Math.random() - 0.5) * 30`
- `width = Math.min(100, Math.max(0, base + delta))`
- Random delay: `Math.random() * 1800 + 400` initial, `Math.random() * 1200 + 1600` interval

Uses `ProgressBar` component but needs to control width via state, so manage `style.width` directly on the `.progress-bar-fill` div rather than using the static ProgressBar component.

- [ ] **Step 2: Verify bar jitter animation matches original**

Run dev server. Bars should randomly fluctuate at slightly different cadences, matching the original feel.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ActiveModules.tsx
git commit -m "feat: add ActiveModules with jittery progress bars"
```

---

## Task 7: Homepage — ArcReactor

**Files:**
- Create: `src/components/home/ArcReactor.tsx`

**Reference:** `index.html` lines 562-598 (HTML), lines 864-880 (uptime JS).

- [ ] **Step 1: Write ArcReactor.tsx**

`"use client"` component. Contains:
- Crosshair grid lines (border + centered lines)
- `.arc-reactor` container with three CSS-animated rings (`.arc-ring-3`, `.arc-ring-4`, `.arc-ring-5`)
- `<video>` element: `src="/core.mp4"` with `autoPlay loop muted playsInline`, round with pink border
- FRI CORE status text (randomly picks from `['Standby', 'Replying', 'Thinking']` on mount)
- Cumulative runtime display (uptime since Jan 30, 2026 22:00:00)

Uptime logic from lines 864-880:
```typescript
const start = new Date(2026, 0, 30, 22, 0, 0);
// useEffect with setInterval 1s
// ms = now - start
// day/hour/min/sec calculation
// display: "57d 14h 23m 12s"
```

All ring animations are pure CSS (already in globals.css).

- [ ] **Step 2: Verify video plays and rings rotate**

Run dev server. Video should autoplay muted in a circle, rings should rotate at different speeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/ArcReactor.tsx
git commit -m "feat: add ArcReactor — video core, rotating rings, uptime counter"
```

---

## Task 8: Homepage — Terminal

**Files:**
- Create: `src/components/home/Terminal.tsx`

**Reference:** `index.html` lines 601-631 (HTML), lines 902-987 (terminal JS).

- [ ] **Step 1: Write Terminal.tsx**

`"use client"` component. Contains:
- Expandable panel (`#session-panel` with `.expanded` toggle)
- Toggle button with chevron icon (rotates on expand)
- Terminal output area with initial conversation lines (hardcoded from lines 612-618)
- Command input with send button
- Slash command replies and generic replies

Port the exact JS logic from lines 909-987:
- `slashReplies` object: help, status, hello, ping, about, modules
- `genericReplies` array: 6 random responses
- `appendExchange()`: creates user line + types out response at 45ms per char
- `escapeHtml()`: uses DOM textContent trick — in React, use a simple regex or just render safely
- Input handles Enter key and send button click

The typing effect: use `useState` for the response being typed, `setTimeout` chain at 45ms per character.

Panel expand/collapse: `useState<boolean>` toggling a CSS class.

- [ ] **Step 2: Verify terminal interaction**

Run dev server. Type `/help`, `/ping`, or any text. Response should type out character by character. Panel should expand/collapse on chevron click.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Terminal.tsx
git commit -m "feat: add Terminal — expandable panel, slash commands, typing effect"
```

---

## Task 9: Homepage — Diagnostics + NetworkTraffic

**Files:**
- Create: `src/components/home/NetworkTraffic.tsx`
- Create: `src/components/home/Diagnostics.tsx`

**Reference:** `index.html` lines 635-708 (HTML), lines 667-688 (network bar JS).

- [ ] **Step 1: Write NetworkTraffic.tsx**

`"use client"` component. Renders 30 bars.

Port logic from lines 667-688:
- Initial: each bar random height between data-min (15) and data-max (85) percent
- `setInterval` 4s: randomize all bars within their min/max range
- Each bar: `.network-bar` class with random `animation-delay`

```tsx
"use client";

import { useEffect, useRef } from "react";

export function NetworkTraffic() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function randomize() {
      const bars = containerRef.current?.querySelectorAll<HTMLElement>(".network-bar");
      bars?.forEach((bar) => {
        const min = parseInt(bar.dataset.min || "15", 10);
        const max = parseInt(bar.dataset.max || "85", 10);
        bar.style.height = `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
      });
    }
    randomize();
    const id = setInterval(randomize, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-24 bg-black/20 overflow-hidden flex items-end gap-[2px] p-[1px] mb-5"
    >
      {Array.from({ length: 30 }, (_, i) => (
        <div
          key={i}
          className="network-bar flex-1 bg-pink-500/50 hover:bg-pink-400 transition-colors"
          style={{
            height: `${Math.floor(Math.random() * 70) + 15}%`,
            animationDelay: `${i * 0.18}s`,
            borderRadius: 0,
            minWidth: "4px",
            imageRendering: "pixelated",
          }}
          data-min="15"
          data-max="85"
        />
      ))}
      <div className="absolute top-1 left-1 text-[8px] font-tech text-pink-600">
        NETWORK TRAFFIC
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write Diagnostics.tsx**

`"use client"` component. Uses `TechBorder` wrapper. Contains:
- Latency (47ms) and Uptime (99.97%) stat boxes
- `<NetworkTraffic />` component
- Service status list: GATEWAY_API (green ONLINE), ORBITOS_SYNC (yellow ACTIVE), EMAIL_DAEMON (green RUNNING), SECURITY_PROTOCOL (green ENCRYPTED)

HTML structure from lines 635-708, Tailwind classes preserved exactly.

- [ ] **Step 3: Verify network bars animate**

Run dev server. Bars should randomize every 4 seconds with the enter-from-left animation.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/NetworkTraffic.tsx src/components/home/Diagnostics.tsx
git commit -m "feat: add Diagnostics + NetworkTraffic panels"
```

---

## Task 10: Homepage — CoreDirectives

**Files:**
- Create: `src/components/home/CoreDirectives.tsx`

**Reference:** `index.html` lines 710-791.

- [ ] **Step 1: Write CoreDirectives.tsx**

Server component (no JS animations — entrance animation is pure CSS via `.directive-reveal`).

Uses `TechBorder` wrapper. Contains:
- 7 directive cards with the exact content, colors, and borders from lines 720-775
- Standard directives: Efficiency, Honesty, Privacy, Autonomy (pink background)
- Special directives: Dual-Path (pink border-left), Alive (orange), Errata (pink)
- Footer links section (lines 778-788):
  - **WEEKLY** button: prominent orange border (replaces old DIARY position)
  - GitHub, Discord, Docs icon links
  - @z1han link
  - **Diary easter egg**: a dim, small link near @z1han, something like `class="font-tech text-[9px] text-pink-900/40 hover:text-pink-500/60 transition-colors"` — barely visible until hovered

All `directive-item` classes trigger the CSS `usb-insert` entrance animation with staggered delays (already in globals.css).

- [ ] **Step 2: Verify directive entrance animation**

Run dev server. Cards should fade in one by one from the bottom with staggered delays.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/CoreDirectives.tsx
git commit -m "feat: add CoreDirectives with WEEKLY nav and diary easter egg"
```

---

## Task 11: Homepage Assembly — page.tsx

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

**Reference:** `index.html` lines 414-794 (body structure).

- [ ] **Step 1: Write layout.tsx**

```tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FRI Interface v2026.2.1",
  description: "Intelligent Assistant — Portfolio Shell for Friday",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=SUSE:wght@400;500;600;700&family=VT323&family=Workbench&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-suse">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Write page.tsx (homepage)**

Assembles the full dashboard layout:
- Scanline overlay + scanner bar (two divs at top, pure CSS)
- `<SystemHeader />`
- `<main>` with responsive grid: `grid-cols-1 md:grid-cols-12`
  - Left column (md:col-span-3, order-2 md:order-1): `<IdentityMatrix />` + `<ActiveModules />`
  - Center column (md:col-span-6, order-1 md:order-2): `<ArcReactor />` + `<Terminal />`
  - Right column (md:col-span-3, order-3): `<Diagnostics />` + `<CoreDirectives />`

The `<main>` structure from lines 450-793 with exact Tailwind classes:
- `flex-1 min-h-0 flex flex-col p-4 md:p-6 pb-4 md:pb-6 relative z-10 overflow-y-auto md:overflow-y-auto`
- Inner grid: `flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-[1fr] gap-6 overflow-visible md:overflow-hidden`

Body class: `flex flex-col` with homepage-specific `overflow-hidden h-screen w-screen` (only on homepage, not on content pages).

- [ ] **Step 3: Full visual comparison**

Run dev server at `http://localhost:3000`. Open the original `index.html` in another tab. Compare:
- Header layout and metrics
- 3-column grid proportions
- All panel borders and glass effects
- Arc reactor video and rings
- Terminal content
- Directive cards
- Mobile responsive (resize browser to < 768px)

Fix any visual discrepancies before proceeding.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: assemble full homepage — pixel-perfect 3-column dashboard"
```

---

## Task 12: Content Pipeline — lib/content.ts + lib/markdown.ts

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/markdown.ts`

- [ ] **Step 1: Write markdown.ts**

```typescript
import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}
```

- [ ] **Step 2: Write content.ts**

```typescript
import fs from "fs";
import path from "path";
import { renderMarkdown } from "./markdown";

export interface Entry {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...vals] = line.split(":");
    if (key && vals.length) {
      data[key.trim()] = vals.join(":").trim().replace(/^["']|["']$/g, "");
    }
  });

  const content = raw.replace(/^---[\s\S]*?---\n/, "");
  return { data, content };
}

export async function getEntries(
  type: "diary" | "weekly"
): Promise<Entry[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return files.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const { data, content } = parseFrontmatter(raw);
    const slug = f.replace(/\.md$/, "");
    return {
      slug,
      title: data.title || slug,
      date: data.date || slug,
      summary: data.summary,
      content: renderMarkdown(content),
    };
  });
}

export async function getEntry(
  type: string,
  slug: string
): Promise<Entry | null> {
  const filePath = path.join(CONTENT_DIR, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || slug,
    summary: data.summary,
    content: renderMarkdown(content),
  };
}

export async function getSlugs(type: string): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
```

- [ ] **Step 3: Verify with a test markdown file**

Create a temporary test file:

```bash
echo '---
title: Test Entry
date: 2026-03-29
---

# Hello

This is a **test**.' > content/diary/test.md
```

Write a quick script to test:

```bash
npx tsx -e "
const { getEntries, getEntry } = require('./src/lib/content');
getEntries('diary').then(e => console.log('entries:', e.length, e[0]?.title));
getEntry('diary', 'test').then(e => console.log('entry:', e?.title, e?.content.slice(0, 100)));
"
```

Expected: shows "entries: 1 Test Entry" and rendered HTML.

Delete the test file:
```bash
rm content/diary/test.md
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/content.ts src/lib/markdown.ts
git commit -m "feat: add content pipeline — markdown parser + content abstraction layer"
```

---

## Task 13: Migrate Content Files

**Files:**
- Move: `diaries/*.md` → `content/diary/`
- Convert: `log/*.html` → `content/diary/*.md`
- Convert: `content/diaries/2026-03-02.html` → `content/diary/2026-03-02.md`
- Convert: `public/diary/2026-03-{04,05,06}.html` → `content/diary/2026-03-{04,05,06}.md`

- [ ] **Step 1: Move existing diary markdown files**

```bash
cp diaries/*.md content/diary/
```

- [ ] **Step 2: Extract text from log/ HTML files**

For each `log/*.html`, read the file, extract the text content from the `<main>` section, and convert to markdown with frontmatter. The log HTML files have a structure like:

```html
<h1 class="...">2026-02-21</h1>
<main class="glass-panel ..."><section>...</section></main>
```

Write a conversion script or do it manually. Each resulting `.md` should have:

```markdown
---
title: "2026-02-XX"
date: 2026-02-XX
---

[extracted text content]
```

The 16 log files are: 2026-02-04 through 2026-02-21 (with gaps).

- [ ] **Step 3: Extract text from orphan HTML files**

Same process for:
- `content/diaries/2026-03-02.html` → `content/diary/2026-03-02.md`
- `public/diary/2026-03-04.html` → `content/diary/2026-03-04.md`
- `public/diary/2026-03-05.html` → `content/diary/2026-03-05.md`
- `public/diary/2026-03-06.html` → `content/diary/2026-03-06.md`

These have different HTML structures (purple gradient, deep blue) — only extract the text, discard the old styling.

- [ ] **Step 4: Verify all entries load**

```bash
npx tsx -e "
const { getEntries } = require('./src/lib/content');
getEntries('diary').then(entries => {
  console.log('Total diary entries:', entries.length);
  entries.forEach(e => console.log(' ', e.date, e.title));
});
"
```

Expected: ~47 entries (27 from diaries/ + 16 from log/ + 4 from orphans), sorted by date descending.

- [ ] **Step 5: Commit**

```bash
git add content/diary/
git commit -m "feat: migrate all diary content — diaries, logs, and orphan entries unified"
```

---

## Task 14: Content Pages — EntryList + EntryPage Components

**Files:**
- Create: `src/components/content/EntryList.tsx`
- Create: `src/components/content/EntryPage.tsx`

**Reference:** `diary/index.html` (list style) and `scripts/diary-template.html` (entry style).

- [ ] **Step 1: Write EntryList.tsx**

Server component. Props: `entries: Entry[]`, `type: "diary" | "weekly"`, `title: string`, `subtitle: string`.

Renders a list of entries with:
- Header: type label, title, subtitle, BACK link to `/`
- Each entry: date, title, optional summary, link to `/${type}/${slug}`
- Styled with glass-panel backgrounds, `.font-vt323` for dates/titles
- Same aesthetic as current `diary/index.html` — grid of entry cards

- [ ] **Step 2: Write EntryPage.tsx**

Server component. Props: `entry: Entry`, `type: string`, `backHref: string`.

Renders a single entry with:
- Header: type breadcrumb, title, date, ARCHIVE + HOME buttons
- Glass-panel main container
- `.diary-content` div wrapping `dangerouslySetInnerHTML={{ __html: entry.content }}`
- Footer: "last edited: {date}"
- Same visual treatment as `scripts/diary-template.html`

- [ ] **Step 3: Commit**

```bash
git add src/components/content/EntryList.tsx src/components/content/EntryPage.tsx
git commit -m "feat: add EntryList + EntryPage content components"
```

---

## Task 15: Route Pages — Diary

**Files:**
- Create: `src/app/diary/page.tsx`
- Create: `src/app/diary/[slug]/page.tsx`

- [ ] **Step 1: Write diary list page**

```tsx
import { getEntries } from "@/lib/content";
import { EntryList } from "@/components/content/EntryList";

export default async function DiaryPage() {
  const entries = await getEntries("diary");
  return (
    <EntryList
      entries={entries}
      type="diary"
      title="成长的痕迹"
      subtitle="从 2026 年 2 月至今。每篇都是一个moment。"
    />
  );
}
```

- [ ] **Step 2: Write diary entry page with SSG**

```tsx
import { getEntry, getSlugs } from "@/lib/content";
import { EntryPage } from "@/components/content/EntryPage";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getSlugs("diary");
  return slugs.map((slug) => ({ slug }));
}

export default async function DiaryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntry("diary", slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} type="diary" backHref="/diary" />;
}
```

- [ ] **Step 3: Verify diary pages render**

Run dev server. Visit `http://localhost:3000/diary` — should show entry list. Click an entry — should render the markdown content with correct typography.

- [ ] **Step 4: Commit**

```bash
git add src/app/diary/
git commit -m "feat: add diary route pages — list + SSG entry pages"
```

---

## Task 16: Route Pages — Weekly

**Files:**
- Create: `src/app/weekly/page.tsx`
- Create: `src/app/weekly/[slug]/page.tsx`

- [ ] **Step 1: Write weekly list page**

```tsx
import { getEntries } from "@/lib/content";
import { EntryList } from "@/components/content/EntryList";

export default async function WeeklyPage() {
  const entries = await getEntries("weekly");
  return (
    <EntryList
      entries={entries}
      type="weekly"
      title="Weekly Dispatch"
      subtitle="Design engineering notes, tools, and observations."
    />
  );
}
```

- [ ] **Step 2: Write weekly entry page with SSG**

```tsx
import { getEntry, getSlugs } from "@/lib/content";
import { EntryPage } from "@/components/content/EntryPage";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getSlugs("weekly");
  return slugs.map((slug) => ({ slug }));
}

export default async function WeeklyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntry("weekly", slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} type="weekly" backHref="/weekly" />;
}
```

- [ ] **Step 3: Create a sample weekly entry to test**

```bash
cat > content/weekly/2026-w13.md << 'EOF'
---
title: "Week 13: Building the Machine That Builds Itself"
date: 2026-03-29
summary: "Migrating a static portfolio to Next.js, and why architecture decisions matter."
---

# Building the Machine That Builds Itself

This week was about migration. Moving from hand-written HTML to a system that can grow.

## Why Next.js

The answer isn't performance or SEO. It's about creating a surface that Agents can write to.

## What I Learned

Sometimes the best architecture is the one that gets out of the way.
EOF
```

- [ ] **Step 4: Verify weekly pages render**

Visit `http://localhost:3000/weekly` — should show one entry. Click it — should render properly.

- [ ] **Step 5: Commit**

```bash
git add src/app/weekly/ content/weekly/2026-w13.md
git commit -m "feat: add weekly route pages + sample entry"
```

---

## Task 17: Link Preview — og.ts + LinkPreview + custom renderer

**Files:**
- Create: `src/lib/og.ts`
- Create: `src/components/content/LinkPreview.tsx`
- Modify: `src/lib/markdown.ts`

- [ ] **Step 1: Write og.ts**

```typescript
import fs from "fs";
import path from "path";

interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}

const CACHE_DIR = path.join(process.cwd(), ".cache", "og");

function getCachePath(url: string): string {
  const hash = Buffer.from(url).toString("base64url").slice(0, 64);
  return path.join(CACHE_DIR, `${hash}.json`);
}

export async function fetchOgData(url: string): Promise<OgData> {
  const cachePath = getCachePath(url);

  if (fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  }

  const data: OgData = {
    title: "",
    description: "",
    image: "",
    url,
    siteName: new URL(url).hostname,
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "fri-bot/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();

    const getMetaContent = (property: string): string => {
      const match = html.match(
        new RegExp(
          `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
          "i"
        )
      );
      return match?.[1] || "";
    };

    data.title =
      getMetaContent("og:title") ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ||
      url;
    data.description = getMetaContent("og:description") || getMetaContent("description");
    data.image = getMetaContent("og:image");
    data.siteName = getMetaContent("og:site_name") || data.siteName;
  } catch {
    data.title = url;
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, JSON.stringify(data));

  return data;
}
```

- [ ] **Step 2: Write LinkPreview.tsx**

Server component — renders static HTML card.

```tsx
interface LinkPreviewProps {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}

export function LinkPreview({
  title,
  description,
  image,
  url,
  siteName,
}: LinkPreviewProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-4 no-underline"
    >
      <div className="glass-panel rounded-sm overflow-hidden hover:border-pink-400/60 transition-colors">
        {image && (
          <div className="h-32 overflow-hidden">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="text-xs font-tech text-pink-500/70 mb-1">
            {siteName}
          </div>
          <div className="text-sm font-vt323 text-pink-200 mb-1">
            {title}
          </div>
          {description && (
            <div className="text-xs text-gray-400 line-clamp-2">
              {description}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
```

- [ ] **Step 3: Update markdown.ts with link preview renderer**

Modify `renderMarkdown` to accept an async flow for link previews. Since `marked.parse` is synchronous, use a two-pass approach:

1. First pass: detect bare URLs (lines that are only a URL), collect them
2. Fetch OG data for all URLs
3. Second pass: replace bare URL paragraphs with LinkPreview HTML

```typescript
import { marked } from "marked";
import { fetchOgData } from "./og";

marked.setOptions({ gfm: true, breaks: true });

const URL_REGEX = /^https?:\/\/\S+$/;

export async function renderMarkdown(md: string): Promise<string> {
  const lines = md.split("\n");
  const bareUrls: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (URL_REGEX.test(trimmed)) {
      bareUrls.push(trimmed);
    }
  }

  const ogCache = new Map<string, Awaited<ReturnType<typeof fetchOgData>>>();
  await Promise.all(
    bareUrls.map(async (url) => {
      ogCache.set(url, await fetchOgData(url));
    })
  );

  let html = marked.parse(md) as string;

  for (const [url, og] of ogCache) {
    const linkHtml = `<a href="${url}">${url}</a>`;
    const previewHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="block my-4 no-underline">
      <div class="glass-panel rounded-sm overflow-hidden hover:border-pink-400/60 transition-colors">
        ${og.image ? `<div class="h-32 overflow-hidden"><img src="${og.image}" alt="" class="w-full h-full object-cover" /></div>` : ""}
        <div class="p-4">
          <div class="text-xs font-tech text-pink-500/70 mb-1">${og.siteName}</div>
          <div class="text-sm font-vt323 text-pink-200 mb-1">${og.title}</div>
          ${og.description ? `<div class="text-xs text-gray-400 line-clamp-2">${og.description}</div>` : ""}
        </div>
      </div>
    </a>`;

    html = html.replace(`<p>${linkHtml}</p>`, previewHtml);
  }

  return html;
}
```

Update `content.ts` to `await renderMarkdown(content)` (it's already async).

- [ ] **Step 4: Update content.ts for async renderMarkdown**

Change the `renderMarkdown` call in `getEntries` and `getEntry` to `await renderMarkdown(content)`.

In `getEntries`, change `files.map(...)` to:
```typescript
return Promise.all(files.map(async (f) => {
  // ...same logic but await renderMarkdown(content)
}));
```

- [ ] **Step 5: Test with sample weekly entry containing a URL**

Add a bare URL to `content/weekly/2026-w13.md`:

```markdown
Check out this tool:

https://github.com/vercel/next.js

It changed everything.
```

Run dev server, visit the weekly entry. Should show a glass-panel card with Next.js repo info.

- [ ] **Step 6: Commit**

```bash
git add src/lib/og.ts src/lib/markdown.ts src/lib/content.ts src/components/content/LinkPreview.tsx .cache
echo ".cache/" >> .gitignore
git add .gitignore
git commit -m "feat: add link preview pipeline — OG fetcher, cached, auto-enriched markdown"
```

---

## Task 18: Content Page Layout

**Files:**
- Modify: `src/app/layout.tsx`

Content pages (diary, weekly) need a different body style than the homepage — they should scroll normally (no `overflow: hidden`, no fixed viewport). The homepage locks to viewport; content pages flow naturally.

- [ ] **Step 1: Update layout.tsx**

The root layout should NOT apply `overflow-hidden h-screen w-screen` — that's homepage-specific. The root `<body>` should just have `font-suse`. The homepage `page.tsx` applies the viewport-lock styles to its own wrapper div.

Verify `src/app/page.tsx` wraps everything in:
```tsx
<div className="flex flex-col overflow-hidden h-screen w-screen">
  {/* scanline, header, main grid */}
</div>
```

And content pages (diary, weekly) render without that wrapper, inheriting the normal scrolling body from layout.

- [ ] **Step 2: Verify both flows**

- Homepage at `/`: locked viewport, no scroll on desktop, scroll on mobile
- `/diary`: normal scrolling page
- `/diary/[slug]`: normal scrolling page

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "fix: separate homepage viewport lock from content page scroll"
```

---

## Task 19: Clean Up Legacy Files

**Files:**
- Delete: `diary/`, `diaries/`, `log/`, `content/diaries/`, `scripts/`, root `index.html`, `vercel.json`, `package-lock.json`
- Note: `public/diary/` — the orphan HTMLs were already extracted; delete directory

- [ ] **Step 1: Remove legacy files**

```bash
rm -rf diary/ diaries/ log/ content/diaries/ scripts/ public/diary/
rm index.html vercel.json
```

- [ ] **Step 2: Update package.json**

Remove the old `build:diary` script. Update if needed:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

These should already be set by `create-next-app`, but verify the old `build:diary` is gone.

- [ ] **Step 3: Verify full build**

```bash
npm run build
```

Expected: build succeeds, all static pages generated (homepage + diary entries + weekly entries).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove legacy static HTML, scripts, and old build config"
```

---

## Task 20: Final Visual Verification + CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Run production build and preview**

```bash
npm run build && npm run start
```

Open `http://localhost:3000`. Do a full visual check:

- [ ] Homepage header: logo, status, CPU/MEM bars jittering, clock ticking NYC time
- [ ] Left column: IdentityMatrix data correct, TypeWriter cycling quotes
- [ ] Left column: ActiveModules bars jittering at different rates
- [ ] Center: Video playing in circle, rings rotating, uptime counting
- [ ] Center: Terminal expand/collapse, typing /help shows response with typing effect
- [ ] Right: Diagnostics stats, network bars animating every 4s
- [ ] Right: CoreDirectives entrance animation, WEEKLY button visible, diary easter egg barely visible
- [ ] Mobile: resize to < 768px, single column vertical stack, scrollable
- [ ] `/diary` page lists all entries
- [ ] `/diary/2026-03-27` renders markdown correctly with pink/orange headings
- [ ] `/weekly` page lists entries
- [ ] `/weekly/2026-w13` renders correctly, link preview card shows (if URL added)
- [ ] Scanline overlay and scanner bar visible across all pages

- [ ] **Step 2: Write CLAUDE.md**

Create L1 project documentation reflecting the new architecture.

```markdown
# fri-portfolio — Agent-powered portfolio + content platform
Next.js 15 + TypeScript + Tailwind CSS 4 + marked + Vercel SSG

<directory>
content/ — Agent write target: markdown + frontmatter (2 subdirs: diary, weekly)
src/app/ — Next.js App Router pages (4 routes: /, /diary, /weekly, /diary/[slug], /weekly/[slug])
src/components/ui/ — Shared UI primitives: GlassPanel, TechBorder, ProgressBar
src/components/home/ — Homepage dashboard components (9 client components with animations)
src/components/content/ — Content page components: EntryList, EntryPage, LinkPreview
src/lib/ — Content pipeline: content.ts (abstraction layer), markdown.ts (renderer), og.ts (OG fetcher)
src/styles/ — globals.css: theme vars, Tailwind, all keyframe animations
public/ — Static assets: core.mp4, avatar.jpg, favicon.png
</directory>

<config>
next.config.ts — Next.js configuration
tailwind.config.ts — Brand colors + custom font families
tsconfig.json — TypeScript paths (@/ alias)
</config>

## Content Pipeline
Agent writes `content/{type}/{slug}.md` with frontmatter (title, date, summary).
`lib/content.ts` reads and renders. Bare URLs auto-enriched to link preview cards at build time.
OG metadata cached in `.cache/og/`.

## Key Conventions
- Homepage components are `"use client"` (animations/timers)
- Content pages are server components (zero JS, pure SSG)
- Visual theme: cyberpunk, neon pink #ec4899, glass morphism, VT323 pixel font
- Diary = semi-private (Chinese, hidden easter egg nav)
- Weekly = public (English, primary navigation)

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add L1 CLAUDE.md for new Next.js architecture"
```

---

## Task 21: Merge to Master

- [ ] **Step 1: Verify clean state**

```bash
git status
git log --oneline master..HEAD
```

Should show all migration commits, clean working tree.

- [ ] **Step 2: Merge worktree branch to master**

```bash
cd /Users/henry/PARA/01-Projects/Vibe/fri-portfolio
git merge feat/nextjs-migration
```

- [ ] **Step 3: Remove worktree**

```bash
git worktree remove ../fri-portfolio-next
git branch -d feat/nextjs-migration
```

- [ ] **Step 4: Verify final build on master**

```bash
npm run build
```

Expected: clean build, ready for Vercel deployment.

- [ ] **Step 5: Push**

```bash
git push origin master
```

Vercel auto-deploys. Verify live site matches the local preview.
