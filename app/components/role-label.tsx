"use client";

import type { ComponentProps } from "react";
import { toastMessages } from "./toast-messages";
import { useCopy } from "./use-copy";

type RoleLabelProps = Omit<ComponentProps<"span">, "children"> & {
  /** The colour's role in the palette, e.g. "Page". */
  name: string;
  /**
   * The colour's hex code, e.g. "#EEE8DF". When given, it shows after the
   * role name as a button that copies it; leave it out to show the role
   * name alone.
   */
  hex?: string;
  /**
   * "inline" (default): left-aligned, the role name muted.
   * "centered": centred, with 4px above, the role name in the text colour.
   * "stacked": the role name in the text colour, the hex below it.
   */
  variant?: "inline" | "centered" | "stacked";
};

const variantClasses = {
  inline: { label: "items-baseline", name: "text-text-muted" },
  // 4 + 16.9 line: the design's 21px frame with the baseline 17px down.
  centered: {
    label: "items-baseline justify-center pt-paintbox-050 text-center",
    name: "text-text",
  },
  // Just the 16.9px line: the design's 17px frame with the baseline 13px down.
  stacked: { label: "flex-col items-start", name: "text-text" },
};

/*
 * Names the role a colour plays in the palette, e.g. "Page". Sits on the
 * page background, so it follows the page theme.
 *
 * Default state: just the role name in Text Preset 9 (Funnel Sans Bold
 * 13px, line-height 130%, letter-spacing 2%) in text-muted (#545B63 in
 * light mode).
 *
 * Hex shown (`hex`): the hex code follows the role name, 4px after it,
 * on the same baseline, in Text Preset 9 (Hex) (the same type with
 * letter-spacing 0) in the text colour (#1B1F24 in light mode), so it
 * stands out from the muted role name.
 *
 * The hex is a button that copies it to the clipboard. Hover: a 1px
 * underline in the text colour, 1px below the baseline; nothing moves.
 * Only on devices that can hover. There's no copied look on the label:
 * the "Copied #EEE8DF" toast says it worked (or "Couldn't copy #EEE8DF.
 * Try again." if the clipboard refuses), and screen readers read it.
 * Its accessible name is "Copy #EEE8DF".
 *
 * Focus (keyboard only, :focus-visible): a 3px ring in the focus colour
 * (violet), 2px outside the hex, with rounded corners (8px inside, 11px
 * outside): about 63 × 34 around "#EEE8DF". The button has 3.5px of
 * padding above and below, taken back by negative margins, so the ring
 * is that tall without moving anything (and the target is 24px tall).
 *
 * Centered variant, default state: the role name centred, in the text
 * colour (#1B1F24 in light mode) instead of muted, with 4px above it:
 * 21px tall (4 + the 16.9px line), baseline 17px down, and as wide as the
 * text (31px for "Page").
 *
 * Stacked variant, default state: the role name in the text colour, with
 * nothing above it: 17px tall (the 16.9px line), baseline 13px down, as
 * wide as the text. The hex, when shown, goes below it.
 */
export function RoleLabel({ name, hex, variant = "inline", className, ...props }: RoleLabelProps) {
  const { copy } = useCopy();
  const variantClass = variantClasses[variant];

  return (
    <span
      className={["inline-flex gap-paintbox-050 whitespace-nowrap", variantClass.label, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className={["text-preset-9", variantClass.name].join(" ")}>{name}</span>
      {hex ? (
        <button
          type="button"
          className={[
            "cursor-pointer text-preset-9-hex text-text decoration-1 underline-offset-1 enabled:hover:underline",
            // 3.5px above and below, taken back by the margins: a 24px
            // tall target and ring that don't move anything.
            "-my-[3.5px] py-[3.5px] rounded-[6px]",
            // Ring radius 6 + 2 = 8 inside, 11 outside, as in the design.
            "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
          ].join(" ")}
          onClick={() =>
            copy(hex, {
              copied: toastMessages.copiedHex(hex),
              failed: toastMessages.copyHexFailed(hex),
            })
          }
        >
          <span className="sr-only">Copy </span>
          {hex}
        </button>
      ) : null}
    </span>
  );
}
