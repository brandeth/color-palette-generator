import type { ComponentProps } from "react";
import { IconCopy } from "./icons";

type CopyHexProps = Omit<ComponentProps<"button">, "children"> & {
  /** The colour's hex code as shown, e.g. "#EEE8DF". */
  hex: string;
  /**
   * The swatch the button sits on. "light" (default): dark ink
   * (on-swatch-dark, #1B1F24) for light colours. "dark": white ink
   * (on-swatch-light) for dark colours. The same in both page themes.
   */
  swatch?: "light" | "dark";
};

// Ink, plus the circle's hover fill: that ink at 15%, so it tints the swatch.
const colorClasses = {
  light: { ink: "text-on-swatch-dark", circle: "group-enabled:group-hover:bg-on-swatch-dark-hover" },
  dark: { ink: "text-on-swatch-light", circle: "group-enabled:group-hover:bg-on-swatch-light-hover" },
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
 * Its accessible name is "Copy #EEE8DF": a hidden "Copy" before the
 * code says what it does.
 */
export function CopyHex({ hex, swatch = "light", className, ...props }: CopyHexProps) {
  const colors = colorClasses[swatch];

  return (
    <button
      type="button"
      className={[
        "group inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-050 whitespace-nowrap",
        "rounded-paintbox-full px-paintbox-100",
        colors.ink,
        // Dark 7px ring with a white 3px outline 2px out: dark/white/dark.
        "focus-visible:ring-7 focus-visible:ring-on-swatch-dark",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-on-swatch-light",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="sr-only">Copy </span>
      {/* At least 130px, so the button stays 186px as the colour changes
          (hex codes differ in width by a few px). */}
      <span className="min-w-[8.125rem] text-preset-4 decoration-2 underline-offset-1 group-enabled:group-hover:underline">
        {hex}
      </span>
      {/* 36px circle around the icon; filled on hover. */}
      <span
        className={["flex size-[2.25rem] items-center justify-center rounded-paintbox-full", colors.circle].join(" ")}
      >
        <IconCopy />
      </span>
    </button>
  );
}
