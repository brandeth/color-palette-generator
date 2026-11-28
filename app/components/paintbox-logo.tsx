import type { ComponentProps } from "react";
import { roleNames, type Palette } from "../lib/palette";

type PaintboxLogoProps = Omit<ComponentProps<"div">, "children"> & {
  /** The current palette: the dots show its five colours. */
  palette: Palette;
};

/*
 * The paintbox wordmark and its five palette dots (desktop).
 *
 * "paintbox" in Text Preset 3 (Funnel Display SemiBold, lowercase, 28px
 * on desktop) in the text colour; it's the page's heading. 12px after it,
 * the dots: five 13.3px circles, 4px apart, each with a 1.3px border in
 * swatch-edge (so a colour close to the page keeps an edge), filled with
 * the current colours in role order (Page, Cards, Buttons, Footer, Text):
 * 85.3 × 16 with 1.3px round them, as in the design. They follow the
 * palette, and are decorative.
 */
export function PaintboxLogo({ palette, className, ...props }: PaintboxLogoProps) {
  return (
    <div className={["flex items-center gap-paintbox-150", className].filter(Boolean).join(" ")} {...props}>
      <h1 className="text-preset-3 text-text">paintbox</h1>
      <div aria-hidden className="flex gap-paintbox-050 p-[0.0833rem]">
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
