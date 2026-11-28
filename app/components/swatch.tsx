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
   * Lock on the right. "strip": like row but narrower, with the small hex
   * code (no copy icon). "strip-icon": just the round Lock, centred.
   * "strip-compact": 64 × 56, the whole swatch is the Lock (phone
   * preview strip). "row-compact": row, shorter, with a 32px Lock.
   * "row-labelled": the hex code with the labelled Lock right after it
   * (tablet). "adaptive": for the generator page: on phones (below 48rem)
   * Row Labelled with the round Lock, up to 64rem Row Labelled, and
   * Column from 64rem up.
   */
  layout?: "column" | "row" | "row-compact" | "row-labelled" | "strip" | "strip-icon" | "strip-compact" | "adaptive";
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
  // The same, padding 4 12 4 4.
  "row-compact": "flex-row items-center justify-between py-paintbox-050 pr-paintbox-150 pl-paintbox-050",
  // Hex then the labelled Lock, on the left, centred; padding 12 12 12 4, gap 8.
  "row-labelled": "flex-row items-center py-paintbox-150 pr-paintbox-150 pl-paintbox-050",
  // Row Labelled, then Column from 64rem. Lock comes first in the code (as
  // in Column), so the row runs reversed, from the left.
  adaptive: [
    "flex-row-reverse items-center justify-end py-paintbox-150 pr-paintbox-150 pl-paintbox-050",
    "lg:flex-col lg:items-start lg:justify-end lg:pt-paintbox-200 lg:pr-paintbox-200 lg:pb-paintbox-200 lg:pl-paintbox-100",
  ].join(" "),
  // The same, padding 8 all round.
  strip: "flex-row items-center justify-between p-paintbox-100",
  // Just Lock, centred; padding 12.
  "strip-icon": "flex-row items-center justify-center p-paintbox-150",
  // The Lock's tap area is the whole swatch; no padding.
  "strip-compact": "flex-row items-center justify-center",
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
 * swatch-edge (#1B1F24 at 14% in the light theme, a light 18% in the
 * dark theme), so colours close to the page keep an edge. The border is
 * an inset ring, so it takes no space, as in the design.
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
 * Row Compact layout (the design's 343 × 51): Row with padding 4 at the
 * top, bottom and left and 12 on the right, Copy Hex (large) at 32px
 * tall, and Lock as the 32px circle (icon-tight), 12px from the right.
 *
 * Row Labelled layout (the design's 704 × 148, tablet): Copy Hex (large)
 * then Lock (labelled, 122px) 8px after it, both on the left and centred
 * top to bottom; padding 12 at the top, right and bottom and 4 on the
 * left, so the code starts 16px in.
 *
 * Adaptive layout (the generator page): Row Labelled below 64rem and
 * Column from 64rem up, switched in CSS so nothing jumps on load. On
 * phones (below 48rem, the design's 351 × 114) Lock shows as the 40px
 * circle with just the padlock; its name stays "Lock" for screen readers. Lock
 * comes first in the code, as in Column, so on tablets the keyboard
 * reaches Lock before the hex code, though it shows after it.
 *
 * Strip layout (the design's 259 × 64): the same arrangement with
 * padding 8 all round, and Copy Hex small without its copy icon (113px
 * for #EEE8DF), so the code starts 16px in (8 + 4 + 4) and the circle
 * ends 8px from the right.
 *
 * Strip Icon layout (the design's 259 × 64): no hex code, just Lock
 * (icon, the 40px circle) in the middle; padding 12. The swatch is
 * still a group named after the code, so Lock says which colour it's on.
 *
 * Strip Compact layout (the design's 64 × 56, for the phone preview
 * strip): no padding; Lock (icon-small) is the whole swatch: its 64 × 56
 * tap area with the 20px padlock in the middle, the 32px ink circle when
 * locked, and the hover tint over the whole swatch.
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
        "rounded-paintbox-12 inset-ring-2 inset-ring-swatch-edge",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundColor: hex, ...style }}
      {...props}
    >
      {layout === "column" || layout === "adaptive" ? (
        <>
          {/* 8px more on the left in Column, so Lock starts 16px in. */}
          <div className={layout === "column" ? "pl-paintbox-100" : "lg:pl-paintbox-100"}>
            <LockButton
              swatch={swatch}
              locked={locked}
              onClick={toggleLock}
              // Adaptive on phones: the 40px circle, the label kept for screen readers.
              className={
                layout === "adaptive"
                  ? "max-md:size-paintbox-500 max-md:min-w-0 max-md:px-0 max-md:[&>span]:sr-only"
                  : undefined
              }
            />
          </div>
          <CopyHex hex={hex} swatch={swatch} />
        </>
      ) : layout === "row-labelled" ? (
        <>
          <CopyHex hex={hex} swatch={swatch} />
          <LockButton swatch={swatch} locked={locked} onClick={toggleLock} />
        </>
      ) : layout === "strip-icon" ? (
        <LockButton swatch={swatch} variant="icon" locked={locked} onClick={toggleLock} />
      ) : layout === "strip-compact" ? (
        // As wide as the swatch, which can be a little under 64 (63.8 in the phone strip).
        <LockButton swatch={swatch} variant="icon-small" locked={locked} onClick={toggleLock} className="w-full!" />
      ) : (
        <>
          {layout === "strip" ? (
            <CopyHex hex={hex} swatch={swatch} size="small" icon={false} />
          ) : (
            <CopyHex hex={hex} swatch={swatch} compact={layout === "row-compact"} />
          )}
          <LockButton
            swatch={swatch}
            variant={layout === "row-compact" ? "icon-tight" : "icon"}
            locked={locked}
            onClick={toggleLock}
          />
        </>
      )}
    </div>
  );
}
