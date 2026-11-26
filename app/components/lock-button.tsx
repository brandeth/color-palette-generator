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
  /** Whether the colour is locked. Fills the button (or its circle) with the ink; sets aria-pressed. */
  locked?: boolean;
  /**
   * "labelled" (default): 121px pill with "Lock" / "Locked".
   * "icon": 40px circle with just the padlock, for tight layouts.
   * "icon-small": just the 20px padlock in a 64 × 56 tap area, no
   * border; a 32px ink circle when locked. For the tightest layouts.
   * "icon-xsmall": the same tap area with a 16px padlock and a 20px
   * circle when locked.
   * The icon variants' accessible name is "Lock" (pass an aria-label to
   * name the colour).
   */
  variant?: "labelled" | "icon" | "icon-small" | "icon-xsmall";
};

// The borderless sizes: one 64 × 56 tap area, different insides.
const tapArea = "h-[3.5rem] w-paintbox-800 rounded-paintbox-12"; // 64 × 56
const borderless = {
  "icon-small": { circle: "size-paintbox-400", icon: "" }, // 32px circle, 20px padlock
  "icon-xsmall": { circle: "size-paintbox-250", icon: "size-paintbox-200" }, // 20px circle, 16px padlock
};

// Size and shape. Every variant has a 2px border (transparent on the
// borderless sizes) so the focus ring can turn it dark.
const variantClasses = {
  labelled: "h-paintbox-500 min-w-[7.5625rem] gap-paintbox-100 rounded-paintbox-full px-paintbox-150", // 121px
  icon: "size-paintbox-500 rounded-paintbox-full", // 40px circle
  "icon-small": tapArea,
  "icon-xsmall": tapArea,
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

// The borderless sizes. Lock off is just the padlock (the hover fills the
// whole tap area); locked fills only the circle around it.
const smallColorClasses = {
  light: {
    off: "border-transparent text-on-swatch-dark hover:enabled:bg-on-swatch-dark-hover",
    locked: "border-transparent text-on-swatch-light",
    circle: "bg-on-swatch-dark",
  },
  dark: {
    off: "border-transparent text-on-swatch-light hover:enabled:bg-on-swatch-light-hover",
    locked: "border-transparent text-on-swatch-dark",
    circle: "bg-on-swatch-light",
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
 * the swatch's ink. Locked uses the same ring and keeps its fill: on a
 * light swatch the dark border blends into the dark fill; on a dark
 * swatch the white pill gets a dark border inside the white band.
 *
 * Icon variant: a 40px circle with the same 2px border and the 20px
 * padlock centred, no label. Every state matches the labelled one: the
 * ink fill when locked, the 15% hover tint, the padlock preview on hover,
 * and the same focus ring.
 *
 * Icon-small variant: a 64 × 56 tap area with radius 12 and the 20px
 * padlock centred. Lock off shows just the padlock (its border is
 * transparent); hover tints the whole area (#CECBC3 on #EEE8DF, #6F3D62
 * on #561A45). Locked puts a 32px ink circle behind the padlock, which
 * turns the other ink; hover only swaps the padlock. Focus is the same
 * ring around the tap area: the transparent border turns dark.
 *
 * Icon-xsmall variant: icon-small with a smaller inside: a 16px padlock
 * and, when locked, a 20px circle. Same tap area, hover and focus, so
 * it's just as easy to hit.
 *
 * It's a toggle button (aria-pressed), so screen readers announce
 * "Locked, toggle button, pressed" ("Lock, toggle button, pressed" for
 * the icon variants). Pass an aria-label that names the colour when
 * there are several.
 */
export function LockButton({
  swatch = "light",
  locked = false,
  variant = "labelled",
  className,
  ...props
}: LockButtonProps) {
  const inside = variant === "icon-small" || variant === "icon-xsmall" ? borderless[variant] : null;
  const colors = inside ? smallColorClasses[swatch] : colorClasses[swatch];
  const resting = [restingIcon, inside?.icon].filter(Boolean).join(" ");
  const preview = [previewIcon, inside?.icon].filter(Boolean).join(" ");

  const icons = locked ? (
    <>
      <IconLockClosed className={resting} />
      <IconLockOpen className={preview} />
    </>
  ) : (
    <>
      <IconLockOpen className={resting} />
      <IconLockClosed className={preview} />
    </>
  );

  return (
    <button
      type="button"
      aria-pressed={locked}
      className={[
        "group inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap",
        "border-2 text-preset-6-bold",
        variantClasses[variant],
        colors[locked ? "locked" : "off"],
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
      {inside ? (
        // The circle, filled with the ink when locked.
        <span
          className={[
            "flex items-center justify-center rounded-paintbox-full",
            inside.circle,
            locked ? smallColorClasses[swatch].circle : "",
          ].join(" ")}
        >
          {icons}
        </span>
      ) : (
        icons
      )}
      {variant === "labelled" ? (
        // No text-box trim: the design centres the whole line, which sits
        // the letters slightly below the padlock's middle.
        <span>{locked ? "Locked" : "Lock"}</span>
      ) : (
        // A stable name: aria-pressed already says whether it's locked.
        <span className="sr-only">Lock</span>
      )}
    </button>
  );
}
