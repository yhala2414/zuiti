"use client";

import { useSyncExternalStore } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { styles as toneStyles } from "@/components/content";
import { homePageCopy } from "@/config";
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
          <span className={styles.topLabel}>{homePageCopy.topLabel}</span>
          <a
            href="/profile"
            className={styles.profileButton}
            aria-label={homePageCopy.profileAriaLabel}
          >
            <span aria-hidden="true" />
          </a>
        </div>

        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <h1 className={styles.title}>
              {homePageCopy.heroTitle}
              <span className={styles.titleSpark} aria-hidden="true" />
            </h1>
            <p className={styles.subtitle}>
              {homePageCopy.heroSubtitleLines[0]}
              {homePageCopy.heroSubtitleLines[1]}
            </p>
            <p className={styles.description}>
              {homePageCopy.heroDescription}
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
              <h2>{homePageCopy.recentSectionTitle}</h2>
              <a href="/history">{homePageCopy.recentSectionAction}</a>
            </div>
            <a className={`soft-card ${styles.recentCard}`} href="/results">
              <DecorativeIcon kind="spark" size="sm" />
              <div>
                <strong>{latestRecent.originalText}</strong>
                <span>{latestRecent.summary}</span>
              </div>
              <span className={styles.recentMeta}>{homePageCopy.recentCardMeta}</span>
            </a>
          </section>
        ) : null}

        <section className={styles.hotSection}>
          <h2>{homePageCopy.hotSectionTitle}</h2>
          <div className={styles.hotList}>
            {toneStyles.map((style) => (
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
            {homePageCopy.primaryAction}
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
