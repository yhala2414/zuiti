"use client";

import { useSyncExternalStore } from "react";
import { Toast } from "antd-mobile";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
import { historyPageCopy } from "@/config";
import { useExpressionFlowStore } from "@/stores/expression-flow-store";
import {
  clearRecentHistoryItems,
  readRecentHistoryItems,
  subscribeRecentHistory,
} from "@/utils/recent-history";
import styles from "./page.module.css";

function getHistorySnapshot() {
  return JSON.stringify(readRecentHistoryItems());
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp);
}

export default function HistoryPage() {
  const router = useRouter();
  const setText = useExpressionFlowStore((state) => state.setText);
  const setStyle = useExpressionFlowStore((state) => state.setStyle);
  const setSliders = useExpressionFlowStore((state) => state.setSliders);
  const applyContextDefaults = useExpressionFlowStore((state) => state.applyContextDefaults);
  const snapshot = useSyncExternalStore(subscribeRecentHistory, getHistorySnapshot, () => "[]");
  const items = JSON.parse(snapshot) as ReturnType<typeof readRecentHistoryItems>;

  const handleOpen = (item: (typeof items)[number]) => {
    setText(item.originalText);
    setStyle(item.style);
    if (item.target) {
      applyContextDefaults(item.scene, item.target);
    }
    setSliders(item.sliders);
    router.push("/results");
  };

  return (
    <MobileShell className={styles.container}>
      <TopBar
        title={historyPageCopy.title}
        subtitle={historyPageCopy.subtitle}
        backHref="/"
        actions={[
          {
            label: historyPageCopy.clearAction,
            icon: "trash",
            onClick: () => {
              clearRecentHistoryItems();
              Toast.show({ content: "已清空历史记录" });
            },
          },
        ]}
      />

      <main className={styles.content}>
        {items.length === 0 ? (
          <section className={`soft-card ${styles.emptyCard}`}>
            <h2>{historyPageCopy.emptyTitle}</h2>
            <p>{historyPageCopy.emptyDescription}</p>
            <PrimaryButton href="/input" sparkle>
              {historyPageCopy.startAction}
            </PrimaryButton>
          </section>
        ) : (
          <section className={styles.list}>
            {items.map((item) => (
              <article key={item.id} className={`soft-card ${styles.historyCard}`}>
                <div className={styles.cardHeader}>
                  <time>{formatTime(item.updatedAt)}</time>
                  {item.isFavorite ? <span>{historyPageCopy.favoriteLabel}</span> : null}
                </div>
                <h2>{item.originalText}</h2>
                <p>{item.summary}</p>
                <button type="button" onClick={() => handleOpen(item)}>
                  {historyPageCopy.openAction}
                </button>
              </article>
            ))}
          </section>
        )}
      </main>

      <BottomNav />
    </MobileShell>
  );
}
