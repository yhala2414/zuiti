"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { TextArea } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import { exampleTextsByTarget, scenes, styles, targetOptionsByScene } from "@/components/content";
import { inputPageCopy } from "@/config";
import { maxInputTextLength, minInputTextLength, softInputTextLength } from "@/lib/domain/defaults";
import { useExpressionFlowStore } from "@/stores/expression-flow-store";
import type { Scene, TargetId } from "@/stores/expression-flow-store";
import { getStyleByIndex, getStyleIndex, isScene, isTarget, normalizeStyle } from "@/utils/content-mapping";
import stylesCss from "./page.module.css";

const textAreaStyle: CSSProperties & { "--color": string } = {
  "--color": "#30364a",
};

function InputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const value = useExpressionFlowStore((state) => state.text);
  const activeStyle = useExpressionFlowStore((state) => state.style);
  const activeTarget = useExpressionFlowStore((state) => state.target);
  const setValue = useExpressionFlowStore((state) => state.setText);
  const setStyle = useExpressionFlowStore((state) => state.setStyle);
  const setScene = useExpressionFlowStore((state) => state.setScene);
  const setTarget = useExpressionFlowStore((state) => state.setTarget);
  const storeScene = useExpressionFlowStore((state) => state.scene);
  const applySceneDefaults = useExpressionFlowStore((state) => state.applySceneDefaults);
  const applyContextDefaults = useExpressionFlowStore((state) => state.applyContextDefaults);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const sceneKey = searchParams.get("scene");
    if (isScene(sceneKey)) {
      applySceneDefaults(sceneKey);
    }

    const targetKey = searchParams.get("target");
    if (isTarget(targetKey)) {
      setTarget(targetKey);
    }

    const styleKey = normalizeStyle(searchParams.get("style"));
    if (styleKey) {
      setStyle(styleKey);
    }
  }, [applySceneDefaults, searchParams, setStyle, setTarget]);

  const scene = useMemo(() => {
    const sceneKey = storeScene ?? searchParams.get("scene");
    return scenes.find((item) => item.key === sceneKey);
  }, [searchParams, storeScene]);
  const targetOptions = storeScene ? targetOptionsByScene[storeScene] : [];
  const activeTargetOption = targetOptions.find((item) => item.key === activeTarget);
  const activeStyleMeta = activeStyle ? styles.find((item) => item.key === activeStyle) : null;
  const overSoftLimit = value.length > softInputTextLength;
  const canContinue = Boolean(
    storeScene &&
      activeTarget &&
      activeStyle &&
      value.trim().length >= minInputTextLength,
  );

  const handleSceneSelect = (sceneKey: Scene) => {
    setFeedback("");
    setScene(sceneKey);
  };

  const handleTargetSelect = (targetKey: TargetId) => {
    if (!storeScene) {
      return;
    }

    setFeedback("");
    applyContextDefaults(storeScene, targetKey);
  };

  const handleExample = () => {
    setFeedback("");
    setValue(activeTarget ? exampleTextsByTarget[activeTarget] : inputPageCopy.exampleRawText);
  };

  const handleContinue = () => {
    if (!storeScene) {
      setFeedback(inputPageCopy.missingSceneToast);
      return;
    }

    if (!activeTarget) {
      setFeedback(inputPageCopy.missingTargetToast);
      return;
    }

    if (!activeStyle) {
      setFeedback(inputPageCopy.missingStyleToast);
      return;
    }

    if (value.trim().length < minInputTextLength) {
      setFeedback(inputPageCopy.missingTextToast);
      return;
    }

    setFeedback("");
    router.push("/tone");
  };

  return (
    <MobileShell className={stylesCss.container}>
      <div className={stylesCss.pageContent}>
        <TopBar
          title={inputPageCopy.title}
          backHref="/"
          actions={[
            {
              label: inputPageCopy.exampleAction,
              icon: "spark",
              onClick: handleExample,
            },
            { label: inputPageCopy.clearAction, icon: "trash", onClick: () => setValue("") },
          ]}
        />

        <section className={stylesCss.section2}>
          <div className={stylesCss.sectionTitleRow}>
            <h2 className={stylesCss.sectionTitle}>{inputPageCopy.sceneSectionTitle}</h2>
            <span>{inputPageCopy.sceneSectionHint}</span>
          </div>
          <div className={stylesCss.sceneGrid}>
            {scenes.map((sceneItem) => (
              <button
                key={sceneItem.key}
                type="button"
                className={`${stylesCss.choiceCard} ${storeScene === sceneItem.key ? stylesCss.choiceActive : ""}`}
                aria-pressed={storeScene === sceneItem.key}
                onClick={() => handleSceneSelect(sceneItem.key)}
              >
                <DecorativeIcon kind={sceneItem.icon} size="sm" />
                <strong>{sceneItem.title}</strong>
                <span>{sceneItem.subtitle}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={stylesCss.section2}>
          <div className={stylesCss.sectionTitleRow}>
            <h2 className={stylesCss.sectionTitle}>{inputPageCopy.targetSectionTitle}</h2>
            <span>{storeScene ? inputPageCopy.targetSectionHint : inputPageCopy.targetEmptyHint}</span>
          </div>
          <div className={stylesCss.targetList}>
            {targetOptions.map((target) => (
              <button
                key={target.key}
                type="button"
                className={`${stylesCss.targetPill} ${activeTarget === target.key ? stylesCss.targetActive : ""}`}
                aria-pressed={activeTarget === target.key}
                onClick={() => handleTargetSelect(target.key)}
              >
                <strong>{target.title}</strong>
                <span>{target.detail}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={stylesCss.section1}>
          <div className={stylesCss.labelRow}>
            <label
              htmlFor="raw-thought"
              className={stylesCss.label}
            >
              {inputPageCopy.fieldLabel}
            </label>
            {scene && activeTargetOption ? (
              <span>{scene.title} · {activeTargetOption.title}</span>
            ) : (
              <span>{inputPageCopy.emptySceneHint}</span>
            )}
          </div>
          <div className={`soft-card ${stylesCss.textAreaContainer}`}>
            <TextArea
              id="raw-thought"
              className={stylesCss.textArea}
              value={value}
              onChange={setValue}
              placeholder={inputPageCopy.textAreaPlaceholder}
              maxLength={maxInputTextLength}
              showCount
              rows={7}
              style={textAreaStyle}
            />
          </div>
          {overSoftLimit ? <p className={stylesCss.warningHint}>{inputPageCopy.overSoftLimitHint}</p> : null}
        </section>

        <section className={stylesCss.section2}>
          <div className={stylesCss.sectionTitleRow}>
            <h2 className={stylesCss.sectionTitle}>{inputPageCopy.styleSectionTitle}</h2>
            <span>{inputPageCopy.styleSectionHint}</span>
          </div>
          <div className={stylesCss.cardList}>
            {styles.map((style, index) => (
              <StyleCard
                key={style.key}
                title={style.title}
                detail={style.detail}
                icon={style.icon}
                active={activeStyle ? index === getStyleIndex(activeStyle) : false}
                onClick={() => setStyle(getStyleByIndex(index))}
              />
            ))}
          </div>
          <div className={`soft-card ${stylesCss.styleDescription}`}>
            <strong>{inputPageCopy.styleDescriptionTitle}</strong>
            <span>{activeStyleMeta ? `${activeStyleMeta.title} · ${activeStyleMeta.detail}` : inputPageCopy.missingStyleToast}</span>
            <p>{activeStyleMeta?.description ?? inputPageCopy.blockedHint}</p>
          </div>
        </section>

        <p className={stylesCss.hint}>
          {canContinue ? inputPageCopy.readyHint : inputPageCopy.blockedHint}
        </p>
        {feedback ? (
          <p className={stylesCss.feedbackHint} role="status" aria-live="polite">
            {feedback}
          </p>
        ) : null}
        <div className={stylesCss.buttonWrapper}>
          <button type="button" className="primary-button" onClick={handleContinue} aria-disabled={!canContinue}>
            <span>{inputPageCopy.primaryAction}</span>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}

export default function InputPage() {
  return (
    <Suspense>
      <InputContent />
    </Suspense>
  );
}
