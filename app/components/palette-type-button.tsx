import type { ComponentProps, ReactNode } from "react";

type PaletteTypeButtonProps = Omit<ComponentProps<"button">, "role" | "aria-checked"> & {
  /** The mode icon, e.g. <IconModeAnalogous />. 32×32, decorative. */
  icon: ReactNode;
  /** Whether this is the chosen palette type. Sets aria-checked. */
  selected?: boolean;
  /**
   * "labelled" (default): hugs its content, 32px icon.
   * "cell": fixed 138px wide, 24px icon, for a grid of options.
   */
  variant?: "labelled" | "cell";
};

const variantClasses = {
  labelled: "",
  // The mode icons are drawn at 32px; the cell shrinks them to 24.
  cell: "w-[8.625rem] [&>svg]:size-paintbox-300",
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
 * can hover. Skipped on the selected option, so it keeps its own border.
 *
 * Selected: surface-alt background (#ECEFEC light) with a 2px border in
 * text-muted (#545B63 light), same as a pressed icon button. Also an
 * inset ring, so the size doesn't change.
 *
 * Only one palette type can be picked, so each option is a radio
 * (role="radio" + aria-checked) and the picker that holds them should be
 * a role="radiogroup" with a label. The group handles the arrow keys and
 * makes only the selected option tabbable (tabIndex 0, the rest -1).
 *
 * Focus (keyboard only, :focus-visible): 3px outline in the focus token
 * (#6A2BC9 light), 2px outside the button, same as the other buttons.
 * Because Tab lands on the selected option, it usually shows together
 * with the selected look. A mouse click doesn't show it.
 *
 * Cell variant: same layout, padding, gap, label and states, but a fixed
 * 138px width with the content centred, and a 24px icon:
 * 8 + 24 + 4 + 17 + 8 = 61px tall.
 *
 * The row variant (with a description) comes next.
 */
export function PaletteTypeButton({
  icon,
  selected = false,
  variant = "labelled",
  className,
  children,
  ...props
}: PaletteTypeButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={[
        "inline-flex shrink-0 cursor-pointer flex-col items-center gap-paintbox-050 whitespace-nowrap",
        "rounded-paintbox-16 px-paintbox-150 py-paintbox-100",
        "text-preset-9 text-text",
        // not-aria-checked: so hover doesn't swap the selected border for the lighter one.
        "hover:enabled:not-aria-checked:inset-ring-2 hover:enabled:not-aria-checked:inset-ring-divider",
        "aria-checked:bg-surface-alt aria-checked:inset-ring-2 aria-checked:inset-ring-text-muted",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        variantClasses[variant],
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
