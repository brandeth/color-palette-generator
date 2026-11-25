import type { ComponentProps } from "react";
import { IconLockClosed, IconLockOpen } from "./icons";

type LockButtonProps = Omit<ComponentProps<"button">, "children" | "aria-pressed"> & {
  /**
   * The swatch the button sits on. "light" (default): dark ink
   * (on-swatch-dark, #1B1F24) for light colours. "dark": white ink
   * (on-swatch-light) for dark colours. Pick whichever has more contrast
   * with the swatch. The same in both page themes.
   */
  swatch?: "light" | "dark";
  /** Whether the colour is locked. Fills the pill with the ink; sets aria-pressed. */
  locked?: boolean;
};

// Lock off: ink border and content, plus the hover fill (that ink at 15%,
// so it tints whatever swatch is behind). Locked: filled with the ink, the
// content in the other ink; hover keeps the fill.
const colorClasses = {
  light: {
    off: "border-on-swatch-dark text-on-swatch-dark hover:enabled:bg-on-swatch-dark-hover",
    locked: "border-on-swatch-dark bg-on-swatch-dark text-on-swatch-light",
  },
  dark: {
    off: "border-on-swatch-light text-on-swatch-light hover:enabled:bg-on-swatch-light-hover",
    locked: "border-on-swatch-light bg-on-swatch-light text-on-swatch-dark",
  },
};

// The padlock shows the state at rest and previews the click on hover.
const restingIcon = "group-enabled:group-hover:hidden";
const previewIcon = "hidden group-enabled:group-hover:block";

/*
 * Locks a colour so Generate keeps it. Sits on the colour's swatch, so
 * its ink follows the swatch (see `swatch`), not the page theme.
 *
 * Labelled variant, lock off, default state: 40px tall pill with a 2px
 * border in the ink colour and a transparent background, so the swatch
 * shows through. 121px wide with the content centred: a 20px open
 * padlock, gap 8, then "Lock" in Text Preset 6 Bold (19px), both in the
 * ink colour (2 + 24 + 20 + 8 + 41 + 24 + 2). At least 12px padding, so
 * a longer label grows the pill instead of touching the border.
 *
 * Locked, default state: the same 121px pill filled with the ink
 * (#1B1F24 on a light swatch, white on a dark one), with a closed padlock
 * and "Locked" in the other ink. Same width, so locking doesn't move
 * anything.
 *
 * Hover: the padlock previews the click: closed on a lock-off button,
 * open on a locked one. Lock off also fills with the ink at 15%
 * (on-swatch-dark-hover or on-swatch-light-hover), so the swatch shows
 * through, tinted: #CECAC3 on #EEE8DF, #6F3C61 on #561A45. Locked keeps
 * its fill. Only on enabled buttons, and only on devices that can hover.
 *
 * Focus (keyboard only, :focus-visible): a dark / white / dark ring that
 * reads on any swatch, so it ignores `swatch`. The 2px border turns dark
 * (on-swatch-dark), a 4px white outline sits right against it, and a 2px
 * dark ring outside that: 6px beyond the button in all. Drawn with
 * outline and box-shadow, so nothing moves. The label and padlock keep
 * the swatch's ink.
 *
 * It's a toggle button (aria-pressed), so screen readers announce
 * "Locked, toggle button, pressed". Pass an aria-label that names the
 * colour when there are several.
 */
export function LockButton({ swatch = "light", locked = false, className, ...props }: LockButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={locked}
      className={[
        "group inline-flex h-paintbox-500 min-w-[7.5625rem] shrink-0 cursor-pointer items-center justify-center gap-paintbox-100 whitespace-nowrap",
        "rounded-paintbox-full border-2 px-paintbox-150",
        "text-preset-6-bold",
        colorClasses[swatch][locked ? "locked" : "off"],
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
      {locked ? (
        <>
          <IconLockClosed className={restingIcon} />
          <IconLockOpen className={previewIcon} />
        </>
      ) : (
        <>
          <IconLockOpen className={restingIcon} />
          <IconLockClosed className={previewIcon} />
        </>
      )}
      {/* No text-box trim: the design centres the whole line, which sits the
          letters slightly below the padlock's middle. */}
      <span>{locked ? "Locked" : "Lock"}</span>
    </button>
  );
}
