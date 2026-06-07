import Link from "next/link";
import { DecorativeIcon } from "./DecorativeIcon";
import type { IconKind } from "./content";
import styles from "./SceneCard.module.css";

type SceneCardProps = {
  title: string;
  subtitle: string;
  href: string;
  icon: IconKind;
  context: string;
  onClick?: () => void;
};

export function SceneCard({ title, subtitle, href, icon, context, onClick }: SceneCardProps) {
  return (
    <Link href={href} className="scene-card" aria-label={`${title}，${context}`} onClick={onClick}>
      <DecorativeIcon kind={icon} size="lg" />
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </Link>
  );
}
