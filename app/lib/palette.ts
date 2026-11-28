/*
 * Palettes: five colours, lightest to darkest, one per role on the sample
 * page (Page, Cards, Buttons, Footer, Text). Generating works in OKLCH,
 * where lightness matches what the eye sees, so each role keeps its
 * lightness whatever the hues: the Text colour always reads on the Page.
 */

export type Palette = string[];

export type PaletteTypeValue = "random" | "monochrome" | "analogous" | "complementary" | "triadic";

/** The roles, in palette order; the logo's dots are named after them. */
export const roleNames = ["Page", "Cards", "Buttons", "Footer", "Text"] as const;

/** The palette from the design. */
export const defaultPalette: Palette = ["#EEE8DF", "#D8A38C", "#B6363F", "#87294D", "#551B45"];

// Each role's lightness and the most colour it takes (OKLCH): a pale page,
// a soft card colour, then three stronger, darker colours.
const LIGHTNESS = [0.93, 0.76, 0.55, 0.42, 0.3];
const CHROMA = [0.025, 0.075, 0.16, 0.13, 0.09];

// Hue offsets from the base hue, per role, for each type.
const HUE_OFFSETS: Record<Exclude<PaletteTypeValue, "random">, number[]> = {
  monochrome: [0, 0, 0, 0, 0],
  analogous: [30, 15, 0, -15, -30],
  complementary: [0, 180, 0, 180, 0],
  triadic: [0, 120, 240, 0, 120],
};

type Oklch = { l: number; c: number; h: number };

// sRGB channel (0-1) to linear light, and back.
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToOklch(hex: string): Oklch {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => toLinear(v / 255));
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

// OKLCH to linear sRGB (may fall outside 0-1 when the colour is out of gamut).
function oklchToLinearRgb({ l, c, h }: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
}

const inGamut = (rgb: number[]) => rgb.every((v) => v >= -0.0001 && v <= 1.0001);

/** OKLCH to "#RRGGBB", lowering the chroma until it fits in sRGB. */
function oklchToHex(colour: Oklch): string {
  let { c } = colour;
  if (!inGamut(oklchToLinearRgb(colour))) {
    let low = 0;
    let high = c;
    for (let i = 0; i < 20; i++) {
      c = (low + high) / 2;
      if (inGamut(oklchToLinearRgb({ ...colour, c }))) low = c;
      else high = c;
    }
    c = low;
  }
  const rgb = oklchToLinearRgb({ ...colour, c }).map((v) =>
    Math.round(Math.min(1, Math.max(0, fromLinear(Math.min(1, Math.max(0, v))))) * 255),
  );
  return `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

/*
 * The hue the others are built round. With colours locked, it comes from
 * the most colourful one, so new colours fit the ones you kept; otherwise
 * it's random.
 */
function baseHue(palette: Palette, locked: boolean[], offsets: number[]): number {
  let hue = random(0, 360);
  let chroma = 0.03; // Greys and near-greys don't set the hue.
  for (let i = 0; i < palette.length; i++) {
    if (!locked[i]) continue;
    const colour = hexToOklch(palette[i]);
    if (colour.c > chroma) {
      chroma = colour.c;
      hue = colour.h - offsets[i];
    }
  }
  return hue;
}

/**
 * A new palette of the given type. Locked colours stay as they are; the
 * rest are new, each at its role's lightness.
 */
export function generatePalette(type: PaletteTypeValue, palette: Palette, locked: boolean[]): Palette {
  const offsets = type === "random" ? null : HUE_OFFSETS[type];
  const base = offsets ? baseHue(palette, locked, offsets) : 0;
  // A small turn either way, so analogous palettes run both directions.
  const direction = Math.random() < 0.5 ? 1 : -1;

  return palette.map((hex, i) => {
    if (locked[i]) return hex;
    const hue = offsets ? base + offsets[i] * direction + random(-6, 6) : random(0, 360);
    return oklchToHex({
      l: LIGHTNESS[i] + random(-0.025, 0.025),
      c: CHROMA[i] * random(0.7, 1.2),
      h: ((hue % 360) + 360) % 360,
    });
  });
}

/** The ways Copy palette can copy, and what each gives. */
export type CopyFormatValue = "css" | "hex" | "link";

export function formatPalette(format: CopyFormatValue, palette: Palette, origin: string): string {
  switch (format) {
    case "css":
      return `:root {\n${palette.map((hex, i) => `  --color-${i + 1}: ${hex};`).join("\n")}\n}`;
    case "hex":
      return palette.join(", ");
    case "link":
      return `${origin}/?colors=${palette.map((hex) => hex.slice(1)).join("-")}`;
  }
}

/** Reads a palette from a link's `colors` ("EEE8DF-D8A38C-…"); null if it isn't five hex codes. */
export function parsePaletteParam(value: string | null): Palette | null {
  const codes = value?.split("-") ?? [];
  if (codes.length !== defaultPalette.length || !codes.every((code) => /^[0-9a-f]{6}$/i.test(code))) return null;
  return codes.map((code) => `#${code.toUpperCase()}`);
}
