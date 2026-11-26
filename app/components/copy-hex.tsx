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

const inkBySwatch = {
  light: "text-on-swatch-dark",
  dark: "text-on-swatch-light",
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
 * Its accessible name is "Copy #EEE8DF": a hidden "Copy" before the
 * code says what it does.
 */
export function CopyHex({ hex, swatch = "light", className, ...props }: CopyHexProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-paintbox-500 shrink-0 cursor-pointer items-center gap-paintbox-050 whitespace-nowrap",
        "rounded-paintbox-full px-paintbox-100",
        inkBySwatch[swatch],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="sr-only">Copy </span>
      {/* At least 130px, so the button stays 186px as the colour changes
          (hex codes differ in width by a few px). */}
      <span className="min-w-[8.125rem] text-preset-4">{hex}</span>
      {/* 36px circle around the icon; filled on hover. */}
      <span className="flex size-[2.25rem] items-center justify-center rounded-paintbox-full">
        <IconCopy />
      </span>
    </button>
  );
}
