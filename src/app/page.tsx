/**
 * [INPUT]:  All home components — SystemHeader, IdentityMatrix, ActiveModules,
 *           ArcReactor, Terminal, Diagnostics, CoreDirectives
 * [OUTPUT]: Viewport-locked 3-column dashboard homepage
 * [POS]:    Root page — assembles the FRI interface grid. Viewport lock lives HERE,
 *           not in layout.tsx, so content pages can scroll normally.
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import { SystemHeader } from "@/components/home/SystemHeader";
import { IdentityMatrix } from "@/components/home/IdentityMatrix";
import { ActiveModules } from "@/components/home/ActiveModules";
import ArcReactor from "@/components/home/ArcReactor";
import { Terminal } from "@/components/home/Terminal";
import { Diagnostics } from "@/components/home/Diagnostics";
import { CoreDirectives } from "@/components/home/CoreDirectives";

export default function Home() {
  return (
    <div className="flex flex-col overflow-hidden h-screen w-screen">
      {/* Scanline CRT overlay */}
      <div className="scanline-overlay" />
      <div className="scanner-bar" />

      {/* Header */}
      <SystemHeader />

      {/* Main 3-column grid */}
      <main className="flex-1 min-h-0 flex flex-col p-4 md:p-6 pb-4 md:pb-6 relative z-10 overflow-y-auto md:overflow-y-auto">
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-[1fr] gap-6 overflow-visible md:overflow-hidden mobile-column-layout">

          {/* Left column — identity + modules */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-6 min-h-0 order-2 md:order-1">
            <IdentityMatrix />
            <ActiveModules />
          </div>

          {/* Center column — arc reactor + terminal */}
          <div
            id="session-column"
            className="col-span-12 md:col-span-6 flex flex-col min-h-0 relative order-1 md:order-2"
          >
            <ArcReactor />
            <Terminal />
          </div>

          {/* Right column — diagnostics + directives */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-6 min-h-0 order-3">
            <Diagnostics />
            <CoreDirectives />
          </div>

        </div>
      </main>
    </div>
  );
}
