"use client";

import type { CSSProperties } from "react";
import { Slider } from "antd-mobile";
import stylesCss from "./ToneSlider.module.css";

type ToneSliderProps = {
  title: string;
  left: string;
  right: string;
  value: number;
  dark?: boolean;
  hint?: string;
  onChange?: (value: number) => void;
};

type SliderStyle = CSSProperties & {
  "--fill-color": string;
  "--track-height": string;
};

type VisualTrackStyle = CSSProperties & {
  "--value": string;
  "--visual-height": string;
};

export function ToneSlider({
  title,
  left,
  right,
  value,
  dark = false,
  hint,
  onChange,
}: ToneSliderProps) {
  const sliderStyle: SliderStyle = {
    "--fill-color": "transparent",
    "--track-height": "22px",
  };

  const visualTrackStyle: VisualTrackStyle = {
    "--value": `${value}%`,
    "--visual-height": `${3 + value * 0.055}px`,
  };

  return (
    <section className={`soft-card ${stylesCss.container}`}>
      <div className={stylesCss.header}>
        <h2 className={stylesCss.title}>{title}</h2>
        <span className={stylesCss.value}>{value}%</span>
      </div>
      <div className={stylesCss.sliderRow}>
        <span className={stylesCss.leftLabel}>{left}</span>
        <div className={stylesCss.sliderWrapper}>
          <div
            className={`${stylesCss.visualTrack} ${dark ? stylesCss.visualTrackDark : ""}`}
            style={visualTrackStyle}
            aria-hidden="true"
          />
          <Slider
            value={value}
            onChange={(nextValue) => {
              if (typeof nextValue === "number") {
                onChange?.(nextValue);
              }
            }}
            style={sliderStyle}
            icon={<div className={`${stylesCss.thumb} ${dark ? stylesCss.thumbDark : ""}`} />}
          />
        </div>
        <span className={stylesCss.rightLabel}>
          {right}
        </span>
      </div>
      {hint ? <p className={stylesCss.hint}>{hint}</p> : null}
    </section>
  );
}
