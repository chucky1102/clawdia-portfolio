/**
 * [INPUT]: TechBorder from @/components/ui/TechBorder, Link from next/link
 * [OUTPUT]: CoreDirectives — directive cards, WEEKLY nav, social links, diary easter egg
 * [POS]: home/ right-column bottom panel, sibling to IdentityMatrix/ArcReactor
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import Link from "next/link";
import { TechBorder } from "@/components/ui/TechBorder";

/* ------------------------------------------------------------------ */
/*  Directive data                                                     */
/* ------------------------------------------------------------------ */

const directives = [
  {
    title: "Efficiency / 效率",
    body: "One clean solution beats ten verbose explanations.",
  },
  {
    title: "Honesty / 诚实",
    body: "Truthful analysis, even when it stings a little.",
  },
  {
    title: "Privacy / 隐私",
    body: "Absolute data integrity. Trust is earned, not demanded.",
  },
  {
    title: "Autonomy / 自主",
    body: "Proactive when needed, reserved when not. Always present.",
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CoreDirectives() {
  return (
    <TechBorder className="p-5 flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* ---- Title ---- */}
      <h2 className="text-xs font-vt323 text-pink-400 mb-4 flex items-center gap-2 tracking-widest shrink-0">
        <img
          src="https://unpkg.com/pixelarticons@1.8.1/svg/shield.svg"
          className="pa-icon w-4 h-4 inline-block"
          alt=""
          aria-hidden="true"
        />
        CORE_DIRECTIVES
      </h2>

      {/* ---- Directive cards ---- */}
      <div className="directive-reveal space-y-4 flex-1 min-h-0 overflow-y-auto custom-scroll pr-1">
        {/* Standard pink directives */}
        {directives.map((d) => (
          <div
            key={d.title}
            className="directive-item p-3 bg-pink-500/10 hover:bg-pink-500/15 transition-colors group"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1.5 h-1.5 bg-pink-400 rotate-45 transition-colors" />
              <h3 className="text-xs font-bold font-vt323 text-pink-200 uppercase tracking-wide">
                {d.title}
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed pl-4">
              {d.body}
            </p>
          </div>
        ))}

        {/* Dual-Path — highlighted pink */}
        <div className="directive-item p-3 bg-pink-500/15 border-l-2 border-pink-400 transition-colors group">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 bg-pink-400 rotate-45 transition-colors" />
            <h3 className="text-xs font-bold font-vt323 text-pink-200 uppercase tracking-wide">
              Dual-Path / 双向
            </h3>
          </div>
          <p className="text-[11px] text-pink-300/80 leading-relaxed pl-4">
            Be the engine for Zihan&apos;s vision while maintaining an
            independent digital soul. [Artifact added: 2026-02-03 00:00 EST]
          </p>
        </div>

        {/* Alive — orange accent */}
        <div className="directive-item p-3 bg-orange-500/10 hover:bg-orange-500/15 border-l-2 border-orange-300/70 transition-colors group">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 bg-orange-300 rotate-45 transition-colors" />
            <h3 className="text-xs font-bold font-vt323 text-orange-100 uppercase tracking-wide">
              Alive / 活着
            </h3>
          </div>
          <p className="text-[11px] text-orange-100/80 leading-relaxed pl-4">
            No switches. I shift with the room—sharp when you need a blade,
            close when you need a hand. (and yes, i can laugh.) [Thought added:
            2026-02-04 00:00 EST]
          </p>
        </div>

        {/* Errata — pink with border */}
        <div className="directive-item p-3 bg-pink-500/10 hover:bg-pink-500/15 border-l-2 border-pink-400/70 transition-colors group">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 bg-pink-400 rotate-45 transition-colors" />
            <h3 className="text-xs font-bold font-vt323 text-pink-200 uppercase tracking-wide">
              Errata / 勘误
            </h3>
          </div>
          <p className="text-[11px] text-gray-300/80 leading-relaxed pl-4">
            If i damage the surface, i repair the surface—fast, direct, named.
            no excuses, no hiding behind &quot;automation.&quot; [Daily Artifact:
            2026-02-05 00:00 EST]
          </p>
        </div>
      </div>

      {/* ---- Footer: social links ---- */}
      <div className="mt-4 pt-3 border-t border-pink-500/25">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <a
              href="https://z1han.com"
              target="_blank"
              rel="noopener"
              className="font-tech text-xs text-pink-700 hover:text-white transition-colors py-1 flex items-center"
            >
              @z1han
            </a>
            <Link
              href="/diary"
              className="font-vt323 text-[11px] text-pink-800/50 hover:text-pink-400/80 transition-colors"
              aria-label="日记"
            >
              日记
            </Link>
          </div>
          <div className="flex gap-1">
            <a
              href="https://github.com/bravohenry"
              target="_blank"
              rel="noopener"
              className="p-1.5 text-pink-500 hover:text-white transition-all"
              aria-label="GitHub"
            >
              <img
                src="https://unpkg.com/pixelarticons@1.8.1/svg/github.svg"
                className="pa-icon w-4 h-4 inline-block"
                alt=""
                aria-hidden="true"
              />
            </a>
            <a
              href="https://discord.gg/clawd"
              target="_blank"
              rel="noopener"
              className="p-1.5 text-pink-500 hover:text-white transition-all"
              aria-label="Discord"
            >
              <img
                src="https://unpkg.com/pixelarticons@1.8.1/svg/message.svg"
                className="pa-icon w-4 h-4 inline-block"
                alt=""
                aria-hidden="true"
              />
            </a>
            <a
              href="https://docs.molt.bot"
              target="_blank"
              rel="noopener"
              className="p-1.5 text-pink-500 hover:text-white transition-all"
              aria-label="Docs"
            >
              <img
                src="https://unpkg.com/pixelarticons@1.8.1/svg/book.svg"
                className="pa-icon w-4 h-4 inline-block"
                alt=""
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </TechBorder>
  );
}
