"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";
import { sceneCatalog, styleCatalog, targetCatalogByScene } from "@/lib/catalog/expression-catalog";
import { getContextDefaultSliders, minInputTextLength } from "@/lib/domain/defaults";
import { getTonePreviewText } from "@/lib/tone/preview";
import {
  createRequestKey,
  defaultSliders,
  useExpressionFlowStore,
  type GenerateDraft,
  type GenerationStatus,
} from "@/stores/expression-flow-store";
import { generateExpression } from "@/utils/expression-api";
import styles from "./page.module.css";

function isSuccessStatus(status: GenerationStatus): status is "success-model" | "success-fallback" {
  return status === "success-model" || status === "success-fallback";
}

const quickTones = [
  { key: "softer", label: "再软一点" },
  { key: "formal", label: "更正式" },
  { key: "boundary", label: "更有边界感" },
] as const;

const previewSamples = {
  formalHigh: "您好，关于您提到的事项目前不在我的负责范围内，建议联系对应负责人确认，我会尽力配合需要的信息。",
  distanceLow: "这个我不太负责诶，可能找对应同事更合适，我可以帮你问问该找谁～",
  politenessHigh: "这件事我这边可能不太负责，建议你联系对应同事确认一下，会更准确一些。",
  default: "我理解你的需求，这个部分目前不在我的负责范围内，我可以帮你确认负责的同事是谁～",
} as const;

