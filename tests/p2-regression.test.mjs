import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("local recent history utility exists and caps stored records", () => {
  assert.equal(existsSync(new URL("../utils/recent-history.ts", import.meta.url)), true);
  const history = read("utils/recent-history.ts");

  assert.match(history, /recentHistoryStorageKey/);
  assert.match(history, /saveRecentHistoryItem/);
  assert.match(history, /getLatestRecentHistoryItem/);
  assert.match(history, /slice\(0,\s*50\)/);
});

test("results page saves successful generations into recent history", () => {
  const results = read("app/results/page.tsx");

  assert.match(results, /saveRecentHistoryItem/);
  assert.match(results, /generation\.status/);
  assert.match(results, /generatedResult/);
});

test("home page renders local recent history when available and hides empty history", () => {
  const home = read("app/page.tsx");

  assert.match(home, /getLatestRecentHistoryItem/);
  assert.match(home, /useSyncExternalStore/);
  assert.match(home, /latestRecent \? \(/);
  assert.doesNotMatch(home, /recentEmpty/);
});

test("bottom navigation routes all PRD v1.1 sections", () => {
  const bottomNav = read("components/BottomNav.tsx");
  const copy = read("config/copy/components.ts");

  assert.match(bottomNav, /usePathname/);
  assert.match(bottomNav, /useRouter/);
  assert.match(copy, /href: "\/"/);
  assert.match(copy, /href: "\/history"/);
  assert.match(copy, /href: "\/profile"/);
  assert.doesNotMatch(copy, /disabled: true/);
});

test("results loading state has an explicit visual indicator", () => {
  const results = read("app/results/page.tsx");
  const css = read("app/results/page.module.css");

  assert.match(results, /loadingCard/);
  assert.match(css, /\.loadingDots/);
});
