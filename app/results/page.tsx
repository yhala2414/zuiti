"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Popup, TextArea, Toast } from "antd-mobile";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResultCard } from "@/components/ResultCard";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import { styleCatalog } from "@/lib/catalog/expression-catalog";
import {
  createRequestKey,
  useExpressionFlowStore,
  type GenerateDraft,
  type GenerateResult,
  type GenerationStatus,
  type OutputMode,
} from "@/stores/expression-flow-store";
import { generateExpression, sendFeedback, trackEvent } from "@/utils/expression-api";
import {
  createRecentHistoryItem,
  isFavoriteItem,
  saveRecentHistoryItem,
  subscribeFavorites,
  toggleFavoriteItem,
} from "@/utils/recent-history";
import { getStyleByIndex, getStyleIndex } from "@/utils/content-mapping";
import styles from "./page.module.css";

const resultMeta = {
  wechat: {
    label: "微信短句版",
    tone: "lavender",
    icon: "wechat",
    fit: "适合微信/IM",
  },
  email: {
    label: "邮件正式版",
    tone: "blue",
    icon: "mail",
    fit: "适合邮件/书面沟通",
  },
  spoken: {
    label: "当面沟通版",
    tone: "pink",
    icon: "face",
    fit: "适合当面沟通",
  },
} as const satisfies Record<OutputMode, {
  label: string;
  tone: "lavender" | "blue" | "pink";
  icon: "wechat" | "mail" | "face";
  fit: string;
}>;

const languageLabels = {
  "zh-CN": "中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
} as const;

function getRecommendedText(result: GenerateResult, mode: OutputMode) {
  const output = result[mode];
  return output.candidates[output.recommendedIndex] ?? output.candidates[0];
}

function isSuccessStatus(status: GenerationStatus): status is "success-model" | "success-fallback" {
  return status === "success-model" || status === "success-fallback";
}

async function copyTextWithFallback(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error("copy command failed");
  }
}

function buildShareFallback(rawText: string, result: GenerateResult) {
  const lines = [
    "话到嘴边帮我换了一种说法：",
    "",
    `原话：${rawText.trim()}`,
    "",
    `微信短句版：${getRecommendedText(result, "wechat")}`,
    "",
    `邮件正式版：${getRecommendedText(result, "email")}`,
    "",
    `当面沟通版：${getRecommendedText(result, "spoken")}`,
  ];

  return lines.join("\n");
}

