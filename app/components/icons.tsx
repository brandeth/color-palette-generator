import type { SVGProps } from "react";

/*
 * Inline versions of the SVGs in app/assets, drawn with `currentColor` so
 * they take the surrounding text color (and switch with light/dark theme).
 * Decorative by default: pass `aria-hidden={false}` + `aria-label` if an icon
 * is the only content of a control.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.667,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

/** app/assets/icon-palette.svg */
export function IconPalette(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15.833 3.333H4.167C3.247 3.333 2.5 4.08 2.5 5v10c0 .92.746 1.667 1.667 1.667h11.666c.92 0 1.667-.747 1.667-1.667V5c0-.92-.746-1.667-1.667-1.667m-8.333 0v13.334m5-13.334v13.334" />
    </svg>
  );
}

/** app/assets/icon-preview.svg */
export function IconPreview(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15.833 3.333H4.167C3.247 3.333 2.5 4.08 2.5 5v10c0 .92.746 1.667 1.667 1.667h11.666c.92 0 1.667-.747 1.667-1.667V5c0-.92-.746-1.667-1.667-1.667M2.5 7.5h15M5.833 10.833h5m-5 2.5h2.5" />
    </svg>
  );
}
