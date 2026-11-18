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
 * Icon and label are optically centred (label trimmed to cap height).
 *
 * Hover: 2px border in the divider token (#DDE1DD light). Drawn as an
 * inset ring (box-shadow), not a real border, so the tab doesn't change
 * size or shift its neighbours. Tailwind only applies hover: on devices
 * that can hover, so taps on touch screens don't leave it stuck on.
 *
 * Selected (`selected` → aria-selected="true"): surface-alt background
 * (#ECEFEC light) and a 2px text-muted ring (#545B63 light), also inset.
 * The hover ring only applies to unselected tabs, so hovering the
 * selected tab doesn't swap its darker ring for the lighter one.
 *
 * Focus state comes next.
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
        "hover:not-aria-selected:inset-ring-2 hover:not-aria-selected:inset-ring-divider",
        "aria-selected:bg-surface-alt aria-selected:inset-ring-2 aria-selected:inset-ring-text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {/* Trim the label box to cap height → baseline so flex centering lines
          the letters up with the icon. Funnel Sans has more space above caps
          than below the baseline, which otherwise sits the text ~0.4px low.
          Browsers without text-box support just keep the default box. */}
      <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>
    </button>
  );
}
