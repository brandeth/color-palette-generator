import type { ComponentProps, ReactNode } from "react";

type ButtonProps = ComponentProps<"button"> & {
  /** Leading icon, e.g. <IconCopyAll />. Rendered decoratively. */
  icon?: ReactNode;
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
 * Pressed, focus and disabled states come next.
 */
export function Button({ icon, className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-100 whitespace-nowrap",
        "rounded-paintbox-full px-paintbox-150",
        "text-preset-8-bold text-text",
        "hover:enabled:bg-surface-alt",
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
