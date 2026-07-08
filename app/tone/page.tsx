"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";
import { scenes, styles as styleOptions, targetOptionsByScene } from "@/components/content";
import { tonePageCopy } from "@/config";
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
  const sceneLabel = scene ? scenes.find((item) => item.key === scene)?.title : null;
  const targetLabel = scene && target
    ? targetOptionsByScene[scene].find((item) => item.key === target)?.title
    : null;
  const styleLabel = style ? styleOptions.find((item) => item.key === style)?.title : null;

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

  const handleQuickTone = (key: (typeof tonePageCopy.quickTones)[number]["key"]) => {
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
      return tonePageCopy.previewSamples.formalHigh;
    }

    if (distance < 45) {
      return tonePageCopy.previewSamples.distanceLow;
    }

    if (polite > 80) {
      return tonePageCopy.previewSamples.politenessHigh;
    }

    return tonePageCopy.previewSamples.default;
  }, [polite, formal, distance]);

  const previewText = useMemo(() => {
    if (!draft || !requestKey) {
      return tonePageCopy.missingDraftDescription;
    }

    if (generation.status === "loading" && generation.requestKey === requestKey) {
      return tonePageCopy.previewLoading;
    }

    if (generation.status === "refused" && generation.requestKey === requestKey) {
      return generation.errorMessage ?? tonePageCopy.previewRefused;
    }

    if (generation.status === "fail" && generation.requestKey === requestKey) {
      return generation.errorMessage ?? tonePageCopy.previewFailed;
    }

    if (isSuccessStatus(generation.status) && generation.requestKey === requestKey && generation.result) {
      return getTonePreviewText({
        fallbackPreview,
        generatedResult: generation.result,
      });
    }

    return tonePageCopy.previewPending;
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
        title={tonePageCopy.title}
        subtitle={tonePageCopy.subtitle}
        backHref="/input"
        actions={[
          {
            label: tonePageCopy.resetAction,
            icon: "reset",
            onClick: () => setSliders(scene ? getContextDefaultSliders(scene, target) : defaultSliders),
          },
        ]}
      />

      <div className={styles.content}>
        <section className={`soft-card ${styles.contextCard}`}>
          <span>{tonePageCopy.contextLabel}</span>
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
                <h2 className={styles.previewTitle}>{tonePageCopy.missingDraftTitle}</h2>
                <span>{tonePageCopy.missingDraftBadge}</span>
              </div>
              <p className={styles.previewText}>
                {tonePageCopy.missingDraftDescription}
              </p>
            </div>
          </section>
        ) : null}
        <section className={`soft-card ${styles.previewSection}`}>
          <div className={styles.previewCopy}>
            <div className={styles.previewHeader}>
              <h2 className={styles.previewTitle}>{tonePageCopy.previewTitle}</h2>
              <span>{tonePageCopy.previewBadge}</span>
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
          <section className={styles.quickToneSection} aria-label={tonePageCopy.quickToneTitle}>
            {tonePageCopy.quickTones.map((quickTone) => (
              <button key={quickTone.key} type="button" onClick={() => handleQuickTone(quickTone.key)}>
                {quickTone.label}
              </button>
            ))}
          </section>
          <ToneSlider
            title={tonePageCopy.sliders.politeness.title}
            left={tonePageCopy.sliders.politeness.left}
            right={tonePageCopy.sliders.politeness.right}
            value={polite}
            hint={tonePageCopy.sliders.politeness.hint}
            onChange={(value) => setSlider("politeness", value)}
          />
          <ToneSlider
            title={tonePageCopy.sliders.formality.title}
            left={tonePageCopy.sliders.formality.left}
            right={tonePageCopy.sliders.formality.right}
            value={formal}
            hint={tonePageCopy.sliders.formality.hint}
            onChange={(value) => setSlider("formality", value)}
          />
          <ToneSlider
            title={tonePageCopy.sliders.distance.title}
            left={tonePageCopy.sliders.distance.left}
            right={tonePageCopy.sliders.distance.right}
            value={distance}
            hint={tonePageCopy.sliders.distance.hint}
            onChange={(value) => setSlider("distance", value)}
          />
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <PrimaryButton href={hasDraft ? "/results" : "/input"} sparkle>
          {hasDraft ? tonePageCopy.generateAction : tonePageCopy.backToInputAction}
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
