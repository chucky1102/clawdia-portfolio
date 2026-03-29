# components/home/
> L2 | Parent: src/components/CLAUDE.md

Homepage client components — stateful UI with timers, animations, and live data.

## Members

SystemHeader.tsx: Top bar — logo (Workbench font), status dot, CPU/MEM gauges (2.5s jitter), NYC clock (1s tick)
IdentityMatrix.tsx: Top-left identity panel with FRI specs (designation, voice, brain, memory, version) and cycling quote
TypeWriter.tsx: Type/delete animation for quote strings, consumed exclusively by IdentityMatrix
ArcReactor.tsx: Center-column core — circular video with rotating CSS rings, crosshair grid, random status label, 1s uptime counter since 2026-01-30
Diagnostics.tsx: Right-column panel — stat boxes (latency/uptime), network traffic bars, service status list; wraps NetworkTraffic
NetworkTraffic.tsx: Animated bar chart — 30 bars randomized every 4s via setInterval, consumed exclusively by Diagnostics
ActiveModules.tsx: Left-column bottom panel — AI module statuses with jittery progress bars
Terminal.tsx: Center-column bottom panel — expandable session terminal with slash commands, generic replies, and 45ms typing effect

[PROTOCOL]: Update this file on any member change, then check parent CLAUDE.md