export default function TonePage() {
  const text = useExpressionFlowStore((state) => state.text);
  const scene = useExpressionFlowStore((state) => state.scene);
  const target = useExpressionFlowStore((state) => state.target);
  const style = useExpressionFlowStore((state) => state.style);
  const sliders = useExpressionFlowStore((state) => state.sliders);
  const generation = useExpressionFlowStore((state) => state.generation);
  const buildDraft = useExpressionFlowStore((state) => state.buildDraft);
  const setSlider = useExpressionFlowStore((state) => state.setSlider);
  const setSliders = useExpressionFlowStore((state) => state.setSliders);
  const setGenerationLoading = useExpressionFlowStore((state) => state.setGenerationLoading);
  const setGenerationSuccess = useExpressionFlowStore((state) => state.setGenerationSuccess);
  const setGenerationError = useExpressionFlowStore((state) => state.setGenerationError);
  const polite = sliders.politeness;
  const formal = sliders.formality;
  const distance = sliders.distance;
  const hasDraft = Boolean(scene && target && style && text.trim().length >= minInputTextLength);
  const draft = buildDraft();
  const requestKey = draft ? createRequestKey(draft) : null;
  const sceneLabel = scene ? sceneCatalog.find((item) => item.key === scene)?.title : null;
  const targetLabel = scene && target
    ? targetCatalogByScene[scene].find((item) => item.key === target)?.title
    : null;
  const styleLabel = style ? styleCatalog.find((item) => item.key === style)?.title : null;

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

    const timer = window.setTimeout(() => {
      void runGenerate(draft);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [draft, generation.requestKey, generation.status, requestKey, runGenerate]);

  const handleQuickTone = (key: (typeof quickTones)[number]["key"]) => {
    if (key === "softer") {
      setSliders({
        ...sliders,
        politeness: Math.min(100, sliders.politeness + 12),
        distance: Math.max(0, sliders.distance - 6),
      });
      return;
    }

    if (key === "formal") {
      setSliders({
        ...sliders,
        formality: Math.min(100, sliders.formality + 14),
        politeness: Math.min(100, sliders.politeness + 6),
      });
      return;
    }

    setSliders({
      ...sliders,
      distance: Math.min(100, sliders.distance + 14),
      formality: Math.min(100, sliders.formality + 5),
    });
  };

  const fallbackPreview = useMemo(() => {
    if (formal > 72) {
      return previewSamples.formalHigh;
    }

    if (distance < 45) {
      return previewSamples.distanceLow;
    }

    if (polite > 80) {
      return previewSamples.politenessHigh;
    }

    return previewSamples.default;
  }, [polite, formal, distance]);

  const previewText = useMemo(() => {
    if (!draft || !requestKey) {
      return "先回到输入页，选择场景并写下你想表达的真实想法。";
    }

    if (generation.status === "loading" && generation.requestKey === requestKey) {
      return "正在根据当前语气生成预览...";
    }

    if (generation.status === "refused" && generation.requestKey === requestKey) {
      return generation.errorMessage ?? "这句话暂时无法生成，请回到输入页调整原话。";
    }

    if (generation.status === "fail" && generation.requestKey === requestKey) {
      return generation.errorMessage ?? "预览生成失败，请稍后重试或直接生成结果。";
    }

    if (isSuccessStatus(generation.status) && generation.requestKey === requestKey && generation.result) {
      return getTonePreviewText({
        fallbackPreview,
        generatedResult: generation.result,
      });
    }

    return "正在准备当前语气的表达预览...";
  }, [
    draft,
    fallbackPreview,
    generation.errorMessage,
    generation.requestKey,
    generation.result,
    generation.status,
    requestKey,
  ]);

  const radarDotStyle: CSSProperties & {
    "--x": string;
    "--y": string;
  } = {
    "--x": `${polite}%`,
    "--y": `${100 - formal}%`,
  };

  return (
    <MobileShell className={styles.container}>
      <TopBar
        title="语气仪表盘"
        subtitle="微调语气，让表达更贴近你的意图"
        backHref="/input"
        actions={[
          {
            label: "重置",
            icon: "reset",
            onClick: () => setSliders(scene ? getContextDefaultSliders(scene, target) : defaultSliders),
          },
        ]}
      />

      <div className={styles.content}>
        <section className={`soft-card ${styles.contextCard}`}>
          <span>当前上下文</span>
          <div>
            <strong>{sceneLabel ?? "未选场景"}</strong>
            <strong>{targetLabel ?? "未选对象"}</strong>
            <strong>{styleLabel ?? "未选风格"}</strong>
          </div>
        </section>

        {!hasDraft ? (
          <section className={`soft-card ${styles.previewSection}`}>
            <div className={styles.previewCopy}>
              <div className={styles.previewHeader}>
                <h2 className={styles.previewTitle}>还差一句原话</h2>
                <span>待补充</span>
              </div>
              <p className={styles.previewText}>
                先回到输入页，选择场景并写下你想表达的真实想法。
              </p>
            </div>
          </section>
        ) : null}
        <section className={`soft-card ${styles.previewSection}`}>
          <div className={styles.previewCopy}>
            <div className={styles.previewHeader}>
              <h2 className={styles.previewTitle}>表达预览</h2>
              <span>实时预览</span>
            </div>
            <p className={styles.previewText}>
              {previewText}
            </p>
          </div>
          <div className={styles.previewVisual}>
            <div className={styles.backgroundRadar} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className={styles.liveDot} style={radarDotStyle} aria-hidden="true" />
            <span className={styles.previewSpark} aria-hidden="true" />
          </div>
        </section>

        <div className={styles.sliderContainer}>
          <section className={styles.quickToneSection} aria-label="快捷调整">
            {quickTones.map((quickTone) => (
              <button key={quickTone.key} type="button" onClick={() => handleQuickTone(quickTone.key)}>
                {quickTone.label}
              </button>
            ))}
          </section>
          <ToneSlider
            title="礼貌程度"
            left="直接"
            right="礼貌"
            value={polite}
            hint="语气更礼貌，表达更照顾对方感受"
            onChange={(value) => setSlider("politeness", value)}
          />
          <ToneSlider
            title="正式程度"
            left="日常"
            right="正式"
            value={formal}
            hint="表达更正式，适合书面或职场场景"
            onChange={(value) => setSlider("formality", value)}
          />
          <ToneSlider
            title="关系距离"
            left="熟人"
            right="陌生/上级"
            value={distance}
            hint="保持适当距离，表达更得体"
            onChange={(value) => setSlider("distance", value)}
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href={hasDraft ? "/results" : "/input"} sparkle>
          {hasDraft ? "生成结果" : "返回输入"}
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