export default function ResultsPage() {
  const text = useExpressionFlowStore((state) => state.text);
  const style = useExpressionFlowStore((state) => state.style);
  const sessionId = useExpressionFlowStore((state) => state.sessionId);
  const generation = useExpressionFlowStore((state) => state.generation);
  const buildDraft = useExpressionFlowStore((state) => state.buildDraft);
  const setText = useExpressionFlowStore((state) => state.setText);
  const setStyle = useExpressionFlowStore((state) => state.setStyle);
  const setGenerationLoading = useExpressionFlowStore((state) => state.setGenerationLoading);
  const setGenerationSuccess = useExpressionFlowStore((state) => state.setGenerationSuccess);
  const setGenerationError = useExpressionFlowStore((state) => state.setGenerationError);
  const [editableText, setEditableText] = useState(text);
  const [stylePopupOpen, setStylePopupOpen] = useState(false);
  const [usefulModes, setUsefulModes] = useState<Set<OutputMode>>(() => new Set());
  const savedHistoryKeyRef = useRef<string | null>(null);

  const draft = buildDraft();
  const requestKey = draft ? createRequestKey(draft) : null;
  const generatedResult = generation.result;
  const successStatus = isSuccessStatus(generation.status) ? generation.status : null;
  const isFavorite =
    useSyncExternalStore(
      subscribeFavorites,
      () => (requestKey && isFavoriteItem(requestKey) ? "1" : "0"),
      () => "0",
    ) === "1";

  const runGenerate = useCallback(
    async (nextDraft: GenerateDraft) => {
      const nextRequestKey = createRequestKey(nextDraft);
      setGenerationLoading(nextRequestKey);
      const response = await generateExpression(nextDraft);

      if (response.ok) {
        setGenerationSuccess(response.data, nextRequestKey);
        return;
      }

      setGenerationError(
        response.code === "SAFETY_REFUSED" ? "refused" : "fail",
        response.code,
        response.message,
      );
    },
    [setGenerationError, setGenerationLoading, setGenerationSuccess],
  );

  useEffect(() => {
    if (!draft || !requestKey) {
      return;
    }

    if (isSuccessStatus(generation.status) && generation.requestKey === requestKey) {
      return;
    }

    if (generation.status === "loading" && generation.requestKey === requestKey) {
      return;
    }

    if (
      (generation.status === "fail" || generation.status === "refused") &&
      generation.requestKey === requestKey
    ) {
      return;
    }

    void runGenerate(draft);
  }, [draft, generation.requestKey, generation.status, requestKey, runGenerate]);

  useEffect(() => {
    if (!generatedResult || !requestKey || !draft || !successStatus || savedHistoryKeyRef.current === requestKey) {
      return;
    }

    savedHistoryKeyRef.current = requestKey;
    saveRecentHistoryItem(
      createRecentHistoryItem({
        sessionId,
        text: draft.text,
        scene: draft.scene,
        target: draft.target,
        style: draft.style,
        sliders: draft.sliders,
        requestKey,
        result: generatedResult,
      }),
    );
  }, [draft, generatedResult, requestKey, sessionId, successStatus]);

  const cards = useMemo(() => {
    if (!generatedResult || !successStatus) {
      return [];
    }

    return (["wechat", "email", "spoken"] as const).map((mode) => {
      const meta = resultMeta[mode];
      const output = generatedResult[mode];

      return {
        ...meta,
        text: getRecommendedText(generatedResult, mode),
        tags: output.reasons,
        mode,
      };
    });
  }, [generatedResult, successStatus]);

  const handleCopy = async (mode: OutputMode) => {
    if (!generatedResult) {
      return;
    }

    const copiedText = getRecommendedText(generatedResult, mode);
    try {
      await copyTextWithFallback(copiedText);
      Toast.show({ content: "已复制" });
      void trackEvent({
        sessionId,
        event: "copy_result",
        payload: {
          mode,
          candidateIndex: generatedResult[mode].recommendedIndex,
        },
      });
    } catch {
      Toast.show({ content: "复制失败，请手动长按复制" });
    }
  };

  const handleToggleFavorite = () => {
    if (!requestKey || !generatedResult || !draft) {
      Toast.show({ content: "生成结果后才能收藏" });
      return;
    }

    const nextFavorite = toggleFavoriteItem(
      createRecentHistoryItem({
        sessionId,
        text: text.trim(),
        scene: draft.scene,
        target: draft.target,
        style: draft.style,
        sliders: draft.sliders,
        requestKey,
        result: generatedResult,
      }),
    );
    Toast.show({ content: nextFavorite ? "已收藏到本机" : "已取消收藏" });
  };

  const handleShare = async () => {
    if (!generatedResult) {
      Toast.show({ content: "生成结果后才能收藏" });
      return;
    }

    const shareFallback = buildShareFallback(text, generatedResult);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "转换结果",
          text: shareFallback,
        });
      } else {
        await copyTextWithFallback(shareFallback);
        Toast.show({ content: "已复制分享文本" });
      }

      void trackEvent({
        sessionId,
        event: "share_result",
        payload: { hasNativeShare: Boolean(navigator.share) },
      });
    } catch {
      try {
        await copyTextWithFallback(shareFallback);
        Toast.show({ content: "已复制分享文本" });
      } catch {
        Toast.show({ content: "分享失败，请稍后再试" });
      }
    }
  };

  const handleUseful = (mode: OutputMode) => {
    setUsefulModes((current) => new Set(current).add(mode));
    Toast.show({ content: "已记录反馈" });
    void sendFeedback({
      sessionId,
      resultId: `${sessionId}-${mode}`,
      useful: true,
      reasonTags: generatedResult?.[mode].reasons ?? ["usable"],
    });
  };

  const handleRegenerate = () => {
    const nextDraft = buildDraft("regenerate");
    if (nextDraft) {
      void runGenerate(nextDraft);
    }
  };

  const handleOriginalRegenerate = () => {
    setText(editableText);
    const nextDraft = useExpressionFlowStore.getState().buildDraft("edit");
    if (nextDraft) {
      void runGenerate(nextDraft);
    }
  };

  const handleSwitchStyle = (nextIndex: number) => {
    const nextStyle = getStyleByIndex(nextIndex);
    setStyle(nextStyle);
    setStylePopupOpen(false);
    void trackEvent({
      sessionId,
      event: "switch_style_from_result",
      payload: { style: nextStyle },
    });

    window.setTimeout(() => {
      const nextDraft = useExpressionFlowStore.getState().buildDraft("regenerate");
      if (nextDraft) {
        void runGenerate(nextDraft);
      }
    }, 0);
  };

  return (
    <MobileShell className={styles.container}>
      <TopBar
        title="转换结果"
        subtitle="根据你的当前草稿实时生成结果"
        backHref="/tone"
        actions={[
          {
            label: isFavorite ? "已收藏" : "收藏",
            icon: "star",
            active: isFavorite,
            onClick: handleToggleFavorite,
          },
          { label: "分享", icon: "share", onClick: () => void handleShare() },
        ]}
      />

      <div className={styles.content}>
        <section className={`soft-card ${styles.originalCard}`}>
          <div className={styles.originalHeader}>
            <span>原话</span>
            <button type="button" onClick={handleOriginalRegenerate}>
              重新生成
            </button>
          </div>
          <TextArea
            className={styles.originalInput}
            value={editableText}
            onChange={setEditableText}
            placeholder="还没有输入原话，请先回到输入页补充。"
            rows={3}
            maxLength={500}
            showCount
          />
        </section>

        {!draft ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>还不能生成结果</h2>
            <p>请先选择沟通场景，并输入至少 2 个字的真实想法。</p>
            <PrimaryButton href="/input" sparkle>
              返回输入
            </PrimaryButton>
          </section>
        ) : null}

        {draft && generation.status === "loading" ? (
          <section className={`soft-card ${styles.stateCard} ${styles.loadingCard}`}>
            <h2>正在生成</h2>
            <p>正在把你的真实想法转换成更适合发送、书写和当面表达的版本。</p>
            <span className={styles.loadingDots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </section>
        ) : null}

        {draft && generation.status === "refused" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>这句话需要换个目标</h2>
            <p>{generation.errorMessage ?? "当前表达风险较高，请改为描述事实、影响和诉求。"}</p>
            <PrimaryButton href="/input" sparkle>
              修改原话
            </PrimaryButton>
          </section>
        ) : null}

        {draft && generation.status === "fail" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>生成暂时失败</h2>
            <p>{generation.errorMessage ?? "服务暂时不可用，请稍后再试。"}</p>
            <button type="button" className="primary-button" onClick={handleRegenerate}>
              <span>重试一次</span>
            </button>
          </section>
        ) : null}

        {draft && generatedResult && successStatus ? (
          <section className={`soft-card ${styles.stateCard} ${styles.successState}`}>
            <div className={styles.stateHeader}>
              <h2>表达版本已生成</h2>
            </div>
            <p>可以直接复制使用，也可以继续调整语气或换一种风格。</p>
            <div className={styles.metaRow}>
              <span className={styles.metaPill}>
                输出语言：
                {languageLabels[generatedResult.meta.language]}
              </span>
            </div>
          </section>
        ) : null}

        {cards.length > 0 && successStatus ? (
          <section className={styles.resultsList}>
            {cards.map((result, index) => (
              <ResultCard
                key={result.label}
                {...result}
                index={index}
                onCopy={() => void handleCopy(result.mode)}
                onUseful={() => handleUseful(result.mode)}
                usefulActive={usefulModes.has(result.mode)}
                onRegenerate={() => {
                  window.location.href = "/tone";
                }}
                onSwitchStyle={() => setStylePopupOpen(true)}
              />
            ))}
          </section>
        ) : null}

        {cards.length > 0 && successStatus ? (
          <button type="button" className={styles.compareButton}>
            <span aria-hidden="true" />
            查看“原话 → 优化版”的变化点
          </button>
        ) : null}
      </div>

      <div className={styles.bottomActions}>
        <a href="/tone" className={styles.secondaryButton}>
          再调整语气
        </a>
        <button type="button" className="primary-button" onClick={() => setStylePopupOpen(true)}>
          <span>换一种风格</span>
        </button>
      </div>

      <Popup
        visible={stylePopupOpen}
        onMaskClick={() => setStylePopupOpen(false)}
        bodyClassName={styles.stylePopup}
      >
        <section>
          <h2>换一种表达风格</h2>
          <div className={styles.stylePopupList}>
            {styleCatalog.map((styleOption, index) => (
              <StyleCard
                key={styleOption.key}
                title={styleOption.title}
                detail={styleOption.detail}
                icon={styleOption.icon}
                active={style ? index === getStyleIndex(style) : false}
                onClick={() => handleSwitchStyle(index)}
              />
            ))}
          </div>
        </section>
      </Popup>
    </MobileShell>
  );
}
