import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("home hot style links deep-link with validated style params", () => {
  const home = read("app/page.tsx");
  const input = read("app/input/page.tsx");
  const mapping = read("utils/content-mapping.ts");

  assert.match(home, /style=\$\{style\.key\}/);
  assert.match(input, /searchParams\.get\("style"\)/);
  assert.match(input, /normalizeStyle/);
  assert.match(mapping, /function normalizeStyle/);
});

test("scene entry points apply scene defaults in the flow store", () => {
  const defaults = read("lib/domain/defaults.ts");
  const store = read("stores/expression-flow-store.ts");
  const input = read("app/input/page.tsx");

  assert.match(defaults, /sceneDefaultStyles/);
  assert.match(defaults, /sceneDefaultSliders/);
  assert.match(store, /applySceneDefaults/);
  assert.match(input, /applySceneDefaults\(sceneKey\)/);
});

test("disabled primary actions have explicit inactive styling", () => {
  const globals = read("app/globals.css");

  assert.match(globals, /\.primary-button:disabled/);
  assert.match(globals, /not-allowed/);
  assert.match(globals, /animation:\s*none/);
});

test("results page implements favorite and share feedback", () => {
  const results = read("app/results/page.tsx");
  const copy = read("config/copy/pages.ts");

  assert.match(results, /toggleFavoriteItem/);
  assert.match(results, /handleToggleFavorite/);
  assert.match(results, /navigator\.share/);
  assert.match(results, /shareFallback/);
  assert.match(copy, /saveActiveAction/);
  assert.match(copy, /shareCopied/);
});
