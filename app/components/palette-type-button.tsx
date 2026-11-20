import type { ComponentProps, ReactNode } from "react";

type PaletteTypeButtonProps = ComponentProps<"button"> & {
  /** The mode icon, e.g. <IconModeAnalogous />. 32×32, decorative. */
  icon: ReactNode;
};

/*
 * One option in the palette type picker (Analogous, Complementary, …).
 *
 * Labelled variant, default state: icon stacked above the label, centred.
 * Padding 8 (top/bottom) and 12 (sides), gap 4, radius 16, no border,
 * transparent background. Label in Text Preset 9 (13px bold), text color.
 * Size hugs the content: 32px icon + 4 + 17px label line + padding
 * = 69px tall; "Analogous" is 90px wide.
 *
 * Hover: 2px border in the divider token (#DDE1DD light), background
 * stays transparent. Same as Tab. Drawn as an inset ring, so the button
 * doesn't change size. Only on enabled buttons, and only on devices that
 * can hover.
 *
 * Selected and focus states, and the other variants, come next.
 */
export function PaletteTypeButton({ icon, className, children, ...props }: PaletteTypeButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex shrink-0 cursor-pointer flex-col items-center gap-paintbox-050 whitespace-nowrap",
        "rounded-paintbox-16 px-paintbox-150 py-paintbox-100",
        "text-preset-9 text-text",
        "hover:enabled:inset-ring-2 hover:enabled:inset-ring-divider",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
