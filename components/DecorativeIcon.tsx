import type { ExpressionCatalogIcon } from "@/lib/catalog/expression-catalog";

type DecorativeIconProps = {
  kind: ExpressionCatalogIcon;
  size?: "sm" | "md" | "lg" | "hero";
};

const sizeClass = {
  sm: "size-14",
  md: "size-20",
  lg: "size-24",
  hero: "size-28",
};

export function DecorativeIcon({ kind, size = "md" }: DecorativeIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`zuiti-icon zuiti-icon-${kind} ${sizeClass[size]}`}
    >
      <span />
    </span>
  );
}
