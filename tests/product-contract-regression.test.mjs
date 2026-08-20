import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("home starts a blank flow and hot styles only preset style", () => {
  const home = read("app/page.tsx");

  assert.match(home, /href="\/input"/);
  assert.match(home, /href=\{`\/input\?style=\$\{style\.key\}`\}/);
  assert.doesNotMatch(home, /input\?scene=work/);
  assert.doesNotMatch(home, /SceneCard/);
});

test("domain and store include PRD target context", () => {
  const enums = read("lib/domain/enums.ts");
  const defaults = read("lib/domain/defaults.ts");
  const store = read("stores/expression-flow-store.ts");
  const validator = read("lib/validators/generate.ts");

  assert.match(enums, /export const targets/);
  assert.match(enums, /export type TargetId/);
  assert.match(defaults, /getContextDefaultSliders/);
  assert.match(store, /target: TargetId/);
  assert.match(store, /setTarget/);
  assert.match(store, /applyContextDefaults/);
  assert.match(store, /!state\.target \|\| !state\.style/);
  assert.match(validator, /target: z\.enum\(targets\)\.optional\(\)/);
});

test("input page implements scene target style text validation", () => {
  const input = read("app/input/page.tsx");

  assert.match(input, /targetCatalogByScene/);
  assert.match(input, /exampleTextByTarget/);
  assert.match(input, /maxLength=\{maxInputTextLength\}/);
  assert.match(input, /softInputTextLength/);
  assert.match(input, /请先选择沟通场景/);
  assert.match(input, /请先选择沟通对象/);
  assert.match(input, /请先选择表达风格/);
  assert.match(input, /超过 300 字后可能影响转换聚焦/);
});

test("tone page shows context and debounces preview", () => {
  const tone = read("app/tone/page.tsx");

  assert.match(tone, /contextCard/);
  assert.match(tone, /window\.setTimeout/);
  assert.match(tone, /500/);
  assert.match(tone, /getContextDefaultSliders/);
  assert.match(tone, /再软一点/);
  assert.match(tone, /更正式/);
  assert.match(tone, /更有边界感/);
});

test("typed local catalog covers the fixed product ids", () => {
  const catalog = read("lib/catalog/expression-catalog.ts");

  assert.match(catalog, /satisfies readonly SceneCatalogItem\[\]/);
  assert.match(catalog, /satisfies Record<Scene, readonly TargetCatalogItem\[\]>/);
  assert.match(catalog, /satisfies readonly StyleCatalogItem\[\]/);
  assert.match(catalog, /satisfies Record<TargetId, string>/);
});

test("results page supports editable original, favorites, useful state, and style popup", () => {
  const results = read("app/results/page.tsx");
  const card = read("components/ResultCard.tsx");

  assert.match(results, /TextArea/);
  assert.match(results, /handleOriginalRegenerate/);
  assert.match(results, /toggleFavoriteItem/);
  assert.match(results, /Popup/);
  assert.match(results, /stylePopupOpen/);
  assert.match(card, /usefulActive/);
  assert.match(card, /aria-expanded/);
});

test("history and profile routes exist and use PRD storage keys", () => {
  const history = read("utils/recent-history.ts");

  assert.equal(existsSync(new URL("../app/history/page.tsx", import.meta.url)), true);
  assert.equal(existsSync(new URL("../app/profile/page.tsx", import.meta.url)), true);
  assert.match(history, /huadao_session/);
  assert.match(history, /huadao_history/);
  assert.match(history, /huadao_favorites/);
  assert.match(history, /huadao_prefs/);
  assert.match(history, /huadao_stats/);
  assert.match(history, /legacyRecentHistoryStorageKey/);
});
