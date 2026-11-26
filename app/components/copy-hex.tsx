"use client";

import { useEffect, useState, type ComponentProps, type MouseEvent } from "react";
import { IconCheck, IconCopy } from "./icons";

type CopyHexProps = Omit<ComponentProps<"button">, "children"> & {
  /** The colour's hex code as shown, e.g. "#EEE8DF". */
  hex: string;
  /**
   * The swatch the button sits on. "light" (default): dark ink
   * (on-swatch-dark, #1B1F24) for light colours. "dark": white ink
   * (on-swatch-light) for dark colours. The same in both page themes.
   */
  swatch?: "light" | "dark";
  /**
   * "large" (default): the code in Text Preset 4 (28px), 186px wide.
   * "small": the code in Text Preset 5 (22px), 145px wide. Both 40px tall.
   */
  size?: "large" | "small";
  /** Show the copied look (the checkmark) regardless of clicks, e.g. in examples. */
  copied?: boolean;
};

// How long the checkmark shows after a copy.
const COPIED_MS = 2000;

// The code's box is at least as wide as the code, so the button keeps
// its width as the colour changes (hex codes differ by a few px).
const sizeClasses = {
  // 8 + 130 + 4 + 36 + 8 = 186
  large: {
    button: "px-paintbox-100",
    code: "min-w-[8.125rem] text-preset-4 underline-offset-1",
    circle: "size-[2.25rem]",
  },
  // 8 + 101 + 4 + 28 + 4 = 145: the design has 4 to the circle's right.
  small: {
    button: "pl-paintbox-100 pr-paintbox-050",
    code: "min-w-[6.3125rem] text-preset-5 underline-offset-2",
    circle: "size-[1.75rem]",
  },
};

// Ink, plus the circle's hover fill: that ink at 15%, so it tints the swatch.
const colorClasses = {
  light: {
    ink: "text-on-swatch-dark",
    circle: "group-enabled:group-hover:bg-on-swatch-dark-hover",
  },
  dark: {
    ink: "text-on-swatch-light",
    circle: "group-enabled:group-hover:bg-on-swatch-light-hover",
  },
};

/*
 * Copies a colour's hex code. Sits on the colour's swatch, so its ink
 * follows the swatch (see `swatch`), not the page theme.
 *
 * Large size, default state: 40px tall, padding 8 at the sides, gap 4.
 * The hex code in Text Preset 4 (Funnel Display SemiBold 28px,
 * uppercase) in a box at least 130px wide, then the 20px copy icon
 * centred in a 36px circle (the circle shows on hover): 186px wide
 * (8 + 130 + 4 + 36 + 8), whatever the colour, so it doesn't shift when
 * the colour changes. No border or background, so the swatch shows
 * through; both in the ink colour. Pill-shaped, for the focus ring.
 *
 * Hover (anywhere on the button): the code gets a 2px underline in the
 * ink, 1px below the baseline, and the icon's circle fills with the ink
 * at 15% (on-swatch-dark-hover or on-swatch-light-hover): #CECAC3 on
 * #EEE8DF, #6F3C61 on #561A45. Nothing moves. Only on enabled buttons,
 * and only on devices that can hover.
 *
 * Focus (keyboard only, :focus-visible): a dark / white / dark ring
 * round the pill that reads on any swatch, so it ignores `swatch`: 2px
 * dark (on-swatch-dark), 3px white (on-swatch-light), 2px dark, all
 * outside the button (200 × 54 with the ring). Drawn with box-shadow and
 * outline, so nothing moves. The code and icon keep the swatch's ink.
 *
 * Copied: clicking writes the code to the clipboard, then the copy icon
 * turns into a 20px checkmark (IconCheck) in the same spot for 2s.
 * Nothing else changes: no fill, the code stays put. Clicking again
 * copies again and restarts the 2s. If the clipboard refuses, nothing
 * changes. `copied` forces the look.
 *
 * Small size: the same 40px height, states and focus ring, with the code
 * in Text Preset 5 (Funnel Display Bold 22px, uppercase) in a box at least
 * 101px wide and the same 20px icon in a 28px circle: padding 8 on the
 * left, 4 on the right, gap 4, 145px wide. The hover underline is 2px,
 * 2px below the baseline.
 *
 * Its accessible name is "Copy #EEE8DF": a hidden "Copy" before the
 * code says what it does. After a copy, a status message outside the
 * button announces "Copied #EEE8DF" to screen readers.
 */
export function CopyHex({
  hex,
  swatch = "light",
  size = "large",
  copied: forceCopied = false,
  className,
  onClick,
  ...props
}: CopyHexProps) {
  const colors = colorClasses[swatch];
  const sizes = sizeClasses[size];
  // When the last copy happened; null when the checkmark isn't showing.
  const [copiedAt, setCopiedAt] = useState<number | null>(null);
  const copied = forceCopied || copiedAt !== null;

  useEffect(() => {
    if (copiedAt === null) return;
    const timer = setTimeout(() => setCopiedAt(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copiedAt]);

  async function copy(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedAt(Date.now());
    } catch {
      // Clipboard unavailable or refused: leave the button as it was.
    }
  }

  return (
    <>
      <button
        type="button"
        className={[
          "group inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-050 whitespace-nowrap",
          "rounded-paintbox-full",
          sizes.button,
          colors.ink,
          // Dark 7px ring with a white 3px outline 2px out: dark/white/dark.
          "focus-visible:ring-7 focus-visible:ring-on-swatch-dark",
          "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-on-swatch-light",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={copy}
        {...props}
      >
        <span className="sr-only">Copy </span>
        <span className={[sizes.code, "decoration-2 group-enabled:group-hover:underline"].join(" ")}>{hex}</span>
        {/* Circle around the icon; filled on hover. */}
        <span
          className={["flex items-center justify-center rounded-paintbox-full", sizes.circle, colors.circle].join(" ")}
        >
          {copied ? <IconCheck /> : <IconCopy />}
        </span>
      </button>
      {/* Outside the button, so it isn't part of the button's name. */}
      <span role="status" className="sr-only">
        {copiedAt !== null ? `Copied ${hex}` : ""}
      </span>
    </>
  );
}
