import type { ComponentProps } from "react";
import { IconLockOpen } from "./icons";

type LockButtonProps = Omit<ComponentProps<"button">, "children"> & {
  /**
   * The swatch the button sits on. "light" (default): dark ink
   * (on-swatch-dark, #1B1F24) for light colours. "dark": white ink
   * (on-swatch-light) for dark colours. Pick whichever has more contrast
   * with the swatch. The same in both page themes.
   */
  swatch?: "light" | "dark";
};

// Ink, plus the hover fill: that ink at 15%, so it tints whatever swatch is behind.
const inkBySwatch = {
  light: "border-on-swatch-dark text-on-swatch-dark hover:enabled:bg-on-swatch-dark-hover",
  dark: "border-on-swatch-light text-on-swatch-light hover:enabled:bg-on-swatch-light-hover",
};

/*
 * Locks a colour so Generate keeps it. Sits on the colour's swatch, so
 * its ink follows the swatch (see `swatch`), not the page theme.
 *
 * Labelled variant, lock off, default state: 40px tall pill with a 2px
 * border in the ink colour and a transparent background, so the swatch
 * shows through. Padding 24 inside the border, gap 8. 20px open padlock,
 * then "Lock" in Text Preset 6 Bold (19px), both in the ink colour.
 * "Lock" is 121px wide (2 + 24 + 20 + 8 + 41 + 24 + 2).
 *
 * Hover: fills with the ink colour at 15% (on-swatch-dark-hover or
 * on-swatch-light-hover), so the swatch shows through, tinted: #CECAC3
 * on #EEE8DF, #6F3C61 on #561A45. Border, size and content stay the same.
 * Only on enabled buttons, and only on devices that can hover.
 *
 * Focus (keyboard only, :focus-visible): a dark / white / dark ring that
 * reads on any swatch, so it ignores `swatch`. The 2px border turns dark
 * (on-swatch-dark), a 4px white outline sits right against it, and a 2px
 * dark ring outside that: 6px beyond the button in all. Drawn with
 * outline and box-shadow, so nothing moves. The label and padlock keep
 * the swatch's ink.
 *
 * The locked state comes next.
 */
export function LockButton({ swatch = "light", className, ...props }: LockButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-100 whitespace-nowrap",
        "rounded-paintbox-full border-2 px-paintbox-300",
        "text-preset-6-bold",
        inkBySwatch[swatch],
        // White outline (4px) over a dark ring (6px): dark/white/dark with the border.
        "focus-visible:border-on-swatch-dark",
        "focus-visible:outline-4 focus-visible:outline-offset-0 focus-visible:outline-on-swatch-light",
        "focus-visible:ring-6 focus-visible:ring-on-swatch-dark",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <IconLockOpen />
      {/* No text-box trim: the design centres the whole line, which sits the
          letters slightly below the padlock's middle. */}
      <span>Lock</span>
    </button>
  );
}
