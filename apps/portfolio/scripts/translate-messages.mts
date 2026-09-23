/**
 * Keeps messages/si.json in sync with messages/en.json.
 *
 *   pnpm translate                 translate new + changed English strings
 *   pnpm translate --dry-run       list what would be translated, no API calls
 *   pnpm translate --check         exit 1 if si.json is behind en.json (for CI / pre-commit)
 *   pnpm translate --force         re-translate everything
 *   pnpm translate --mark-current  accept the current si.json as up to date (after hand edits
 *                                  to English that don't need a new translation)
 *
 * How "changed" is detected: messages/translation-lock.json stores a hash of the English
 * source each Sinhala string was translated from. Editing si.json by hand is safe — a key is
 * only re-translated when its *English* text changes.
 *
 * Runs on Node's built-in TypeScript support (Node ≥ 22.18). Reads OPENAI_API_KEY (and
 * optional TRANSLATION_MODEL) from the environment / .env.local.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hashText, translateEntries } from "@rashodkorala/translate";

type Messages = { [key: string]: string | Messages };
type Lock = Record<string, Record<string, string>>;

const TARGET = "si";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paths = {
  en: join(root, "messages/en.json"),
  target: join(root, `messages/${TARGET}.json`),
  lock: join(root, "messages/translation-lock.json"),
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const check = args.has("--check");
const force = args.has("--force");
const markCurrent = args.has("--mark-current");

function readJson<T>(path: string, fallback: T): T {
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : fallback;
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function flatten(messages: Messages, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") out[path] = value;
    else Object.assign(out, flatten(value, path));
  }
  return out;
}

/** Rebuilds a nested object using en.json's shape and key order. */
function unflattenLike(shape: Messages, flat: Record<string, string>, prefix = ""): Messages {
  const out: Messages = {};
  for (const [key, value] of Object.entries(shape)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      if (path in flat) out[key] = flat[path];
    } else {
      const child = unflattenLike(value, flat, path);
      if (Object.keys(child).length) out[key] = child;
    }
  }
  return out;
}

async function main() {
  const en = readJson<Messages>(paths.en, {});
  const enFlat = flatten(en);
  const targetFlat = flatten(readJson<Messages>(paths.target, {}));
  const lock = readJson<Lock>(paths.lock, {});
  const targetLock = lock[TARGET] ?? {};

  const pending = Object.keys(enFlat).filter(
    (key) => force || !(key in targetFlat) || targetLock[key] !== hashText(enFlat[key])
  );
  const removed = Object.keys(targetFlat).filter((key) => !(key in enFlat));

  if (markCurrent) {
    const next: Record<string, string> = {};
    for (const key of Object.keys(enFlat)) if (key in targetFlat) next[key] = hashText(enFlat[key]);
    writeJson(paths.lock, { ...lock, [TARGET]: next });
    console.log(`Marked ${Object.keys(next).length} ${TARGET} strings as current.`);
    const missing = Object.keys(enFlat).filter((k) => !(k in targetFlat));
    if (missing.length) console.log(`Still missing (run without --mark-current): ${missing.join(", ")}`);
    return;
  }

  if (!pending.length && !removed.length) {
    console.log(`${TARGET}.json is up to date (${Object.keys(enFlat).length} strings).`);
    return;
  }

  console.log(`${pending.length} to translate${removed.length ? `, ${removed.length} to remove` : ""}:`);
  for (const key of pending) console.log(`  + ${key}`);
  for (const key of removed) console.log(`  - ${key}`);

  if (check) {
    console.error(`\n${TARGET}.json is out of date. Run \`pnpm translate\`.`);
    process.exit(1);
  }
  if (dryRun) return;

  const { translations, failed } = pending.length
    ? await translateEntries(Object.fromEntries(pending.map((k) => [k, enFlat[k]])), "ui", {
        context: "UI copy for a personal portfolio website (navigation, headings, page text, metadata).",
      })
    : { translations: {}, failed: [] as string[] };

  const nextFlat = { ...targetFlat, ...translations };
  for (const key of removed) delete nextFlat[key];

  const nextLock: Record<string, string> = {};
  for (const key of Object.keys(enFlat)) {
    if (key in translations) nextLock[key] = hashText(enFlat[key]);
    else if (targetLock[key] && key in nextFlat) nextLock[key] = targetLock[key];
  }

  writeJson(paths.target, unflattenLike(en, nextFlat));
  writeJson(paths.lock, { ...lock, [TARGET]: nextLock });

  console.log(`\nTranslated ${Object.keys(translations).length} string(s). Review the diff in messages/${TARGET}.json.`);
  if (failed.length) {
    console.warn(`Could not translate (placeholders/tags didn't survive), English will show instead:`);
    for (const key of failed) console.warn(`  ! ${key}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
