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
 * When wiring it to the menu, pass aria-expanded={open} and aria-controls.
 * There's no aria-haspopup: the menu is a radiogroup, which isn't one of
 * the popup roles. The accessible name is the visible text, e.g.
 * "Palette type Analogous".
 *
 * Waiting, open and focus states come next.
 */
export function PaletteTypeTrigger({ icon, className, children, ...props }: PaletteTypeTriggerProps) {
  return (
    <button
      type="button"
      className={[
        // The mode icons are drawn at 32px; :first-child so only that one shrinks, not the chevron.
        "flex h-paintbox-600 w-[14.75rem] shrink-0 cursor-pointer items-center gap-paintbox-100 [&>svg:first-child]:size-paintbox-300",
        "group rounded-paintbox-full bg-surface-alt pr-paintbox-150 pl-paintbox-200 text-left text-text",
        "hover:enabled:bg-divider",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col">
        {/* Turns to the text color while the button is hovered. */}
        <span className="truncate text-preset-9 text-text-muted group-enabled:group-hover:text-text">Palette type</span>
        <span className="truncate text-preset-8-bold">{children}</span>
      </span>
      <IconChevronUp className="shrink-0" />
    </button>
  );
}
