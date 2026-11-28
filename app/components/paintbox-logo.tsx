import type { ComponentProps } from "react";
import { roleNames, type Palette } from "../lib/palette";

type PaintboxLogoProps = Omit<ComponentProps<"div">, "children"> & {
  /** The current palette: the dots show its five colours. */
  palette: Palette;
};

/*
 * The paintbox wordmark and its five palette dots.
 *
 * "paintbox" in Funnel Display SemiBold, lowercase, in the text colour:
 * Text Preset 3 (Mobile), 24px, on phones (below 48rem); Text Preset 3
 * (Tablet), 26px, up to 64rem and on a phone on its side; and Text
 * Preset 3 (28px at 1440) from 64rem up. It's the page's heading. 12px after it (not on phones), the
 * dots: five 13.3px circles, 4px apart, each with a 1.3px border in
 * swatch-edge (so a colour close to the page keeps an edge), filled with
 * the current colours in role order (Page, Cards, Buttons, Footer, Text):
 * 85.3 × 16 with 1.3px round them, as in the design. They follow the
 * palette, and are decorative.
 */
export function PaintboxLogo({ palette, className, ...props }: PaintboxLogoProps) {
  return (
    <div className={["flex items-center gap-paintbox-150", className].filter(Boolean).join(" ")} {...props}>
      <h1 className="text-preset-3-mobile text-text md:text-preset-3-tablet lg:text-preset-3 paintbox-landscape:text-preset-3-tablet">
        paintbox
      </h1>
      <div aria-hidden className="flex gap-paintbox-050 p-[0.0833rem] max-md:hidden">
        {palette.map((hex, i) => (
          <span
            key={roleNames[i]}
            title={roleNames[i]}
            className="size-[0.8333rem] rounded-paintbox-full border-[0.0833rem] border-swatch-edge"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  );
}
