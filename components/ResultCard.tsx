"use client";

import { useState, type CSSProperties } from "react";
import { resultCardCopy } from "@/config";
import styles from "./ResultCard.module.css";

type ResultCardProps = {
  label: string;
  text: string;
  tone: "lavender" | "blue" | "pink";
  icon: "wechat" | "mail" | "face";
  fit: string;
  tags: readonly string[];
  index?: number;
  onCopy?: () => void;
  onUseful?: () => void;
  onRegenerate?: () => void;
  onSwitchStyle?: () => void;
  usefulActive?: boolean;
};

const toneClass = {
  lavender: styles.lavender,
  blue: styles.blue,
  pink: styles.pink,
};

const resultIconClass = {
  wechat: styles.wechat,
  mail: styles.mail,
  face: styles.face,
};

type ResultStyle = CSSProperties & {
  "--delay": string;
};

export function ResultCard({
  label,
  text,
  tone,
  icon,
  fit,
  tags,
  index = 0,
  onCopy,
  onUseful,
  onRegenerate,
  onSwitchStyle,
  usefulActive = false,
}: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const resultStyle: ResultStyle = {
    "--delay": `${index * 90}ms`,
  };

  return (
    <article
      className={`soft-card ${styles.container}`}
      style={resultStyle}
    >
      <header className={styles.header}>
        <span className={`${styles.iconPill} ${toneClass[tone]}`}>
          <span className={`${styles.resultIcon} ${resultIconClass[icon]}`} aria-hidden="true" />
        </span>
        <div>
          <span className={`${styles.label} ${toneClass[tone]}`}>
            {label}
          </span>
          <p className={styles.fit}>{fit}</p>
        </div>
        <button
          type="button"
          className={`${styles.expandButton} ${expanded ? styles.expanded : ""}`}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? resultCardCopy.collapseAction : resultCardCopy.expandAction}
          <span className={styles.chevron} aria-hidden="true" />
        </button>
      </header>
      <p className={`${styles.text} ${expanded ? styles.textExpanded : ""}`}>
        {text}
      </p>
      <div className={styles.tags} aria-label={resultCardCopy.tagsAriaLabel}>
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className={styles.actions}>
        <button type="button" className="result-action" onClick={onCopy}>
          <span className="action-icon copy" aria-hidden="true" />
          {resultCardCopy.copyAction}
        </button>
        <button
          type="button"
          className={`result-action ${usefulActive ? styles.actionActive : ""}`}
          onClick={onUseful}
          aria-pressed={usefulActive}
        >
          <span className="action-icon star" aria-hidden="true" />
          {usefulActive ? resultCardCopy.usefulActiveAction : resultCardCopy.usefulAction}
        </button>
        <button type="button" className="result-action" onClick={onRegenerate}>
          <span className="action-icon refresh" aria-hidden="true" />
          {resultCardCopy.regenerateAction}
        </button>
        <button type="button" className="result-action" onClick={onSwitchStyle}>
          <span className="action-icon switch" aria-hidden="true" />
          {resultCardCopy.switchStyleAction}
        </button>
      </div>
    </article>
  );
}
