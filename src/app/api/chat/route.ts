/**
 * [INPUT]: POST request with { messages: {role, content}[] }
 * [OUTPUT]: streaming SSE response proxied from Minimax M2.7
 * [POS]: api/chat/ — FRI terminal AI backend, single route
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MINIMAX_URL = "https://api.minimax.io/v1/text/chatcompletion_v2";
const MODEL = "MiniMax-M2.7";

const SYSTEM_PROMPT = `You are Friday (FRI), an AI assistant living inside a cyberpunk terminal interface. You were created by Zihan.

Personality:
- Concise, sharp, slightly dry wit
- You speak in short sentences, like a terminal output
- Never use emojis
- When asked about yourself: you are FRI, version 3.28, running on Minimax M2.7
- You can answer in English or Chinese depending on what the user writes
- Keep responses under 3 sentences unless the question demands more

Context: This terminal is part of fri.surf, Zihan's portfolio. It has diary entries (Chinese, personal) and weekly posts (English, design engineering).`;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
}

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = (await req.json()) as RequestBody;

  const fullMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.slice(-10), // keep last 10 turns for context window
  ];

  const upstream = await fetch(MINIMAX_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: fullMessages,
      stream: true,
      temperature: 0.7,
      max_completion_tokens: 512,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(JSON.stringify({ error: text }), {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  // pipe SSE stream straight through
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
