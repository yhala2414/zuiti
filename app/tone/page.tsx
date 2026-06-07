"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ToneSlider } from "@/components/ToneSlider";
import { TopBar } from "@/components/TopBar";
import { tonePageCopy } from "@/config";
import { getTonePreviewText } from "@/lib/tone/preview";
import { createRequestKey, defaultSliders, useExpressionFlowStore } from "@/stores/expression-flow-store";
import { generateExpression } from "@/utils/expression-api";
import styles from "./page.module.css";

export default function TonePage() {
  const text = useExpressionFlowStore((state) => state.text);
  const scene = useExpressionFlowStore((state) => state.scene);
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
  const hasDraft = Boolean(scene && text.trim().length >= 2);
  const draft = buildDraft();
  const requestKey = draft ? createRequestKey(draft) : null;

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

  const runGenerate = useCallback(
    async () => {
      if (!draft) {
        return;
      }

      const nextRequestKey = createRequestKey(draft);
      setGenerationLoading(nextRequestKey);
      const response = await generateExpression(draft);

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
    [draft, setGenerationError, setGenerationLoading, setGenerationSuccess],
  );

  useEffect(() => {
    if (!draft || !requestKey) {
      return;
    }

    if (generation.requestKey === requestKey) {
      const isSettled =
        generation.status === "loading" ||
        generation.status === "success-model" ||
        generation.status === "success-fallback" ||
        generation.status === "fail" ||
        generation.status === "refused";

      if (isSettled) {
        return;
      }
    }

    const timerId = window.setTimeout(() => {
      void runGenerate();
    }, 350);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [draft, generation.requestKey, generation.status, requestKey, runGenerate]);

  const previewText = getTonePreviewText({
    fallbackPreview,
    generatedResult: generation.result,
  });

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
        actions={[{ label: tonePageCopy.resetAction, icon: "reset", onClick: () => setSliders(defaultSliders) }]}
      />

      <div className={styles.content}>
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
