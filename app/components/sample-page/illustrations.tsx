import type { SVGProps } from "react";

/*
 * Inline versions of the Fellside artwork in app/assets, so the palette
 * roles colour them: each shape is filled from a role variable set on the
 * sample page (--lightest, --light, --mid, --dark, --darkest).
 * Decorative: the text next to each one says what it shows.
 */

type ArtProps = SVGProps<SVGSVGElement>;

const decorative = { xmlns: "http://www.w3.org/2000/svg", fill: "none", "aria-hidden": true, focusable: false } as const;

/**
 * app/assets/logo-fellside.svg: a sun over a peak. Colour them with
 * --fellside-sun and --fellside-peak (mid and darkest by default).
 */
export function FellsideMark(props: ArtProps) {
  return (
    <svg {...decorative} width={24} height={24} viewBox="0 0 24 24" {...props}>
      <path d="M17 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" className="fill-[var(--fellside-sun,var(--mid))]" />
      <path d="M1 21 9 8l5 7 3-4 6 10z" className="fill-[var(--fellside-peak,var(--darkest))]" />
    </svg>
  );
}

/*
 * app/assets/illustration-hero.svg: hills under a low sun, with a dotted
 * path. It fills whatever box it's given, cropped from the middle (the
 * design crops it to a wider strip on desktop).
 */
export function HeroLandscape(props: ArtProps) {
  return (
    <svg {...decorative} viewBox="0 0 411 205.5" preserveAspectRatio="xMidYMid slice" {...props}>
      <path d="M411-68.5H0v274h411z" className="fill-(--light)" />
      <path
        d="M256.875 90.763c14.187 0 25.687-11.501 25.687-25.688s-11.5-25.687-25.687-25.687-25.687 11.5-25.687 25.687 11.5 25.688 25.687 25.688"
        className="fill-(--lightest)"
      />
      <path
        d="M0 107.888c59.938-47.95 119.875-54.8 188.375-25.688 68.5 29.113 137-41.1 222.625-11.987V205.5H0z"
        className="fill-(--mid)"
      />
      <path
        d="M0 145.562c77.063-37.675 162.688-34.25 231.188-8.562 68.5 25.687 128.437-22.263 179.812-10.275V205.5H0z"
        className="fill-(--dark)"
      />
      <path
        strokeDasharray="0.65 7.78"
        strokeLinecap="round"
        strokeWidth={2.592}
        d="M61.65 191.8c30.262-18.493 81.981-35.336 158.397-53.769"
        className="stroke-(--lightest)"
      />
      <path
        d="M0 205.5v-29.112c102.75-25.688 222.625-20.55 308.25 3.425s77.062 10.275 102.75 5.137v20.55z"
        className="fill-(--darkest)"
      />
    </svg>
  );
}

/** app/assets/illustration-brackenfold-edge.svg: a ridge under the sun. 2:1. */
export function WalkBrackenfoldEdge(props: ArtProps) {
  return (
    <svg {...decorative} viewBox="0 0 389.33 194.665" {...props}>
      <path d="M389.33 0H0v194.665h389.33z" className="fill-(--lightest)" />
      <path
        d="M87.6 87.6c13.438 0 24.332-10.895 24.332-24.334s-10.894-24.333-24.333-24.333-24.333 10.894-24.333 24.333S74.16 87.6 87.6 87.6"
        className="fill-(--light)"
      />
      <path d="m0 145.999 85.166-60.833 48.666 31.633 85.166-75.433 97.333 80.3 72.999-36.5v109.499H0z" className="fill-(--mid)" />
      <path
        d="M0 165.465c97.333-29.199 206.832-24.333 291.997-4.866s73 9.733 97.333 4.866v29.2H0z"
        className="fill-(--dark)"
      />
      <path d="M0 194.665v-12.167c121.666-12.166 243.331-9.733 389.33 2.434v9.733z" className="fill-(--darkest)" />
    </svg>
  );
}

/** app/assets/illustration-mirefoot-water.svg: a lake with ripples. 2:1. */
export function WalkMirefootWater(props: ArtProps) {
  return (
    <svg {...decorative} viewBox="0 0 389.33 194.665" {...props}>
      <path d="M389.33 0H0v194.665h389.33z" className="fill-(--lightest)" />
      <path
        d="M0 75.433C72.999 48.666 145.999 43.8 218.998 65.7s121.666-17.033 170.332-4.866v72.999H0z"
        className="fill-(--mid)"
      />
      <path d="M0 126.532h389.33v43.8H0z" className="fill-(--light)" />
      <path
        strokeLinecap="round"
        strokeWidth={3.65}
        d="M48.666 141.132h72.999m60.833 9.733h97.333m24.333-14.599h48.666"
        className="stroke-(--lightest)"
      />
      <path
        d="M0 163.032c85.166-7.3 182.498-2.433 255.498 7.3 72.999 9.733 97.332 7.3 133.832 2.433v21.9H0z"
        className="fill-(--dark)"
      />
      <path d="M0 194.665v-9.733c109.499-7.3 267.664-4.867 389.33 4.866v4.867z" className="fill-(--darkest)" />
    </svg>
  );
}

/** app/assets/illustration-hazel-clough.svg: pine trees on a slope. 2:1. */
export function WalkHazelClough(props: ArtProps) {
  return (
    <svg {...decorative} viewBox="0 0 389.33 194.665" {...props}>
      <path d="M389.33 0H0v194.665h389.33z" className="fill-(--lightest)" />
      <path d="M0 133.832c109.499-24.333 243.331-21.9 389.33-7.3v68.133H0z" className="fill-(--light)" />
      <path
        d="m36.5 158.165 38.933-97.332 38.933 97.332zm97.332 7.3 31.634-80.299 31.633 80.299zm145.999-4.866 38.933-104.633L357.697 160.6z"
        className="fill-(--mid)"
      />
      <path
        d="m85.166 177.632 41.366-99.766 41.367 99.766zm133.832 2.433 36.5-87.599 36.5 87.599zm109.499 2.434 34.067-80.3 31.633 80.3z"
        className="fill-(--dark)"
      />
      <path d="M0 194.665v-17.033c133.832-12.167 267.664-9.734 389.33 2.433v14.6z" className="fill-(--darkest)" />
    </svg>
  );
}
