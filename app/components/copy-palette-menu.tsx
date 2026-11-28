"use client";

import { useId, useRef, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { CopyOption } from "./copy-option";

export type CopyFormat = {
  /** Identifies the format in onSelect and `selected`, e.g. "css". */
  value: string;
  /** The format's name, e.g. "CSS variables". */
  name: ReactNode;
  /** A sample of the output, e.g. "--color-1: #EEE8DF;". Cut off with "…" if too long. */
  preview: ReactNode;
};

type CopyPaletteMenuProps = Omit<ComponentProps<"div">, "children" | "onSelect"> & {
  /** Shown above the formats and used as the menu's accessible name. */
  heading: ReactNode;
  formats: CopyFormat[];
  /**
   * The chosen format's value; it shows a checkmark. Leave it out for a
   * menu that never ticks (the app's): the options then drop the
   * checkmark's space, so the previews get the full width.
   */
  selected?: string;
  /** Called with a format's value when it's clicked or chosen with Enter/Space. */
  onSelect?: (value: string) => void;
  /**
   * "default": the dropdown under the button.
   * "sheet": the version that slides up on small screens: roomier, with
   * 72px options (bigger touch targets) and 16px corners.
   * "landscape": the sheet for a phone on its side: same layout, 459px wide.
   * "wide": the dropdown on tablets: as wide as you make it (712px in the
   * design), 69px options with no gaps between them.
   * "phone": the dropdown on phones: as wide as you make it (359px in the
   * design), 16px corners, 80px options with no gaps between them.
   */
  variant?: "default" | "sheet" | "landscape" | "wide" | "phone";
};

// Sheet and landscape share everything but the width.
const roomy = {
  box: "rounded-paintbox-16 pb-paintbox-200",
  heading: "pt-paintbox-150",
  list: "mt-paintbox-100 gap-paintbox-100",
  option: "[&>[role=menuitemradio]]:min-h-[4.5rem]",
};

const variantClasses = {
  default: {
    width: "w-[17rem]",
    box: "rounded-paintbox-20 pb-paintbox-150",
    heading: "pt-paintbox-100",
    list: "mt-paintbox-100 gap-paintbox-100",
    option: "",
  },
  sheet: { width: "w-[17rem]", ...roomy }, // 272px
  landscape: { width: "w-[28.6875rem]", ...roomy }, // 459px
  // The width comes from the caller. Heading 8 12 4; options padding 12 (69px), touching.
  wide: {
    width: "",
    box: "rounded-paintbox-20 pb-paintbox-100",
    heading: "pt-paintbox-100 pb-paintbox-050",
    list: "",
    option: "[&>[role=menuitemradio]]:py-paintbox-150",
  },
  // The width comes from the caller. Radius 16, heading 12 12 4, options 80px, touching, 12 below.
  phone: {
    width: "",
    box: "rounded-paintbox-16 pb-paintbox-150",
    heading: "pt-paintbox-150 pb-paintbox-050",
    list: "",
    option: "[&>[role=menuitemradio]]:min-h-[5rem]",
  },
};

/*
 * The menu the "Copy palette" button opens: a heading and one CopyOption
 * per format.
 *
 * Default state: 272px wide, including a 1px border in the divider
 * token. Surface background, radius 20, the large shadow
 * (shadow-paintbox-lg, meant for this menu). Inside the border: padding
 * 8 at the sides and top, 12 at the bottom. The heading is Text Preset 9
 * in text-muted with 12px side padding (so it lines up with the options'
 * text) and 8px above it. 8px below the heading and between the
 * options, which fill the width (254px). With three formats it's 254px
 * tall (1 + 8 + 8 + 16.9 + 8 + 3 × 61.1 + 2 × 8 + 12 + 1).
 *
 * Sheet variant: same width, border, shadow, heading and keyboard, but
 * radius 16, 12px above the heading, 16px at the bottom, and each option
 * at least 72px tall with its text centred: 295px tall with three
 * formats (1 + 8 + 12 + 16.9 + 8 + 3 × 72 + 2 × 8 + 16 + 1).
 *
 * Landscape variant: the sheet at 459px wide (options 441px), for a phone
 * on its side. Same heights, so 459×295; the samples have room to show
 * in full (all five hex codes).
 *
 * Wide variant (tablets): the default box at whatever width you give it
 * (712px in the design), with 8px at the bottom, the heading padded
 * 8 12 4, and the options 69px tall (padding 12) with no gaps between
 * them: 254px tall with three formats (1 + 8 + 28.9 + 3 × 69.1 + 8 + 1).
 *
 * Phone variant: the same at whatever width you give it (359px in the
 * design) with 16px corners, 12px above the heading and 4 below it, 80px
 * options (their text centred) with no gaps, and 12px at the bottom:
 * 295px tall with three formats (1 + 8 + 32.9 + 3 × 80 + 12 + 1).
 *
 * Keyboard: the list of formats is a role="menu" named by the heading
 * (the heading itself sits outside it, as a menu holds only items).
 * The arrow keys move focus between the formats (wrapping round), Home
 * and End jump to the first and last; only the focused format is
 * tabbable. Opening, closing (Escape) and returning focus to the button
 * are the button's job.
 */
export function CopyPaletteMenu({
  heading,
  formats,
  selected,
  onSelect,
  variant = "default",
  className,
  ...props
}: CopyPaletteMenuProps) {
  const classes = variantClasses[variant];
  const headingId = useId();
  const [focused, setFocused] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent) {
    const last = formats.length - 1;
    const target = {
      ArrowDown: focused === last ? 0 : focused + 1,
      ArrowUp: focused === 0 ? last : focused - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setFocused(target);
    refs.current[target]?.focus();
  }

  return (
    <div
      className={[
        "flex flex-col",
        classes.width,
        "border border-divider bg-surface shadow-paintbox-lg",
        "px-paintbox-100 pt-paintbox-100",
        classes.box,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p id={headingId} className={`px-paintbox-150 text-preset-9 text-text-muted ${classes.heading}`}>
        {heading}
      </p>
      <div
        role="menu"
        aria-labelledby={headingId}
        onKeyDown={onKeyDown}
        // The options are 256px on their own; here they fill the width inside the border.
        className={[
          "flex flex-col [&>[role=menuitemradio]]:w-full",
          classes.list,
          classes.option,
          // No chosen format: no checkmarks, and no space kept for them.
          selected === undefined ? "[&>[role=menuitemradio]_svg]:hidden" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {formats.map((format, i) => (
          <CopyOption
            key={format.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            preview={format.preview}
            selected={format.value === selected}
            tabIndex={i === focused ? 0 : -1}
            onFocus={() => setFocused(i)}
            onClick={() => onSelect?.(format.value)}
          >
            {format.name}
          </CopyOption>
        ))}
      </div>
    </div>
  );
}
