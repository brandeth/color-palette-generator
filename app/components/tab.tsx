import type { ComponentProps, ReactNode } from "react";

type TabProps = Omit<ComponentProps<"button">, "role"> & {
  /** Leading icon, e.g. <IconPalette />. Rendered decoratively. */
  icon?: ReactNode;
  /** Whether this tab's panel is the one showing. */
  selected?: boolean;
};

/*
 * One tab in the Palette / Preview switcher (WAI-ARIA tabs pattern).
 * Must be rendered inside an element with role="tablist".
 *
 * Default state: no border, transparent background, pill shape,
 * height 40, padding-inline 16, icon–label gap 8, Text Preset 8 (Bold),
 * text color token. Width hugs the content (105px for "Palette").
 *
 * Hover: 2px border in the divider token (#DDE1DD light). Drawn as an
 * inset ring (box-shadow), not a real border, so the tab doesn't change
 * size or shift its neighbours. Tailwind only applies hover: on devices
 * that can hover, so taps on touch screens don't leave it stuck on.
 *
 * Selected / focus states come next; `selected` already sets
 * aria-selected so they can be styled with `aria-selected:` classes.
 */
export function Tab({
  icon,
  selected = false,
  className,
  children,
  ...props
}: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={[
        "inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-100 whitespace-nowrap",
        "rounded-paintbox-full px-paintbox-200",
        "text-preset-8-bold text-text",
        "hover:inset-ring-2 hover:inset-ring-divider",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
