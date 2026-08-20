import { DecorativeIcon } from "./DecorativeIcon";
import type { ExpressionCatalogIcon } from "@/lib/catalog/expression-catalog";
import styles from "./StyleCard.module.css";

type StyleCardProps = {
  title: string;
  detail: string;
  icon: ExpressionCatalogIcon;
  active?: boolean;
  onClick?: () => void;
};

export function StyleCard({
  title,
  detail,
  icon,
  active = false,
  onClick,
}: StyleCardProps) {
  return (
    <button
      type="button"
      className={`style-card group ${active ? "active" : ""}`}
      aria-pressed={active}
      aria-label={`${title}：${detail}`}
      onClick={onClick}
    >
      <DecorativeIcon kind={icon} size="md" />
      <span className={styles.title}>{title}</span>
      <span className={styles.detail}>{detail}</span>
    </button>
  );
}
