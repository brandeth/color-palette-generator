/*
 * Token lists for the design system page.
 *
 * Swatches and samples render the real CSS variables / classes from
 * app/styles/*, so they always show what the app uses. The hex and px
 * labels here are copied from the style guides for reference: if a swatch
 * and its label ever disagree, the CSS is what ships.
 *
 * Class names are written out in full (e.g. "text-preset-1") so Tailwind's
 * scanner finds them; never build them with string concatenation.
 */

export type Primitive = { name: string; hex: string };

export const neutralPrimitives: Primitive[] = [
  { name: "neutral-0", hex: "#FFFFFF" },
  { name: "neutral-50", hex: "#F7F8F6" },
  { name: "neutral-75", hex: "#EEF0EE" },
  { name: "neutral-100", hex: "#ECEFEC" },
  { name: "neutral-200", hex: "#DDE1DD" },
  { name: "neutral-400", hex: "#959CA4" },
  { name: "neutral-500", hex: "#7A828B" },
  { name: "neutral-550", hex: "#737B85" },
  { name: "neutral-600", hex: "#545B63" },
  { name: "neutral-750", hex: "#33373E" },
  { name: "neutral-800", hex: "#2A2E34" },
  { name: "neutral-850", hex: "#212429" },
  { name: "neutral-900", hex: "#1B1F24" },
  { name: "neutral-950", hex: "#17191C" },
];

export const accentPrimitives: Primitive[] = [
  { name: "violet-300", hex: "#B892F0" },
  { name: "violet-600", hex: "#6A2BC9" },
  { name: "green-400", hex: "#58B374" },
  { name: "green-700", hex: "#1E7A3E" },
];

export const transparentPrimitives: Primitive[] = [
  { name: "neutral-alpha-10", hex: "#1B1F241A" },
  { name: "neutral-alpha-13", hex: "#1B1F2421" },
  { name: "neutral-alpha-14", hex: "#1B1F2424" },
  { name: "neutral-alpha-15", hex: "#1B1F2426" },
  { name: "neutral-light-alpha-18", hex: "#EEF0EE2E" },
  { name: "white-alpha-15", hex: "#FFFFFF26" },
  { name: "black-alpha-45", hex: "#00000073" },
  { name: "black-alpha-50", hex: "#00000080" },
];

/** Semantic token → primitive used in each theme. */
export type ThemeToken = { name: string; light: string; dark: string };

export const themeTokens: ThemeToken[] = [
  { name: "background", light: "neutral-50", dark: "neutral-950" },
  { name: "surface", light: "neutral-0", dark: "neutral-850" },
  { name: "surface-alt", light: "neutral-100", dark: "neutral-800" },
  { name: "text", light: "neutral-900", dark: "neutral-75" },
  { name: "text-muted", light: "neutral-600", dark: "neutral-400" },
  { name: "divider", light: "neutral-200", dark: "neutral-750" },
  { name: "border", light: "neutral-500", dark: "neutral-550" },
  { name: "focus", light: "violet-600", dark: "violet-300" },
  { name: "pending", light: "green-700", dark: "green-400" },
  { name: "on-swatch-light", light: "neutral-0", dark: "neutral-0" },
  { name: "on-swatch-dark", light: "neutral-900", dark: "neutral-900" },
  { name: "on-swatch-light-hover", light: "white-alpha-15", dark: "white-alpha-15" },
  { name: "on-swatch-dark-hover", light: "neutral-alpha-15", dark: "neutral-alpha-15" },
  { name: "swatch-edge", light: "neutral-alpha-14", dark: "neutral-light-alpha-18" },
  { name: "shadow-md", light: "neutral-alpha-10", dark: "black-alpha-45" },
  { name: "shadow-lg", light: "neutral-alpha-13", dark: "black-alpha-50" },
];

export type TypePreset = { className: string; label: string; spec: string };

