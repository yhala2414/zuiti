"use client";

import { useSyncExternalStore } from "react";
import { Toast } from "antd-mobile";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TopBar } from "@/components/TopBar";
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
        title="历史记录"
        subtitle="保存在本机的最近 50 次转换"
        backHref="/"
        actions={[
          {
            label: "清空",
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
            <h2>还没有历史记录</h2>
            <p>完成一次转换后，这里会显示原话、场景和推荐表达。</p>
            <PrimaryButton href="/input" sparkle>
              开始转换
            </PrimaryButton>
          </section>
        ) : (
          <section className={styles.list}>
            {items.map((item) => (
              <article key={item.id} className={`soft-card ${styles.historyCard}`}>
                <div className={styles.cardHeader}>
                  <time>{formatTime(item.updatedAt)}</time>
                  {item.isFavorite ? <span>已收藏</span> : null}
                </div>
                <h2>{item.originalText}</h2>
                <p>{item.summary}</p>
                <button type="button" onClick={() => handleOpen(item)}>
                  查看
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
