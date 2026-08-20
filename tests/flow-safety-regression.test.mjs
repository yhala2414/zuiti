import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("results page copy does not expose model or fallback implementation details", () => {
  const pageCopy = read("config/copy/pages.ts");

  assert.doesNotMatch(pageCopy, /已切到演示兜底/);
  assert.doesNotMatch(pageCopy, /真实模型已生成/);
  assert.doesNotMatch(pageCopy, /生成来源/);
  assert.doesNotMatch(pageCopy, /fallback/);
});

test("flow draft construction uses the shared minimum input length", () => {
  const store = read("stores/expression-flow-store.ts");

  assert.match(store, /minInputTextLength/);
  assert.doesNotMatch(store, /text\.length === 0/);
});
