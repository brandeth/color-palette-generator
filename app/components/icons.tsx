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

/** app/assets/icon-undo.svg */
export function IconUndo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7.5 11.667 3.333 7.5 7.5 3.333" />
      <path d="M3.333 7.5h8.75a4.583 4.583 0 1 1 0 9.167H9.166" />
    </svg>
  );
}

/** app/assets/icon-redo.svg */
export function IconRedo(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12.5 11.667 16.667 7.5 12.5 3.333" />
      <path d="M16.666 7.5h-8.75a4.583 4.583 0 0 0 0 9.167h2.917" />
    </svg>
  );
}

/** app/assets/icon-copy-all.svg */
export function IconCopyAll(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 6.667H8.334c-.92 0-1.667.746-1.667 1.666V15c0 .92.746 1.667 1.667 1.667H15c.92 0 1.667-.747 1.667-1.667V8.333c0-.92-.746-1.666-1.667-1.666M10 7.5v8.333M13.333 7.5v8.333" />
      <path d="M13.333 6.667v-2.5a.833.833 0 0 0-.833-.834H4.166a.833.833 0 0 0-.833.834V12.5a.833.833 0 0 0 .833.833h2.5" />
    </svg>
  );
}

/** app/assets/icon-copy.svg */
export function IconCopy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 6.667H8.334c-.92 0-1.667.746-1.667 1.666V15c0 .92.746 1.667 1.667 1.667H15c.92 0 1.667-.747 1.667-1.667V8.333c0-.92-.746-1.666-1.667-1.666" />
      <path d="M13.333 6.667v-2.5a.833.833 0 0 0-.833-.834H4.166a.833.833 0 0 0-.833.834V12.5a.833.833 0 0 0 .833.833h2.5" />
    </svg>
  );
}

/** app/assets/icon-generate.svg */
export function IconGenerate(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.667 10A6.667 6.667 0 0 1 5 14.417M3.333 10A6.667 6.667 0 0 1 15 5.583" />
      <path d="M15 2.5v3.333h-3.333M5 17.5v-3.333h3.333" />
    </svg>
  );
}

/** app/assets/icon-check.svg */
export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4.167 10.417 3.75 3.75 7.917-7.917" />
    </svg>
  );
}

/** app/assets/icon-alert.svg */
export function IconAlert(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm0-11.25v4.583m0 2.917v.008" />
    </svg>
  );
}

/** app/assets/icon-chevron-up.svg */
export function IconChevronUp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12.5 5-5 5 5" />
    </svg>
  );
}

/** app/assets/icon-lock-open.svg */
export function IconLockOpen(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 9.167H5c-.92 0-1.667.746-1.667 1.666v5c0 .92.746 1.667 1.667 1.667h10c.92 0 1.666-.746 1.666-1.667v-5c0-.92-.746-1.666-1.666-1.666m-8.334 0V5.833a3.333 3.333 0 0 1 6.25-1.666" />
    </svg>
  );
}

/** app/assets/icon-lock-closed.svg */
export function IconLockClosed(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 9.167H5c-.92 0-1.667.746-1.667 1.666v5c0 .92.746 1.667 1.667 1.667h10c.92 0 1.666-.746 1.666-1.667v-5c0-.92-.746-1.666-1.666-1.666m-8.333 0V5.833a3.333 3.333 0 0 1 6.667 0v3.334" />
    </svg>
  );
}

/** app/assets/icon-moon.svg */
export function IconMoon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.666 12.083a6.667 6.667 0 0 1-8.75-8.75 6.667 6.667 0 1 0 8.75 8.75" />
    </svg>
  );
}
