import type {
  ExpressionStyle,
  GenerateResult,
  OutputMode,
  Scene,
  TargetId,
  ToneSliders,
} from "@/stores/expression-flow-store";

export const sessionStorageKey = "huadao_session";
export const recentHistoryStorageKey = "huadao_history";
export const favoritesStorageKey = "huadao_favorites";
export const prefsStorageKey = "huadao_prefs";
export const statsStorageKey = "huadao_stats";
export const legacyRecentHistoryStorageKey = "zuiti.recent.history.v1";
export const recentHistoryChangeEvent = "huadao_history.change";
export const favoritesChangeEvent = "huadao_favorites.change";

export type RecentHistoryItem = {
  id: string;
  sessionId: string;
  originalText: string;
  text: string;
  scene: Scene;
  target: TargetId | null;
  style: ExpressionStyle;
  sliders: ToneSliders;
  results: Partial<Record<OutputMode, string>>;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  summary: string;
};

export type FavoriteItem = RecentHistoryItem;

export type UsageStats = {
  totalGenerations: number;
  favoriteCount: number;
  lastUsedAt: number | null;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getRecommendedText(result: GenerateResult, mode: OutputMode) {
  const output = result[mode];
  return output.candidates[output.recommendedIndex] ?? output.candidates[0];
}

function normalizeHistoryItem(item: unknown): RecentHistoryItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const candidate = item as Partial<RecentHistoryItem> & {
    result?: GenerateResult;
    createdAt?: number;
  };

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.sessionId !== "string" ||
    typeof candidate.scene !== "string" ||
    typeof candidate.style !== "string" ||
    typeof candidate.createdAt !== "number"
  ) {
    return null;
  }

  const originalText = typeof candidate.originalText === "string"
    ? candidate.originalText
    : typeof candidate.text === "string"
      ? candidate.text
      : "";

  const summary = typeof candidate.summary === "string"
    ? candidate.summary
    : candidate.result
      ? getRecommendedText(candidate.result, "wechat")
      : originalText;

  return {
    id: candidate.id,
    sessionId: candidate.sessionId,
    originalText,
    text: originalText,
    scene: candidate.scene as Scene,
    target: (candidate.target as TargetId | null | undefined) ?? null,
    style: candidate.style as ExpressionStyle,
    sliders: candidate.sliders ?? { politeness: 60, formality: 50, distance: 70 },
    results: candidate.results ?? (candidate.result
      ? {
          wechat: getRecommendedText(candidate.result, "wechat"),
          email: getRecommendedText(candidate.result, "email"),
          spoken: getRecommendedText(candidate.result, "spoken"),
        }
      : {}),
    isFavorite: Boolean(candidate.isFavorite),
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt ?? candidate.createdAt,
    summary,
  };
}

function parseRecentHistory(value: string | null): RecentHistoryItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeHistoryItem).filter((item): item is RecentHistoryItem => item !== null);
  } catch {
    return [];
  }
}

export function readRecentHistoryItems() {
  if (!canUseStorage()) {
    return [];
  }

  const current = parseRecentHistory(localStorage.getItem(recentHistoryStorageKey));

  if (current.length > 0) {
    return current;
  }

  return parseRecentHistory(localStorage.getItem(legacyRecentHistoryStorageKey));
}

export function getLatestRecentHistoryItem() {
  return readRecentHistoryItems()[0] ?? null;
}

export function notifyRecentHistoryChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(recentHistoryChangeEvent));
  }
}

export function notifyFavoritesChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(favoritesChangeEvent));
  }
}

export function subscribeRecentHistory(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(recentHistoryChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(recentHistoryChangeEvent, onStoreChange);
  };
}

export function saveRecentHistoryItem(item: RecentHistoryItem) {
  if (!canUseStorage()) {
    return;
  }

  const nextItems = [
    item,
    ...readRecentHistoryItems().filter((historyItem) => historyItem.id !== item.id),
  ].slice(0, 50);

  localStorage.setItem(recentHistoryStorageKey, JSON.stringify(nextItems));
  updateStats({ generated: true });
  notifyRecentHistoryChanged();
}

