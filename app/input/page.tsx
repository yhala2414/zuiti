"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { TextArea } from "antd-mobile";
import { useRouter, useSearchParams } from "next/navigation";
import { DecorativeIcon } from "@/components/DecorativeIcon";
import { MobileShell } from "@/components/MobileShell";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import {
  exampleTextByTarget,
  sceneCatalog,
  styleCatalog,
  targetCatalogByScene,
} from "@/lib/catalog/expression-catalog";
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
    return sceneCatalog.find((item) => item.key === sceneKey);
  }, [searchParams, storeScene]);
  const targetOptions = storeScene ? targetCatalogByScene[storeScene] : [];
  const activeTargetOption = targetOptions.find((item) => item.key === activeTarget);
  const activeStyleMeta = activeStyle ? styleCatalog.find((item) => item.key === activeStyle) : null;
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
    setValue(activeTarget ? exampleTextByTarget[activeTarget] : "这个活不是我负责的，别老找我。");
  };

  const handleContinue = () => {
    if (!storeScene) {
      setFeedback("请先选择沟通场景");
      return;
    }

    if (!activeTarget) {
      setFeedback("请先选择沟通对象");
      return;
    }

    if (!activeStyle) {
      setFeedback("请先选择表达风格");
      return;
    }

    if (value.trim().length < minInputTextLength) {
      setFeedback("请至少输入 2 个字");
      return;
    }

    setFeedback("");
    router.push("/tone");
  };

  return (
    <MobileShell className={stylesCss.container}>
      <div className={stylesCss.pageContent}>
        <TopBar
          title="你想说的话"
          backHref="/"
          actions={[
            {
              label: "示例",
              icon: "spark",
              onClick: handleExample,
            },
            { label: "清空", icon: "trash", onClick: () => setValue("") },
          ]}
        />

        <section className={stylesCss.section2}>
          <div className={stylesCss.sectionTitleRow}>
            <h2 className={stylesCss.sectionTitle}>选择场景</h2>
            <span>先定沟通语境</span>
          </div>
          <div className={stylesCss.sceneGrid}>
            {sceneCatalog.map((sceneItem) => (
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
            <h2 className={stylesCss.sectionTitle}>选择对象</h2>
            <span>{storeScene ? "对象会影响语气默认值" : "请先选择一个场景"}</span>
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
              对什么人，说什么话
            </label>
            {scene && activeTargetOption ? (
              <span>{scene.title} · {activeTargetOption.title}</span>
            ) : (
              <span>一句原话，也可以有更好的说法</span>
            )}
          </div>
          <div className={`soft-card ${stylesCss.textAreaContainer}`}>
            <TextArea
              id="raw-thought"
              className={stylesCss.textArea}
              value={value}
              onChange={setValue}
              placeholder={"在这里输入你想说的话...\n\n例如：这个活不是我负责的，别老找我。"}
              maxLength={maxInputTextLength}
              showCount
              rows={7}
              style={textAreaStyle}
            />
          </div>
          {overSoftLimit ? (
            <p className={stylesCss.warningHint}>超过 300 字后可能影响转换聚焦，建议删到最关键的事实和诉求。</p>
          ) : null}
        </section>

        <section className={stylesCss.section2}>
          <div className={stylesCss.sectionTitleRow}>
            <h2 className={stylesCss.sectionTitle}>选择风格</h2>
            <span>左右滑动选择</span>
          </div>
          <div className={stylesCss.cardList}>
            {styleCatalog.map((style, index) => (
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
            <strong>当前风格</strong>
            <span>{activeStyleMeta ? `${activeStyleMeta.title} · ${activeStyleMeta.detail}` : "请先选择表达风格"}</span>
            <p>{activeStyleMeta?.description ?? "先选场景、对象和风格，再输入至少 2 个字"}</p>
          </div>
        </section>

        <p className={stylesCss.hint}>
          {canContinue ? "左右滑动，选择你喜欢的风格" : "先选场景、对象和风格，再输入至少 2 个字"}
        </p>
        {feedback ? (
          <p className={stylesCss.feedbackHint} role="status" aria-live="polite">
            {feedback}
          </p>
        ) : null}
        <div className={stylesCss.buttonWrapper}>
          <button type="button" className="primary-button" onClick={handleContinue} aria-disabled={!canContinue}>
            <span>开始转换</span>
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
