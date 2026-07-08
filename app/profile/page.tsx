"use client";

import { useSyncExternalStore } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
import { profilePageCopy } from "@/config";
import {
  type FavoriteItem,
  type UsageStats,
  readFavoriteItems,
  readStats,
  subscribeFavorites,
} from "@/utils/recent-history";
import styles from "./page.module.css";

function getProfileSnapshot() {
  return JSON.stringify({
    stats: readStats(),
    favorites: readFavoriteItems().slice(0, 3),
  });
}

type ProfileSnapshot = {
  stats: UsageStats;
  favorites: FavoriteItem[];
};

function formatDate(timestamp: number | null) {
  if (!timestamp) {
    return profilePageCopy.emptyDate;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export default function ProfilePage() {
  const snapshot = useSyncExternalStore(subscribeFavorites, getProfileSnapshot, () =>
    JSON.stringify({ stats: { totalGenerations: 0, favoriteCount: 0, lastUsedAt: null }, favorites: [] }),
  );
  const { stats, favorites } = JSON.parse(snapshot) as ProfileSnapshot;

  return (
    <MobileShell className={styles.container}>
      <TopBar title={profilePageCopy.title} subtitle={profilePageCopy.subtitle} backHref="/" />

      <main className={styles.content}>
        <section className={`soft-card ${styles.statsCard}`}>
          <h2>{profilePageCopy.statsTitle}</h2>
          <div className={styles.statsGrid}>
            <span>
              <strong>{stats.totalGenerations}</strong>
              {profilePageCopy.totalGenerations}
            </span>
            <span>
              <strong>{stats.favoriteCount}</strong>
              {profilePageCopy.favoriteCount}
            </span>
            <span>
              <strong>{formatDate(stats.lastUsedAt)}</strong>
              {profilePageCopy.lastUsedAt}
            </span>
          </div>
        </section>

        <section className={`soft-card ${styles.card}`}>
          <h2>{profilePageCopy.favoritesTitle}</h2>
          {favorites.length > 0 ? (
            <div className={styles.favoriteList}>
              {favorites.map((favorite) => (
                <p key={favorite.id}>{favorite.summary}</p>
              ))}
            </div>
          ) : (
            <p>{profilePageCopy.emptyDate}</p>
          )}
        </section>

        <section className={`soft-card ${styles.card}`}>
          <h2>{profilePageCopy.prefsTitle}</h2>
          <p>{profilePageCopy.prefsDescription}</p>
        </section>

        <PrimaryButton href="/input" sparkle>
          {profilePageCopy.startAction}
        </PrimaryButton>
      </main>

      <BottomNav />
    </MobileShell>
  );
}
