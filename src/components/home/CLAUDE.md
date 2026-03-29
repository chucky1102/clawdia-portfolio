# components/home/
> L2 | Parent: src/components/CLAUDE.md

Homepage client components — stateful UI with timers, animations, and live data.

## Members

SystemHeader.tsx: Top bar — logo (Workbench font), status dot, CPU/MEM gauges (2.5s jitter), NYC clock (1s tick)
IdentityMatrix.tsx: Top-left identity panel with FRI specs (designation, voice, brain, memory, version) and cycling quote
TypeWriter.tsx: Type/delete animation for quote strings, consumed exclusively by IdentityMatrix
ArcReactor.tsx: Center-column core — circular video with rotating CSS rings, crosshair grid, random status label, 1s uptime counter since 2026-01-30

[PROTOCOL]: Update this file on any member change, then check parent CLAUDE.md
