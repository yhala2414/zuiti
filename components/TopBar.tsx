import Link from "next/link";
import { topBarCopy } from "@/config";
import styles from "./TopBar.module.css";

type TopBarProps = {
  title?: string;
  backHref?: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    icon?: "spark" | "trash" | "star" | "share" | "reset";
    onClick?: () => void;
    active?: boolean;
  }>;
};

export function TopBar({ title, backHref, subtitle, actions = [] }: TopBarProps) {
  return (
    <header className={styles.header}>
      {title ? (
        <div className={styles.navBar}>
          {backHref ? (
            <Link
              href={backHref}
              className={styles.backButton}
              aria-label={topBarCopy.backAriaLabel}
            >
              ‹
            </Link>
          ) : (
            <span />
          )}
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          <div className={styles.actions}>
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={styles.actionButton}
                aria-label={action.label}
                aria-pressed={action.active}
                onClick={action.onClick}
              >
                {action.icon ? (
                  <span className={`${styles.actionIcon} ${styles[action.icon]}`} aria-hidden="true" />
                ) : null}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
