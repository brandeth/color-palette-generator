import type { ComponentProps, ReactNode } from "react";
import { IconCheck } from "./icons";

type PaletteTypeButtonProps = Omit<ComponentProps<"button">, "role" | "aria-checked"> & {
  /** The mode icon, e.g. <IconModeAnalogous />. 32×32, decorative. */
  icon: ReactNode;
  /** Whether this is the chosen palette type. Sets aria-checked. */
  selected?: boolean;
  /**
   * "labelled" (default): hugs its content, 32px icon.
   * "cell": fixed 138px wide, 24px icon, for a grid of options.
   * "row": full width, icon on the left, title and description, for a list.
   */
  variant?: "labelled" | "cell" | "row";
  /** Row variant only: a short line under the title. */
  description?: ReactNode;
  /**
   * Row variant only. "compact" uses 4px top/bottom padding instead of 8,
   * so the row is 53px tall instead of 61. Same name as Tab's size prop.
   */
  size?: "default" | "compact";
};

// Icon above the label, centred.
const stacked =
  "inline-flex flex-col items-center gap-paintbox-050 whitespace-nowrap rounded-paintbox-16 px-paintbox-150 py-paintbox-100 text-preset-9";

const variantClasses = {
  labelled: stacked,
  // The mode icons are drawn at 32px; cell and row shrink them to 24.
  cell: `${stacked} w-[8.625rem] [&>svg]:size-paintbox-300`,
  // :first-child so only the mode icon shrinks, not the checkmark.
  row: "flex w-full items-center gap-paintbox-150 rounded-paintbox-12 px-paintbox-200 text-left [&>svg:first-child]:size-paintbox-300",
};

const rowPaddingBySize = {
  default: "py-paintbox-100", // 8px → 61px tall
  compact: "py-paintbox-050", // 4px → 53px tall
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
 * Row variant: icon on the left, centred vertically, then the title
 * (Text Preset 7 Bold, 16px) above the description (Text Preset 8,
 * 14px, text-muted). Padding 8 (top/bottom) and 16 (sides), gap 12,
 * radius 12. Fills the width of its container (335px in the design);
 * 8 + 24.8 + 20.3 + 8 = 61px tall. The description may wrap; when it
 * does, its lines are balanced ("A colour and its opposite, / for strong
 * contrast").
 * Hover, selected and focus use the same styles as the other variants.
 *
 * Row selected: also a 20px checkmark in the text color at the right
 * (16px from the edge, 12px after the text), lined up with the title
 * line rather than the middle of the row. The check's space is kept
 * when it's hidden, so selecting doesn't re-wrap the description. It's
 * decorative; aria-checked already says the option is selected.
 *
 * Compact row (size="compact"): 4px top/bottom padding instead of 8, so
 * 4 + 24.8 + 20.3 + 4 = 53px tall. Everything else is the same; the
 * checkmark still lines up with the title.
 */
export function PaletteTypeButton({
  icon,
  selected = false,
  variant = "labelled",
  description,
  size = "default",
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
        "shrink-0 cursor-pointer text-text",
        variantClasses[variant],
        variant === "row" ? rowPaddingBySize[size] : "",
        // not-aria-checked: so hover doesn't swap the selected border for the lighter one.
        "hover:enabled:not-aria-checked:inset-ring-2 hover:enabled:not-aria-checked:inset-ring-divider",
        "aria-checked:bg-surface-alt aria-checked:inset-ring-2 aria-checked:inset-ring-text-muted",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {variant === "row" ? (
        // Text and check share a row, so the check stays level with the title
        // even when the row is taller than its text (as in the palette type menu).
        <span className="flex min-w-0 flex-1 items-start gap-paintbox-150">
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-preset-7-bold">{children}</span>
            {/* text-balance: a wrapped description splits into even lines, as in the design. */}
            {description ? <span className="text-preset-8 text-balance text-text-muted">{description}</span> : null}
          </span>
          {/* mt: (title line 1.55rem - 20px icon) / 2, so it centres on the title. */}
          <IconCheck className={["mt-[0.15rem] shrink-0", selected ? "" : "invisible"].join(" ")} />
        </span>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
}
