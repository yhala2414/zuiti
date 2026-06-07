"use client";

import { BottomNav } from "@/components/BottomNav";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { SceneCard } from "@/components/SceneCard";
import { scenes, styles as toneStyles } from "@/components/content";
import { homePageCopy } from "@/config";
import { useExpressionFlowStore } from "@/stores/expression-flow-store";
import styles from "./page.module.css";

export default function Home() {
  const setScene = useExpressionFlowStore((state) => state.setScene);
  const setStyle = useExpressionFlowStore((state) => state.setStyle);

  return (
    <MobileShell className={styles.container}>
      <div className={styles.pageContent}>
        <div className={styles.topRow}>
          <span className={styles.topLabel}>{homePageCopy.topLabel}</span>
          <a
            href="/results"
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

        <section className={styles.gridSection}>
          {scenes.map((scene) => (
            <SceneCard
              key={scene.key}
              title={scene.title}
              subtitle={scene.subtitle}
              href={scene.href}
              icon={scene.icon}
              context={scene.context}
              onClick={() => setScene(scene.key)}
            />
          ))}
        </section>

        <section className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2>{homePageCopy.recentSectionTitle}</h2>
            <a href="/results">{homePageCopy.recentSectionAction}</a>
          </div>
          <a className={`soft-card ${styles.recentCard}`} href="/results">
            <DecorativeIcon kind="spark" size="sm" />
            <div>
              <strong>{homePageCopy.recentCardTitle}</strong>
              <span>{homePageCopy.recentCardSubtitle}</span>
            </div>
            <span className={styles.recentMeta}>{homePageCopy.recentCardMeta}</span>
          </a>
        </section>

        <section className={styles.hotSection}>
          <h2>{homePageCopy.hotSectionTitle}</h2>
          <div className={styles.hotList}>
            {toneStyles.map((style) => (
              <a
                key={style.title}
                className={styles.hotItem}
                href="/input?scene=work"
                onClick={() => {
                  setScene("work");
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
          <PrimaryButton href="/input?scene=work" sparkle onClick={() => setScene("work")}>
            {homePageCopy.primaryAction}
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </MobileShell>
  );
}
