"use client";

import { Suspense, useEffect, useMemo } from "react";
import type { CSSProperties } from "react";
import { TextArea } from "antd-mobile";
import { useSearchParams } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StyleCard } from "@/components/StyleCard";
import { TopBar } from "@/components/TopBar";
import { scenes, styles } from "@/components/content";
import { inputPageCopy } from "@/config";
import { useExpressionFlowStore } from "@/stores/expression-flow-store";
import { getStyleByIndex, getStyleIndex, isScene } from "@/utils/content-mapping";
import stylesCss from "./page.module.css";

const textAreaStyle: CSSProperties & { "--color": string } = {
  "--color": "#30364a",
};

function InputContent() {
  const searchParams = useSearchParams();
  const value = useExpressionFlowStore((state) => state.text);
  const activeStyle = useExpressionFlowStore((state) => state.style);
  const setValue = useExpressionFlowStore((state) => state.setText);
  const setStyle = useExpressionFlowStore((state) => state.setStyle);
  const storeScene = useExpressionFlowStore((state) => state.scene);
  const setScene = useExpressionFlowStore((state) => state.setScene);

  useEffect(() => {
    const sceneKey = searchParams.get("scene");
    if (isScene(sceneKey)) {
      setScene(sceneKey);
    }
  }, [searchParams, setScene]);

  const scene = useMemo(() => {
    const sceneKey = storeScene ?? searchParams.get("scene");
    return scenes.find((item) => item.key === sceneKey);
  }, [searchParams, storeScene]);

  const canContinue = value.trim().length >= 2;

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
              onClick: () => setValue(inputPageCopy.exampleRawText),
            },
            { label: inputPageCopy.clearAction, icon: "trash", onClick: () => setValue("") },
          ]}
        />

        <section className={stylesCss.section1}>
          <div className={stylesCss.labelRow}>
            <label
              htmlFor="raw-thought"
              className={stylesCss.label}
            >
              {inputPageCopy.fieldLabel}
            </label>
            {scene ? <span>{scene.context}</span> : <span>{inputPageCopy.emptySceneHint}</span>}
          </div>
          <div className={`soft-card ${stylesCss.textAreaContainer}`}>
            <TextArea
              id="raw-thought"
              className={stylesCss.textArea}
              value={value}
              onChange={setValue}
              placeholder={inputPageCopy.textAreaPlaceholder}
              maxLength={300}
              showCount
              rows={9}
              style={textAreaStyle}
            />
          </div>
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
                active={index === getStyleIndex(activeStyle)}
                onClick={() => setStyle(getStyleByIndex(index))}
              />
            ))}
          </div>
        </section>

        <p className={stylesCss.hint}>
          {canContinue ? inputPageCopy.readyHint : inputPageCopy.blockedHint}
        </p>
        <div className={stylesCss.buttonWrapper}>
          {canContinue ? (
            <PrimaryButton href="/tone" sparkle>
              {inputPageCopy.primaryAction}
            </PrimaryButton>
          ) : (
            <button type="button" className="primary-button" disabled>
              <span>{inputPageCopy.primaryAction}</span>
            </button>
          )}
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
