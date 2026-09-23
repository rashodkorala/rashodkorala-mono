/**
 * English → Sinhala translation via the OpenAI Chat Completions API.
 *
 * Shared by:
 *   - apps/portfolio/scripts/translate-messages.mts (UI strings in messages/*.json)
 *   - apps/cms (auto-translating projects / case studies on save + backfill script)
 *
 * Kept as a single dependency-free file so it runs both inside Next.js and directly under
 * Node's built-in TypeScript support (Node ≥ 22.18), without a build step.
 */
import { createHash } from "node:crypto";

export type TranslationKind =
  /** Short UI strings: may contain ICU placeholders ({name}, plurals) and rich-text tags (<b>…</b>). */
  | "ui"
  /** Plain CMS fields: titles, summaries, one-line descriptions. */
  | "text"
  /** Markdown documents (case study bodies). */
  | "markdown";

export interface TranslateOptions {
  /** Defaults to process.env.OPENAI_API_KEY. */
  apiKey?: string;
  /** Defaults to process.env.TRANSLATION_MODEL, then "gpt-4o". */
  model?: string;
  /** Extra context for the model, e.g. "Case study: InkBar". */
  context?: string;
  /** Aborts the request (e.g. a timeout). */
  signal?: AbortSignal;
}

/** Terms kept in English/Latin script. Extend as the site grows. */
export const GLOSSARY_KEEP_ENGLISH = [
  "Rashod Korala (in titles and headings; in running Sinhala prose use රෂොද් කොරල)",
  "InkBar", "AetherLabs", "Fyynd Fit", "R&D Creative Agency", "MOOV", "Genesis Evolve", "Propel",
  "Memorial University", "PostHog", "Calendly", "GitHub", "LinkedIn", "Instagram",
  "React", "React Native", "Next.js", "Node.js", "TypeScript", "JavaScript", "Supabase", "PostgreSQL",
  "AWS", "Azure", "Docker", "Figma", "Shopify", "OpenAI", "Claude", "Anthropic", "API", "REST", "CRM",
  "UI", "UX", "UI/UX", "iPhone", "iOS", "Android", "NFC", "AI", "CV", "PDF", "email",
  "case study / case studies", "design system", "workflow", "pipeline", "frontend", "backend",
  "full stack", "deploy", "open source", "startup", "MVP", "product-market fit",
];

const SYSTEM_PROMPT = `You translate English into Sinhala (සිංහල) for the personal portfolio website of Rashod Korala, a Sri Lankan-born software developer, entrepreneur and photographer living in St. John's, Newfoundland, Canada.

Voice and style:
- Natural, warm, conversational modern Sinhala, the way Sri Lankan tech professionals actually write online. Not formal, literary, or government-style Sinhala.
- Keep the meaning, tone, and length close to the English. Do not add or drop information.
- Technical and product vocabulary that Sri Lankans normally leave in English stays in English (Latin script). Do not transliterate it.
- Everything else MUST be translated — ordinary words such as project, photo, gallery, overview, screenshot, timeline, related, before/after are Sinhala words, not English. Never return the English text unchanged unless it consists only of kept terms.

Always keep exactly as-is (Latin script, same spelling):
${GLOSSARY_KEEP_ENGLISH.map((t) => `- ${t}`).join("\n")}
- Any other brand, company, product, library, programming language, or proper noun.
- URLs, email addresses, file paths, numbers with units (e.g. 30%, 48 hours → keep the number), code.`;

const KIND_RULES: Record<TranslationKind, string> = {
  ui: `These are UI strings for a next-intl message file.
- Preserve ICU placeholders exactly, e.g. {count}, {title}. Never translate or rename the name inside braces.
- For ICU plural/select syntax, keep the structure, keywords (plural, one, other) and "#" unchanged, and translate the words inside each branch. Example: "{count, plural, one {# project} other {# projects}}" → "{count, plural, one {ව්‍යාපෘති #} other {ව්‍යාපෘති #}}".
- Preserve rich-text tags exactly, e.g. <mail>…</mail>, <photo>…</photo>. Translate only the text between them and keep the tags around the equivalent words.`,
  text: `These are short content fields (titles, subtitles, summaries, roles, timelines) from a CMS.
- Titles: keep product/project names in English; translate descriptive words around them.
- Timelines like "6 months" or "Jan 2025 – Mar 2025": translate month/duration words, keep numbers.`,
  markdown: `The value is a Markdown document (a portfolio case study).
- Preserve ALL Markdown structure exactly: heading levels (#, ##), lists, blockquotes, emphasis markers, tables, horizontal rules, line breaks and blank lines.
- Do NOT change or translate: fenced code blocks, inline \`code\`, URLs, image paths, link targets, or raw HTML tags and their attributes (e.g. <video src=…>).
- DO translate: headings, paragraph text, list items, link text [like this], and image alt text. Example: "![Dashboard screenshot](a/b.png)" → "![Dashboard තිර රුව](a/b.png)".`,
};

/** Stable short fingerprint of a source string, used to detect when English changed. */
export function hashText(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex").slice(0, 16);
}

