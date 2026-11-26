"use client";

import type { ComponentProps } from "react";
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
 * Only on devices that can hover. There's no copied look; a status
 * message announces "Copied #EEE8DF" to screen readers. Its accessible
 * name is "Copy #EEE8DF".
 *
 * Focus (keyboard only, :focus-visible): a 3px ring in the focus colour
 * (violet), 2px outside the hex, with rounded corners (8px inside, 11px
 * outside): about 63 × 34 around "#EEE8DF". The button has 3.5px of
 * padding above and below, taken back by negative margins, so the ring
 * is that tall without moving anything (and the target is 24px tall).
 */
export function RoleLabel({ name, hex, className, ...props }: RoleLabelProps) {
  const { copied, copy } = useCopy();

  return (
    <span
      className={["inline-flex items-baseline gap-paintbox-050 whitespace-nowrap", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="text-preset-9 text-text-muted">{name}</span>
      {hex ? (
        <>
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
            onClick={() => copy(hex)}
          >
            <span className="sr-only">Copy </span>
            {hex}
          </button>
          {/* Outside the button, so it isn't part of the button's name. */}
          <span role="status" className="sr-only">
            {copied ? `Copied ${hex}` : ""}
          </span>
        </>
      ) : null}
    </span>
  );
}
