import type { ComponentProps } from "react";
import { CopyHex } from "./copy-hex";
import { LockButton } from "./lock-button";

type Ink = "dark" | "light";

type SwatchProps = Omit<ComponentProps<"div">, "children"> & {
  /** The colour, as a hex code, e.g. "#EEE8DF". Fills the swatch and is the code shown. */
  hex: string;
  /**
   * "column" (default): tall, with Lock and the hex code at the bottom
   * left. "row": wide and short, the hex code on the left and the round
   * Lock on the right. The other layouts come later.
   */
  layout?: "column" | "row";
  /**
   * The ink for everything on the swatch: "dark" (#1B1F24) or "light"
   * (white). Leave it out to pick whichever has more contrast with `hex`.
   */
  ink?: Ink;
  /** Whether the colour is locked (Generate keeps it). */
  locked?: boolean;
  /** Called with the new value when Lock is pressed. */
  onLockedChange?: (locked: boolean) => void;
};

// The two inks as sRGB, for the contrast check.
const INK_RGB: Record<Ink, [number, number, number]> = {
  dark: [0x1b, 0x1f, 0x24], // on-swatch-dark
  light: [0xff, 0xff, 0xff], // on-swatch-light
};

// WCAG relative luminance of an sRGB colour.
function luminance([r, g, b]: [number, number, number]) {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrast(a: number, b: number) {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// Each layout's arrangement and padding (the border takes no space).
const layoutClasses = {
  // Contents at the bottom left; padding 16 16 16 8, gap 8.
  column: "flex-col items-start justify-end pt-paintbox-200 pr-paintbox-200 pb-paintbox-200 pl-paintbox-100",
  // Hex on the left, Lock on the right, centred; padding 12 12 12 4, gap 8.
  row: "flex-row items-center justify-between py-paintbox-150 pr-paintbox-150 pl-paintbox-050",
};

/** The ink with more contrast on `hex` ("#RRGGBB" or "#RGB"): #1B1F24 or white. */
export function inkFor(hex: string): Ink {
  const digits = hex.replace("#", "");
  const full = digits.length === 3 ? [...digits].map((d) => d + d).join("") : digits;
  const rgb: [number, number, number] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
  const l = luminance(rgb);
  return contrast(l, luminance(INK_RGB.dark)) >= contrast(l, luminance(INK_RGB.light)) ? "dark" : "light";
}

/*
 * One colour of the palette: filled with it, with its Lock button and
 * copyable hex code. Everything on it uses one ink, dark or white,
 * whichever reads better on the colour (see `ink`), so it ignores the
 * page theme.
 *
 * Every layout: 12px corners and a 2px border just inside the edge in
 * #1B1F24 at 14% (paintbox-neutral-alpha-14), so light colours keep an
 * edge on the page. The border is an inset ring, so it takes no space,
 * as in the design.
 *
 * Column layout (the design's 259 × 703; it fills whatever size it's
 * given): a column with its contents at the bottom left, padding 16 at
 * the top, right and bottom and 8 on the left, gap 8. First Lock
 * (labelled, 122px) with 8 more on its left, so it starts 16px in; then
 * Copy Hex (large), whose code lines up 12px in.
 *
 * Row layout (the design's 343 × 64): a row, centred, with Copy Hex
 * (large) on the left and Lock (icon, the 40px circle) on the right, as
 * far apart as the width allows. Padding 12 at the top, right and bottom
 * and 4 on the left, gap 8: the code starts 16px in (4 + 12) and the
 * circle ends 12px from the right.
 *
 * It's a group named after the hex code, so screen readers announce
 * "#EEE8DF, group" before its "Lock" and "Copy #EEE8DF" buttons.
 */
export function Swatch({
  hex,
  layout = "column",
  ink,
  locked = false,
  onLockedChange,
  className,
  style,
  ...props
}: SwatchProps) {
  // The children name the swatch by its lightness: a dark ink sits on a light swatch.
  const swatch = (ink ?? inkFor(hex)) === "dark" ? "light" : "dark";
  const toggleLock = () => onLockedChange?.(!locked);

  return (
    <div
      role="group"
      aria-label={hex}
      data-layout={layout}
      className={[
        "flex gap-paintbox-100",
        layoutClasses[layout],
        "rounded-paintbox-12 inset-ring-2 inset-ring-paintbox-neutral-alpha-14",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundColor: hex, ...style }}
      {...props}
    >
      {layout === "column" ? (
        <>
          {/* 8px more on the left, so Lock starts 16px in. */}
          <div className="pl-paintbox-100">
            <LockButton swatch={swatch} locked={locked} onClick={toggleLock} />
          </div>
          <CopyHex hex={hex} swatch={swatch} />
        </>
      ) : (
        <>
          <CopyHex hex={hex} swatch={swatch} />
          <LockButton swatch={swatch} variant="icon" locked={locked} onClick={toggleLock} />
        </>
      )}
    </div>
  );
}
