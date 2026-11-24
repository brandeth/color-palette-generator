import type { ComponentProps, ReactNode } from "react";
import { IconChevronUp } from "./icons";

type PaletteTypeTriggerProps = ComponentProps<"button"> & {
  /** The current type's mode icon, e.g. <IconModeAnalogous />. Shown at 24px, decorative. */
  icon: ReactNode;
  /** children: the current type's name, e.g. "Analogous". */
};

/*
 * The button that opens the palette type menu. Shows the current type:
 * its mode icon, a "Palette type" label and the type's name, with a
 * chevron at the right. (PaletteTypeButton is one option inside the menu.)
 *
 * Default state (waiting off): 236×48, pill shape, surface-alt background
 * (#ECEFEC light), no border. Padding 16 on the left, 12 on the right.
 * 24px mode icon, then 8px gap, then the text, then a 20px chevron in the
 * text color pinned to the right edge.
 * Text: "Palette type" in Text Preset 9 (13px bold), text-muted, above the
 * type's name in Text Preset 8 Bold (14px), text color. The two lines are
 * stacked with no gap (17 + 20 = 37px) and centred vertically.
 *
 * Hover: background darkens to the divider token (#DDE1DD light, #33373E
 * dark) and the "Palette type" label goes from text-muted to the text
 * color. Nothing moves or resizes. Only on enabled buttons, and only on
 * devices that can hover.
 *
 * Open (aria-expanded="true", while the menu is showing): a 2px ring in
 * text-muted (#545B63 light) drawn inset, so the size doesn't change.
 * Fill (surface-alt), label and chevron stay as in the default state; the
 * chevron keeps pointing up. Same as Button's pressed-on look. Hovering
 * it looks the same: the hover fill and label color are skipped while open.
 *
 * Focus (keyboard only, :focus-visible): 3px outline in the focus token
 * (#6A2BC9 light), 2px outside the button, same as the other buttons.
 * The fill and label stay as in the default state, and the outline takes
 * no space, so nothing shifts. Applies on top of hover and open.
 *
 * When wiring it to the menu, pass aria-expanded={open} (which also gives
 * the open look) and aria-controls.
 * There's no aria-haspopup: the menu is a radiogroup, which isn't one of
 * the popup roles. The accessible name is the visible text, e.g.
 * "Palette type Analogous".
 *
 * The waiting state comes next.
 */
export function PaletteTypeTrigger({ icon, className, children, ...props }: PaletteTypeTriggerProps) {
  return (
    <button
      type="button"
      className={[
        // The mode icons are drawn at 32px; :first-child so only that one shrinks, not the chevron.
        "flex h-paintbox-600 w-[14.75rem] shrink-0 cursor-pointer items-center gap-paintbox-100 [&>svg:first-child]:size-paintbox-300",
        "group rounded-paintbox-full bg-surface-alt pr-paintbox-150 pl-paintbox-200 text-left text-text",
        // not-aria-expanded: an open button keeps its open look when hovered.
        "hover:enabled:not-aria-expanded:bg-divider",
        "aria-expanded:inset-ring-2 aria-expanded:inset-ring-text-muted",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col">
        {/* Turns to the text color while the button is hovered, unless it's open. */}
        <span className="truncate text-preset-9 text-text-muted group-enabled:group-hover:group-not-aria-expanded:text-text">
          Palette type
        </span>
        <span className="truncate text-preset-8-bold">{children}</span>
      </span>
      <IconChevronUp className="shrink-0" />
    </button>
  );
}
