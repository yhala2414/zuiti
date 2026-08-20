"use client";

import { useSyncExternalStore } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { styleCatalog } from "@/lib/catalog/expression-catalog";
import { useExpressionFlowStore } from "@/stores/expression-flow-store";
import {
  getLatestRecentHistoryItem,
  subscribeRecentHistory,
} from "@/utils/recent-history";
import styles from "./page.module.css";

function getRecentSnapshot() {
  return JSON.stringify(getLatestRecentHistoryItem());
}

export default function Home() {
  const setStyle = useExpressionFlowStore((state) => state.setStyle);
  const recentSnapshot = useSyncExternalStore(subscribeRecentHistory, getRecentSnapshot, () => "null");
  const latestRecent = JSON.parse(recentSnapshot) as ReturnType<typeof getLatestRecentHistoryItem>;

  return (
    <MobileShell className={styles.container}>
      <div className={styles.pageContent}>
        <div className={styles.topRow}>
          <span className={styles.topLabel}>年轻人的场景表达转换器</span>
          <a
            href="/profile"
            className={styles.profileButton}
            aria-label="我的收藏"
          >
            <span aria-hidden="true" />
          </a>
        </div>

        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>
              话到嘴边
              <span className={styles.titleSpark} aria-hidden="true" />
            </h1>
            <p className={styles.subtitle}>
              把不好开口的话，
              换一种更合适的表达
            </p>
            <p className={styles.description}>
              帮你把真实想法，转成适合不同对象、不同场景的表达版本
            </p>
          </div>
          <div className={styles.iconWrapper} aria-hidden="true">
            <DecorativeIcon kind="spark" size="hero" />
            <span className={styles.whiteBubble} />
            <span className={styles.blueRing} />
            <span className={styles.floatDot} />
            <span className={styles.floatDot} />
            <span className={styles.floatDot} />
          </div>
        </section>

        {latestRecent ? (
          <section className={styles.recentSection}>
            <div className={styles.sectionHeader}>
              <h2>最近使用</h2>
              <a href="/history">查看全部</a>
            </div>
            <a className={`soft-card ${styles.recentCard}`} href="/results">
              <DecorativeIcon kind="spark" size="sm" />
              <div>
                <strong>{latestRecent.originalText}</strong>
                <span>{latestRecent.summary}</span>
              </div>
              <span className={styles.recentMeta}>刚刚</span>
            </a>
          </section>
        ) : null}

        <section className={styles.hotSection}>
          <h2>热门风格</h2>
          <div className={styles.hotList}>
          {styleCatalog.map((style) => (
              <a
                key={style.title}
                className={styles.hotItem}
                href={`/input?style=${style.key}`}
                onClick={() => {
                  setStyle(style.key);
                }}
              >
                <DecorativeIcon kind={style.icon} size="sm" />
                <span>{style.title}</span>
              </a>
            ))}
          </div>
        </section>

        <div className={styles.buttonWrapper}>
          <PrimaryButton href="/input" sparkle>
            开始转换
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
