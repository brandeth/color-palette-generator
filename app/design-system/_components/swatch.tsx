/*
 * A color chip. Shows the CSS variable itself (not a copied hex), over a
 * checkerboard so transparent colors are visible.
 */
export function Swatch({ color, className = "h-paintbox-1000" }: { color: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-paintbox-8 border border-divider ${className}`}
      style={{
        backgroundImage:
          "repeating-conic-gradient(var(--color-paintbox-neutral-200) 0 25%, var(--color-paintbox-neutral-0) 0 50%)",
        backgroundSize: "12px 12px",
      }}
    >
      <div className="size-full" style={{ backgroundColor: color }} />
    </div>
  );
}

/** CSS variable for a paintbox primitive, e.g. "neutral-50". */
export function primitiveVar(name: string) {
  return `var(--color-paintbox-${name})`;
}
