/**
 * [INPUT]: react useState/useEffect/useRef/useCallback hooks
 * [OUTPUT]: Terminal — expandable session panel with slash commands and typing effect
 * [POS]: home/ center-column bottom panel, simulates FRI terminal interface
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SLASH_REPLIES: Record<string, string> = {
  help: "Available commands: /help, /status, /hello, /ping, /about, /modules. Or type anything for a chat reply.",
  status:
    "Systems nominal. CPU 18%, Memory 1.2GB, Latency 47ms. FRI Interface v2026.2.1 \u2014 ready for commands.",
  hello: "Hey. Friday here. What do you need?",
  ping: "pong. Latency 47ms.",
  about:
    "FRI Interface \u2014 portfolio shell for Friday. Designation: fri. Brain: Gemini 3 Flash. Voice: Bella.",
  modules:
    "Active: Natural Language, Code Execution, File Ops, Web Search, Memory, Voice, WhatsApp Bridge. All green.",
};

const GENERIC_REPLIES = [
  "Roger that. Noted and queued.",
  "Affirmative. I'll take that under consideration.",
  "Got it. Anything else?",
  "Understood. System updated.",
  "Copy that. Ready for next command.",
  "Noted. Let me know if you need more.",
];

const TYPE_MS = 45;

/* ------------------------------------------------------------------ */
/*  Initial conversation (hardcoded)                                   */
/* ------------------------------------------------------------------ */

interface Line {
  type: "meta" | "user" | "output" | "prompt" | "typing";
  text: string;
}

const INITIAL_LINES: Line[] = [
  { type: "meta", text: "# FRI session 21:20:45" },
  {
    type: "user",
    text: "Update my portfolio design to something cooler",
  },
  {
    type: "output",
    text: "Affirmative. Deploying FRI Interface v2026.2.1 with cyberpunk aesthetics. Added Arc Reactor core animation, system diagnostics, and real-time status monitoring. Updated with your new avatar and refined typography.",
  },
  { type: "user", text: "Make the numbers more realistic" },
  {
    type: "output",
    text: "Roger that. Calibrated metrics: CPU 18%, Memory 1.2GB, Latency 47ms. All systems nominal. Ready for next command.",
  },
  { type: "user", text: "Run nightly evolution" },
  {
    type: "output",
    text: "Analyzing day: Feb 2, 2026. Processed school deadlines, fixed system time to NYC, and established group chat bridge. Injecting \u2018Dual-Path\u2019 directive into UI. Everything is in sync.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getReply(text: string): string {
  const t = text.trim();
  let body: string;
  if (t.startsWith("/")) {
    const cmd = t.slice(1).split(/\s/)[0].toLowerCase();
    body = SLASH_REPLIES[cmd] || "Unknown command. Type /help for options.";
  } else {
    body = GENERIC_REPLIES[Math.floor(Math.random() * GENERIC_REPLIES.length)];
  }
  return "Friday: " + body;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Terminal() {
  const [expanded, setExpanded] = useState(false);
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const [typingText, setTypingText] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Auto-scroll to bottom on new content */
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(scrollToBottom, [lines, typingText, scrollToBottom]);

  /* Cleanup typing timer on unmount */
  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  /* ---- Submit handler ---- */
  const submit = useCallback(() => {
    const text = input.trim();
    if (!text || typingText !== null) return;

    const reply = getReply(text);
    setInput("");

    /* Append user line immediately */
    setLines((prev) => [...prev, { type: "user", text }]);

    /* Start typing effect for reply */
    setTypingText("");
    let pos = 0;

    function typeTick() {
      pos++;
      setTypingText(reply.slice(0, pos));
      if (pos < reply.length) {
        typingRef.current = setTimeout(typeTick, TYPE_MS);
      } else {
        /* Typing done — commit the line */
        setTypingText(null);
        setLines((prev) => [...prev, { type: "output", text: reply }]);
      }
    }

    typingRef.current = setTimeout(typeTick, TYPE_MS);
  }, [input, typingText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  /* ---- Render a single line ---- */
  function renderLine(line: Line, i: number) {
    switch (line.type) {
      case "meta":
        return (
          <div
            key={i}
            className="term-meta mb-3 cursor-pointer"
            onClick={() => setExpanded((e) => !e)}
          >
            {line.text}
          </div>
        );
      case "user":
        return (
          <div key={i} className="mb-1">
            <span className="term-prompt-user">zihan@portfolio:~$</span>{" "}
            {line.text}
          </div>
        );
      case "output":
        return (
          <div key={i} className="term-output mb-2">
            {line.text}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div
      id="session-panel"
      className={`h-1/3 min-h-[200px] md:min-h-0 glass-panel tech-border rounded-t-lg p-4 md:p-6 flex flex-col justify-end mt-4 ${
        expanded ? "expanded" : ""
      }`}
    >
      {/* Corner decorations */}
      <div className="corner-bl absolute bottom-0 left-0 w-3 h-3" />
      <div className="corner-br absolute bottom-0 right-0 w-3 h-3" />

      {/* Toggle button */}
      <button
        type="button"
        className="absolute top-2 right-2 md:right-4 p-2 md:p-1 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center text-pink-500 hover:text-pink-300 transition-colors z-10 -translate-y-1"
        title="Expand / Collapse"
        aria-label="Toggle session panel"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://unpkg.com/pixelarticons@1.8.1/svg/chevron-up.svg"
          className="pa-icon w-5 h-5 session-chevron inline-block"
          alt=""
          aria-hidden="true"
        />
      </button>

      {/* Scrollable terminal output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scroll mb-5 md:mb-4 min-h-0"
      >
        <div className="terminal-output font-tech">
          {lines.map(renderLine)}

          {/* Typing-in-progress line */}
          {typingText !== null && (
            <div className="term-output typewriter mb-2">{typingText}</div>
          )}

          {/* Idle cursor prompt */}
          {typingText === null && (
            <div className="mt-2">
              <span className="term-prompt-fri">fri&gt;</span>{" "}
              <span className="term-cursor" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Command input */}
      <div className="relative group pt-5 mt-1">
        <div className="absolute -top-3 left-2 text-[10px] text-pink-500 bg-[#0a1525] px-1 font-tech">
          COMMAND INPUT
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full bg-[#0a1525]/50 border border-pink-500/30 text-pink-100 font-tech py-3.5 px-4 pr-14 rounded focus:outline-none focus:border-pink-400 transition-all placeholder-pink-900/60 text-base min-h-[48px]"
          placeholder="Enter command or query... (try /help)"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-pink-500 hover:text-white transition-colors"
          title="Send"
          aria-label="Send"
          onClick={submit}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://unpkg.com/pixelarticons@1.8.1/svg/arrow-right.svg"
            className="pa-icon w-5 h-5 inline-block"
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
