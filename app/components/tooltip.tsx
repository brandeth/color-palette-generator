import type { ReactNode } from "react";

type TooltipProps = {
  /** The button's name, e.g. "Dark preview". */
  label: string;
  /** Its keyboard shortcut, if it has one, e.g. "Ctrl Z"; shown after the label at 80%. */
  shortcut?: string;
  /**
   * "bottom" (default): centred under the button, 8px down.
   * "right": 8px to its right, centred on it (as Dark preview in the
   * design); below it, right-aligned, on phones, where there's no room.
   */
  side?: "bottom" | "right";
  /** The icon-only button it names. */
  children: ReactNode;
  /** On the wrapper, e.g. to position the button and its tooltip together. */
  className?: string;
};

const sideClasses = {
  bottom: "top-full left-1/2 mt-paintbox-100 -translate-x-1/2",
  right: [
    "top-full right-0 mt-paintbox-100",
    "md:top-1/2 md:right-auto md:left-full md:mt-0 md:ml-paintbox-100 md:-translate-y-1/2",
  ].join(" "),
};

/*
 * Names an icon-only button, with its shortcut when it has one. The same
 * in both page themes, like the toast: a 25px pill in #1B1F24 with a 2px
 * white border and shadow-paintbox-md, padding 4 12 (counted from the
 * outer edge: 2px border + 2px / 10px), Text Preset 9 in white; the
 * shortcut follows 8px after the label at 80%. "Dark preview" is 106px
 * wide.
 *
 * Shows while the button is hovered (on devices that can hover) or has
 * keyboard focus, and never takes clicks. It's decorative: the button's
 * own name (aria-label) and aria-keyshortcuts already say the same to
 * screen readers.
 */
export function Tooltip({ label, shortcut, side = "bottom", children, className }: TooltipProps) {
  return (
    <span className={["group/tooltip relative inline-flex", className].filter(Boolean).join(" ")}>
      {children}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute z-30 hidden items-center gap-paintbox-100 whitespace-nowrap",
          "rounded-paintbox-full border-2 border-paintbox-neutral-0 bg-paintbox-neutral-900 px-[0.625rem] py-[0.125rem]",
          "text-preset-9 text-paintbox-neutral-0 shadow-paintbox-md",
          "group-hover/tooltip:flex group-has-[:focus-visible]/tooltip:flex",
          sideClasses[side],
        ].join(" ")}
      >
        {label}
        {shortcut ? <span className="opacity-80">{shortcut}</span> : null}
      </span>
    </span>
  );
}
