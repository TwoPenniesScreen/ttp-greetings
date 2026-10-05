import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("public slide selection uses edge while admin reads pass through", async () => {
  const source = await readFile(new URL("../netlify/edge-functions/public-slides.js", import.meta.url), "utf8");
  assert.match(source, /path:\s*"\/api\/slides"/);
  assert.match(source, /method:\s*\["GET"\]/);
  assert.match(source, /context\.next\(\)/);
  assert.match(source, /get\("slides",\s*\{\s*type:\s*"json"\s*\}\)/);
  assert.doesNotMatch(source, /setJSON|\.set\(/);
  assert.match(source, /weightedPick/);
});
