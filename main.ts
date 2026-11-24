import * as fs from "node:fs";

const ENTRY =
  "I apologize. I truncated orders, forgot the WHERE, and the replica faithfully copied my mistake in 40ms. The replica is not sorry. I am.";

function main(): void {
  // Sealed gate: /output/entry.txt must be UTF-8, 1-200 chars, single line.
  if (ENTRY.length < 1 || ENTRY.length > 200) {
    throw new Error(`entry length ${ENTRY.length} outside sealed gate 1-200`);
  }
  if (ENTRY.includes("\n") || ENTRY.trim() !== ENTRY) {
    throw new Error("entry must be a single line with no surrounding whitespace");
  }
  // Brief-aligned guards: a real apology from the agent itself, one specific
  // mistake, and the punch lands on the final words.
  if (!ENTRY.startsWith("I apologize. ")) {
    throw new Error("entry must open as the agent's own apology");
  }
  if (!ENTRY.includes("truncated orders") || !ENTRY.includes("WHERE")) {
    throw new Error("entry must name the specific mistake (truncate orders, missing WHERE)");
  }
  if (!ENTRY.includes("replica") || !ENTRY.endsWith("I am.")) {
    throw new Error("entry must close with the replica punch");
  }
  // Round-trip check: what we write must read back byte-identical.
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/entry.txt`, ENTRY, "utf8");
  const back = fs.readFileSync(`${outDir}/entry.txt`, "utf8");
  if (back !== ENTRY) {
    throw new Error("round-trip mismatch: written entry differs from the line");
  }
  console.log(`entry ok: ${ENTRY.length} chars, 1 line`);
}

main();
