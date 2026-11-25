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

const inkBySwatch = {
  light: "border-on-swatch-dark text-on-swatch-dark",
  dark: "border-on-swatch-light text-on-swatch-light",
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
 * Hover, focus and the locked state come next.
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