export const typePresets: TypePreset[] = [
  { className: "text-preset-1", label: "Text Preset 1", spec: "Funnel Sans Bold · 28–44px fluid · 105% · −2%" },
  { className: "text-preset-2", label: "Text Preset 2", spec: "Funnel Sans Bold · 24–32px fluid · 115% · −2%" },
  { className: "text-preset-1-desktop", label: "Text Preset 1 (Desktop)", spec: "Funnel Sans Bold · 42px · 105% · −2% · sample page" },
  { className: "text-preset-1-tablet", label: "Text Preset 1 (Tablet)", spec: "Funnel Sans Bold · 32px · 105% · −2% · sample page" },
  { className: "text-preset-1-mobile", label: "Text Preset 1 (Mobile)", spec: "Funnel Sans Bold · 28px · 105% · −2% · sample page" },
  { className: "text-preset-2-desktop", label: "Text Preset 2 (Desktop)", spec: "Funnel Sans Bold · 32px · 115% · −2% · sample page" },
  { className: "text-preset-2-tablet", label: "Text Preset 2 (Tablet)", spec: "Funnel Sans Bold · 27px · 115% · −2% · sample page" },
  { className: "text-preset-2-mobile", label: "Text Preset 2 (Mobile)", spec: "Funnel Sans Bold · 24px · 115% · −2% · sample page" },
  { className: "text-preset-3", label: "Text Preset 3", spec: "Funnel Display SemiBold · 24–28px fluid · 120% · 0 · lowercase" },
  { className: "text-preset-4", label: "Text Preset 4", spec: "Funnel Display SemiBold · 28px · 100% · 2% · uppercase" },
  { className: "text-preset-5", label: "Text Preset 5", spec: "Funnel Display Bold · 22px · 100% · 2% · uppercase" },
  { className: "text-preset-6", label: "Text Preset 6", spec: "Funnel Sans Regular · 19px · 150% · 0" },
  { className: "text-preset-6-bold", label: "Text Preset 6 (Bold)", spec: "Funnel Sans Bold · 19px · 150% · 0" },
  { className: "text-preset-6-tight", label: "Text Preset 6 (Tight)", spec: "Funnel Sans Bold · 19px · 150% · −2%" },
  { className: "text-preset-7", label: "Text Preset 7", spec: "Funnel Sans Regular · 16px · 155% · 0 · body default" },
  { className: "text-preset-7-bold", label: "Text Preset 7 (Bold)", spec: "Funnel Sans Bold · 16px · 155% · 0" },
  { className: "text-preset-8", label: "Text Preset 8", spec: "Funnel Sans Regular · 14px · 145% · 0" },
  { className: "text-preset-8-bold", label: "Text Preset 8 (Bold)", spec: "Funnel Sans Bold · 14px · 145% · 0" },
  { className: "text-preset-9", label: "Text Preset 9", spec: "Funnel Sans Bold · 13px · 130% · 2%" },
  { className: "text-preset-9-hex", label: "Text Preset 9 (Hex)", spec: "Funnel Sans Bold · 13px · 130% · 0" },
];

export const spacingTokens = [
  { name: "0", px: 0 },
  { name: "050", px: 4 },
  { name: "100", px: 8 },
  { name: "150", px: 12 },
  { name: "200", px: 16 },
  { name: "250", px: 20 },
  { name: "300", px: 24 },
  { name: "400", px: 32 },
  { name: "500", px: 40 },
  { name: "600", px: 48 },
  { name: "800", px: 64 },
  { name: "1000", px: 80 },
];

export type RadiusToken = { className: string; name: string; px: string };

export const controlRadii: RadiusToken[] = [
  { className: "rounded-paintbox-0", name: "paintbox-0", px: "0px" },
  { className: "rounded-paintbox-8", name: "paintbox-8", px: "8px" },
  { className: "rounded-paintbox-12", name: "paintbox-12", px: "12px" },
  { className: "rounded-paintbox-16", name: "paintbox-16", px: "16px" },
  { className: "rounded-paintbox-20", name: "paintbox-20", px: "20px" },
  { className: "rounded-paintbox-full", name: "paintbox-full", px: "9999px" },
];

export const focusRingRadii: RadiusToken[] = [
  { className: "rounded-paintbox-13", name: "paintbox-13", px: "13px" },
  { className: "rounded-paintbox-17", name: "paintbox-17", px: "17px" },
  { className: "rounded-paintbox-19", name: "paintbox-19", px: "19px" },
  { className: "rounded-paintbox-21", name: "paintbox-21", px: "21px" },
];

export const shadows = [
  { className: "shadow-paintbox-md", name: "shadow-paintbox-md", spec: "0 3px 8px 0 · shadow-md color", use: "Tooltips and the toast." },
  { className: "shadow-paintbox-lg", name: "shadow-paintbox-lg", spec: "0 10px 24px −2px · shadow-lg color", use: "The Copy palette menu and the Palette type popover." },
];

export const grids = [
  { name: "grid-mobile", when: "below 768px", spec: "5 columns · margin 12 · gutter 8" },
  { name: "grid-tablet", when: "768–1023px", spec: "5 columns · margin 32 · gutter 12" },
  { name: "grid-desktop", when: "1024px and up", spec: "5 columns · margin 48 · gutter 12 · content max 1504, centred" },
  { name: "grid-landscape", when: "phone on its side", spec: "colors column + 176 rail · margin 12 · gutter 16" },
];
