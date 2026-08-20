"use client";

import { useSyncExternalStore } from "react";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
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
    return "暂无";
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
      <TopBar title="我的" subtitle="本机偏好与使用统计" backHref="/" />

      <main className={styles.content}>
        <section className={`soft-card ${styles.statsCard}`}>
          <h2>使用统计</h2>
          <div className={styles.statsGrid}>
            <span>
              <strong>{stats.totalGenerations}</strong>
              转换次数
            </span>
            <span>
              <strong>{stats.favoriteCount}</strong>
              收藏数
            </span>
            <span>
              <strong>{formatDate(stats.lastUsedAt)}</strong>
              最近使用
            </span>
          </div>
        </section>

        <section className={`soft-card ${styles.card}`}>
          <h2>收藏</h2>
          {favorites.length > 0 ? (
            <div className={styles.favoriteList}>
              {favorites.map((favorite) => (
                <p key={favorite.id}>{favorite.summary}</p>
              ))}
            </div>
          ) : (
            <p>暂无</p>
          )}
        </section>

        <section className={`soft-card ${styles.card}`}>
          <h2>偏好</h2>
          <p>当前 MVP 使用本机存储，不需要登录。</p>
        </section>

        <PrimaryButton href="/input" sparkle>
          开始一次新的转换
        </PrimaryButton>
      </main>

      <BottomNav />
    </MobileShell>
  );
}