export function clearRecentHistoryItems() {
  if (!canUseStorage()) {
    return;
  }

  localStorage.removeItem(recentHistoryStorageKey);
  notifyRecentHistoryChanged();
}

export function readFavoriteItems() {
  if (!canUseStorage()) {
    return [];
  }

  return parseRecentHistory(localStorage.getItem(favoritesStorageKey));
}

export function isFavoriteItem(id: string) {
  return readFavoriteItems().some((item) => item.id === id);
}

export function toggleFavoriteItem(item: RecentHistoryItem) {
  if (!canUseStorage()) {
    return false;
  }

  const favorites = readFavoriteItems();
  const exists = favorites.some((favorite) => favorite.id === item.id);
  const nextFavorites = exists
    ? favorites.filter((favorite) => favorite.id !== item.id)
    : [{ ...item, isFavorite: true, updatedAt: Date.now() }, ...favorites].slice(0, 50);

  localStorage.setItem(favoritesStorageKey, JSON.stringify(nextFavorites));
  localStorage.setItem(
    recentHistoryStorageKey,
    JSON.stringify(
      readRecentHistoryItems().map((historyItem) =>
        historyItem.id === item.id ? { ...historyItem, isFavorite: !exists, updatedAt: Date.now() } : historyItem,
      ),
    ),
  );
  updateStats({ favoriteCount: nextFavorites.length });
  notifyFavoritesChanged();
  notifyRecentHistoryChanged();

  return !exists;
}

export function subscribeFavorites(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(favoritesChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(favoritesChangeEvent, onStoreChange);
  };
}

export function readStats(): UsageStats {
  if (!canUseStorage()) {
    return { totalGenerations: 0, favoriteCount: 0, lastUsedAt: null };
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(statsStorageKey) ?? "null") as Partial<UsageStats> | null;
    return {
      totalGenerations: parsed?.totalGenerations ?? readRecentHistoryItems().length,
      favoriteCount: readFavoriteItems().length,
      lastUsedAt: parsed?.lastUsedAt ?? getLatestRecentHistoryItem()?.createdAt ?? null,
    };
  } catch {
    return {
      totalGenerations: readRecentHistoryItems().length,
      favoriteCount: readFavoriteItems().length,
      lastUsedAt: getLatestRecentHistoryItem()?.createdAt ?? null,
    };
  }
}

function updateStats(update: { generated?: boolean; favoriteCount?: number }) {
  if (!canUseStorage()) {
    return;
  }

  const current = readStats();
  const next: UsageStats = {
    totalGenerations: current.totalGenerations + (update.generated ? 1 : 0),
    favoriteCount: update.favoriteCount ?? current.favoriteCount,
    lastUsedAt: update.generated ? Date.now() : current.lastUsedAt,
  };

  localStorage.setItem(statsStorageKey, JSON.stringify(next));
}

export function createRecentHistoryItem(args: {
  sessionId: string;
  text: string;
  scene: Scene;
  target: TargetId | null;
  style: ExpressionStyle;
  sliders: ToneSliders;
  requestKey: string;
  result: GenerateResult;
}): RecentHistoryItem {
  const summary = getRecommendedText(args.result, "wechat");
  const createdAt = Date.now();

  return {
    id: args.requestKey,
    sessionId: args.sessionId,
    originalText: args.text,
    text: args.text,
    scene: args.scene,
    target: args.target,
    style: args.style,
    sliders: args.sliders,
    results: {
      wechat: getRecommendedText(args.result, "wechat"),
      email: getRecommendedText(args.result, "email"),
      spoken: getRecommendedText(args.result, "spoken"),
    },
    isFavorite: isFavoriteItem(args.requestKey),
    createdAt,
    updatedAt: createdAt,
    summary,
  };
}
