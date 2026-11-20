import type { SVGProps } from "react";

/*
 * Palette type (mode) icons: inline copies of app/assets/icon-mode-*.svg.
 *
 * Unlike icons.tsx, these keep their own colors: each one previews the
 * kind of palette it stands for, so the dots don't follow the text color.
 * The outer circle is paintbox-neutral-500 (#7A828B), which reads on both
 * light and dark backgrounds. 32×32, decorative.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  "aria-hidden": true,
  focusable: false,
};

const ring = "M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12Z";
const dotStroke = { stroke: "#1b1f24", strokeOpacity: 0.14 };

function ModeIcon({ dots, ...props }: IconProps & { dots: [fill: string, d: string][] }) {
  return (
    <svg {...base} {...props}>
      <path stroke="#7a828b" strokeWidth={2} d={ring} />
      {dots.map(([fill, d]) => (
        <path key={d} fill={fill} {...dotStroke} d={d} />
      ))}
    </svg>
  );
}

/** app/assets/icon-mode-analogous.svg */
export function IconModeAnalogous(props: IconProps) {
  return (
    <ModeIcon
      {...props}
      dots={[
        ["#0791a0", "M6 12a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 6 12Z"],
        ["#088ac2", "M10.4 8a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 10.4 8Z"],
        ["#4e7bdf", "M16 6.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#846ad7", "M21.6 8a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 21.6 8Z"],
        ["#a95bba", "M26 12a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 26 12Z"],
      ]}
    />
  );
}

/** app/assets/icon-mode-complementary.svg */
export function IconModeComplementary(props: IconProps) {
  return (
    <ModeIcon
      {...props}
      dots={[
        ["#088ac2", "M10.4 8a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 10.4 8Z"],
        ["#4e7bdf", "M16 6.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#846ad7", "M21.6 8a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 21.6 8Z"],
        ["#948000", "M13.067 30.267a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#b17000", "M18.933 30.267a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
      ]}
    />
  );
}

/** app/assets/icon-mode-monochrome.svg */
export function IconModeMonochrome(props: IconProps) {
  return (
    <ModeIcon
      {...props}
      dots={[
        ["#a7c4fe", "M16 6.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#7ba0ed", "M16 12.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#5b7ec8", "M16 18.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#3d5da4", "M16 24.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#203d81", "M16 30.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
      ]}
    />
  );
}

/** app/assets/icon-mode-random.svg */
export function IconModeRandom(props: IconProps) {
  return (
    <ModeIcon
      {...props}
      dots={[
        ["#776fdb", "M20.134 7.333a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333Z"],
        ["#c84f7e", "M28 19.733a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333Z"],
        ["#55941c", "M6.8 26.4a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333Z"],
        ["#018eb1", "M12 14a2.667 2.667 0 1 0 0-5.333A2.667 2.667 0 0 0 12 14Z"],
        ["#c95c07", "M19.334 23.333a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333Z"],
      ]}
    />
  );
}

/** app/assets/icon-mode-triadic.svg */
export function IconModeTriadic(props: IconProps) {
  return (
    <ModeIcon
      {...props}
      dots={[
        ["#1883db", "M13.067 7.067a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#6d72dd", "M18.933 7.067a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#cc4f6a", "M27.6 22a2.667 2.667 0 1 0 0-5.333 2.667 2.667 0 0 0 0 5.333Z"],
        ["#cd562f", "M24.667 27.067a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
        ["#35983a", "M5.6 24.667a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"],
      ]}
    />
  );
}
