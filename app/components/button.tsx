import type { ComponentProps, ReactNode } from "react";

type ButtonProps = Omit<ComponentProps<"button">, "aria-pressed"> & {
  /** Leading icon, e.g. <IconCopyAll />. Rendered decoratively. */
  icon?: ReactNode;
  /**
   * Leave undefined for a plain action button.
   * Pass a boolean to make it a toggle: sets aria-pressed.
   * For a button that opens a menu (e.g. "Copy palette"), don't use this:
   * pass aria-haspopup="menu" and aria-expanded={open} instead. Both give
   * the same pressed-on look.
   */
  pressed?: boolean;
};

/*
 * Labelled header button (icon + text), e.g. "Copy palette".
 *
 * Default state: no border, transparent background, pill shape,
 * height 40, padding-inline 12 (no vertical padding), icon–label gap 8,
 * Text Preset 8 (Bold), text color token. Width hugs the content
 * (133px for "Copy palette"). Icon and label are optically centred
 * (label trimmed to cap height), same as Tab.
 *
 * Hover: surface-alt background (#ECEFEC light, #2A2E34 dark), no border,
 * filling the pill. Same as IconButton. Only on enabled buttons, and only
 * on devices that can hover.
 *
 * Pressed on (aria-pressed="true", or aria-expanded="true" while its menu
 * is open): surface-alt background and a 2px text-muted ring (#545B63
 * light), drawn inset so the size doesn't change. Same as IconButton and
 * the selected Tab. Hovering it looks the same (same fill color).
 *
 * Focus and disabled states come next.
 */
export function Button({ icon, pressed, className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={[
        "inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-100 whitespace-nowrap",
        "rounded-paintbox-full px-paintbox-150",
        "text-preset-8-bold text-text",
        "hover:enabled:bg-surface-alt",
        "aria-pressed:bg-surface-alt aria-pressed:inset-ring-2 aria-pressed:inset-ring-text-muted",
        "aria-expanded:bg-surface-alt aria-expanded:inset-ring-2 aria-expanded:inset-ring-text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {/* Trim the label box to cap height → baseline so flex centering lines
          the letters up with the icon (see Tab). */}
      <span className="[text-box:trim-both_cap_alphabetic]">{children}</span>
    </button>
  );
}
