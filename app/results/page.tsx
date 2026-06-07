"use client";

import { useCallback, useEffect, useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResultCard } from "@/components/ResultCard";
import { TopBar } from "@/components/TopBar";
import { results } from "@/components/content";
import { resultsPageCopy } from "@/config";
import {
  createRequestKey,
  useExpressionFlowStore,
  type GenerateDraft,
  type GenerateResult,
  type GenerationStatus,
  type OutputMode,
} from "@/stores/expression-flow-store";
import { generateExpression, sendFeedback, trackEvent } from "@/utils/expression-api";
import styles from "./page.module.css";

const resultMeta = Object.fromEntries(results.map((item) => [item.mode, item])) as Record<
  OutputMode,
  (typeof results)[number]
>;

function getRecommendedText(result: GenerateResult, mode: OutputMode) {
  const output = result[mode];
  return output.candidates[output.recommendedIndex] ?? output.candidates[0];
}

function isSuccessStatus(status: GenerationStatus): status is "success-model" | "success-fallback" {
  return status === "success-model" || status === "success-fallback";
}

export default function ResultsPage() {
  const text = useExpressionFlowStore((state) => state.text);
  const sessionId = useExpressionFlowStore((state) => state.sessionId);
  const generation = useExpressionFlowStore((state) => state.generation);
  const buildDraft = useExpressionFlowStore((state) => state.buildDraft);
  const setGenerationLoading = useExpressionFlowStore((state) => state.setGenerationLoading);
  const setGenerationSuccess = useExpressionFlowStore((state) => state.setGenerationSuccess);
  const setGenerationError = useExpressionFlowStore((state) => state.setGenerationError);

  const draft = buildDraft();
  const requestKey = draft ? createRequestKey(draft) : null;
  const generatedResult = generation.result;
  const successStatus = isSuccessStatus(generation.status) ? generation.status : null;
  const successCopy =
    successStatus === "success-fallback"
      ? {
          title: resultsPageCopy.successFallbackTitle,
          description: resultsPageCopy.successFallbackDescription,
        }
      : successStatus === "success-model"
        ? {
            title: resultsPageCopy.successModelTitle,
            description: resultsPageCopy.successModelDescription,
          }
        : null;

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
    await navigator.clipboard?.writeText(copiedText);
    void trackEvent({
      sessionId,
      event: "copy_result",
      payload: {
        mode,
        candidateIndex: generatedResult[mode].recommendedIndex,
      },
    });
  };

  const handleUseful = (mode: OutputMode) => {
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

  return (
    <MobileShell className={styles.container}>
      <TopBar
        title={resultsPageCopy.title}
        subtitle={resultsPageCopy.subtitle}
        backHref="/tone"
        actions={[
          { label: resultsPageCopy.saveAction, icon: "star" },
          { label: resultsPageCopy.shareAction, icon: "share" },
        ]}
      />

      <div className={styles.content}>
        <section className={`soft-card ${styles.originalCard}`}>
          <span>{resultsPageCopy.originalLabel}</span>
          <p>{text.trim() || resultsPageCopy.emptyOriginal}</p>
        </section>

        {!draft ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>{resultsPageCopy.missingDraftTitle}</h2>
            <p>{resultsPageCopy.missingDraftDescription}</p>
            <PrimaryButton href="/input" sparkle>
              {resultsPageCopy.missingDraftAction}
            </PrimaryButton>
          </section>
        ) : null}

        {draft && generation.status === "loading" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>{resultsPageCopy.loadingTitle}</h2>
            <p>{resultsPageCopy.loadingDescription}</p>
          </section>
        ) : null}

        {draft && generation.status === "refused" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>{resultsPageCopy.refusedTitle}</h2>
            <p>{generation.errorMessage ?? resultsPageCopy.refusedFallbackMessage}</p>
            <PrimaryButton href="/input" sparkle>
              {resultsPageCopy.refusedAction}
            </PrimaryButton>
          </section>
        ) : null}

        {draft && generation.status === "fail" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>{resultsPageCopy.failTitle}</h2>
            <p>{generation.errorMessage ?? resultsPageCopy.failFallbackMessage}</p>
            <button type="button" className="primary-button" onClick={handleRegenerate}>
              <span>{resultsPageCopy.retryAction}</span>
            </button>
          </section>
        ) : null}

        {draft && generatedResult && successCopy && successStatus ? (
          <section
            className={`soft-card ${styles.stateCard} ${
              successStatus === "success-fallback" ? styles.fallbackState : styles.modelState
            }`}
          >
            <div className={styles.stateHeader}>
              <h2>{successCopy.title}</h2>
              <span className={styles.stateBadge}>
                {resultsPageCopy.sourceLabels[generatedResult.meta.source]}
              </span>
            </div>
            <p>{successCopy.description}</p>
            <div className={styles.metaRow}>
              <span className={styles.metaPill}>
                {resultsPageCopy.metaSourceLabel}：{resultsPageCopy.sourceLabels[generatedResult.meta.source]}
              </span>
              <span className={styles.metaPill}>
                {resultsPageCopy.metaLanguageLabel}：
                {resultsPageCopy.languageLabels[generatedResult.meta.language]}
              </span>
            </div>
            {generatedResult.safetyNotes.length > 0 ? (
              <p className={styles.metaNote}>{generatedResult.safetyNotes[0]}</p>
            ) : null}
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
                onRegenerate={handleRegenerate}
                onSwitchStyle={() => {
                  void trackEvent({
                    sessionId,
                    event: "switch_style_from_result",
                    payload: { mode: result.mode },
                  });
                  window.location.href = "/input";
                }}
              />
            ))}
          </section>
        ) : null}

        {cards.length > 0 && successStatus ? (
          <button type="button" className={styles.compareButton}>
            <span aria-hidden="true" />
            {resultsPageCopy.compareAction}
          </button>
        ) : null}
      </div>

      <div className={styles.bottomActions}>
        <a href="/tone" className={styles.secondaryButton}>
          {resultsPageCopy.adjustToneAction}
        </a>
        <PrimaryButton href="/input" sparkle>
          {resultsPageCopy.switchStyleAction}
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