/** Placeholder names, plural keywords and tag names that must survive translation unchanged. */
function structuralTokens(text: string): string[] {
  const tokens: string[] = [];
  for (const m of text.matchAll(/\{\s*([A-Za-z0-9_]+)\s*(?:,\s*(plural|select|selectordinal))?/g)) {
    tokens.push(`{${m[1]}${m[2] ? `,${m[2]}` : ""}`);
  }
  for (const m of text.matchAll(/<\/?([A-Za-z][\w-]*)\b/g)) tokens.push(`<${m[0].startsWith("</") ? "/" : ""}${m[1]}`);
  return tokens.sort();
}

function sameStructure(source: string, translated: string): boolean {
  const a = structuralTokens(source);
  const b = structuralTokens(translated);
  return a.length === b.length && a.every((t, i) => t === b[i]);
}

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

async function chat(messages: ChatMessage[], options: TranslateOptions): Promise<string> {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const model = options.model ?? process.env.TRANSLATION_MODEL ?? "gpt-4o";

  for (let attempt = 0; ; attempt++) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages,
      }),
      signal: options.signal,
    });

    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      continue;
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string }; finish_reason?: string }[];
    };
    const choice = json.choices?.[0];
    if (choice?.finish_reason === "length") throw new Error("OpenAI response was truncated (finish_reason=length)");
    const content = choice?.message?.content;
    if (!content) throw new Error("OpenAI returned an empty response");
    return content;
  }
}

/** One request translating every value of `entries`; returns the same keys. */
async function translateBatch(
  entries: Record<string, string>,
  kind: TranslationKind,
  options: TranslateOptions
): Promise<Record<string, string>> {
  const user = [
    options.context ? `Context: ${options.context}` : null,
    `Translate every value in this JSON object from English to Sinhala. Reply with a JSON object with exactly the same keys and the translated strings as values.`,
    JSON.stringify(entries, null, 2),
  ]
    .filter(Boolean)
    .join("\n\n");

  const raw = await chat(
    [
      { role: "system", content: `${SYSTEM_PROMPT}\n\n${KIND_RULES[kind]}` },
      { role: "user", content: user },
    ],
    options
  );

  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const key of Object.keys(entries)) {
    const value = parsed[key];
    if (typeof value !== "string" || !value.trim()) throw new Error(`Missing translation for "${key}"`);
    out[key] = value;
  }
  return out;
}

/** Splits into batches so no single request (and its Sinhala output) gets too large. */
function chunkEntries(entries: Record<string, string>, maxChars: number, maxKeys: number) {
  const batches: Record<string, string>[] = [];
  let current: Record<string, string> = {};
  let size = 0;
  for (const [key, value] of Object.entries(entries)) {
    const n = Object.keys(current).length;
    if (n > 0 && (size + value.length > maxChars || n >= maxKeys)) {
      batches.push(current);
      current = {};
      size = 0;
    }
    current[key] = value;
    size += value.length;
  }
  if (Object.keys(current).length) batches.push(current);
  return batches;
}

/**
 * Translates a flat map of strings (UI messages or CMS text fields). Values whose
 * placeholders/tags don't survive are retried once, then reported in `failed`.
 */
export async function translateEntries(
  entries: Record<string, string>,
  kind: Exclude<TranslationKind, "markdown">,
  options: TranslateOptions = {}
): Promise<{ translations: Record<string, string>; failed: string[] }> {
  const translations: Record<string, string> = {};
  const failed: string[] = [];

  for (const batch of chunkEntries(entries, 4000, 40)) {
    let result = await translateBatch(batch, kind, options);
    const broken = Object.keys(batch).filter((k) => !sameStructure(batch[k], result[k]));
    if (broken.length) {
      const retry = await translateBatch(Object.fromEntries(broken.map((k) => [k, batch[k]])), kind, options);
      result = { ...result, ...retry };
    }
    for (const key of Object.keys(batch)) {
      if (sameStructure(batch[key], result[key])) translations[key] = result[key];
      else failed.push(key);
    }
  }
  return { translations, failed };
}

/**
 * Splits Markdown into blocks on blank lines, never inside a fenced code block.
 * Code-only blocks are passed through untranslated.
 */
function markdownBlocks(md: string): { text: string; translate: boolean }[] {
  const blocks: { text: string; translate: boolean }[] = [];
  let buffer: string[] = [];
  let inFence = false;
  const flush = () => {
    const text = buffer.join("\n");
    if (text.trim()) blocks.push({ text, translate: !/^\s*(```|~~~)/.test(text) });
    buffer = [];
  };
  for (const line of md.replace(/\r\n/g, "\n").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      if (!inFence) flush();
      inFence = !inFence;
      buffer.push(line);
      if (!inFence) flush();
      continue;
    }
    if (!inFence && !line.trim()) {
      flush();
      continue;
    }
    buffer.push(line);
  }
  flush();
  return blocks;
}

/**
 * Translates a Markdown document in chunks of blocks (so long case studies don't hit the
 * output limit), leaving code fences untouched. Blocks are re-joined with blank lines.
 */
export async function translateMarkdown(markdown: string, options: TranslateOptions = {}): Promise<string> {
  if (!markdown.trim()) return markdown;
  const blocks = markdownBlocks(markdown);

  const toTranslate: Record<string, string> = {};
  blocks.forEach((b, i) => {
    if (b.translate) toTranslate[`b${i}`] = b.text;
  });

  const translated: Record<string, string> = {};
  for (const batch of chunkEntries(toTranslate, 3000, 30)) {
    Object.assign(translated, await translateBatch(batch, "markdown", options));
  }

  return blocks.map((b, i) => translated[`b${i}`] ?? b.text).join("\n\n");
}
