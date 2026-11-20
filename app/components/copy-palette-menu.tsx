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
  /** The chosen format's value; it shows a checkmark. */
  selected?: string;
  /** Called with a format's value when it's clicked or chosen with Enter/Space. */
  onSelect?: (value: string) => void;
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
 * Keyboard: the list of formats is a role="menu" named by the heading
 * (the heading itself sits outside it, as a menu holds only items).
 * The arrow keys move focus between the formats (wrapping round), Home
 * and End jump to the first and last; only the focused format is
 * tabbable. Opening, closing (Escape) and returning focus to the button
 * are the button's job.
 */
export function CopyPaletteMenu({ heading, formats, selected, onSelect, className, ...props }: CopyPaletteMenuProps) {
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
        "flex w-[17rem] flex-col",
        "rounded-paintbox-20 border border-divider bg-surface shadow-paintbox-lg",
        "px-paintbox-100 pt-paintbox-100 pb-paintbox-150",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <p id={headingId} className="px-paintbox-150 pt-paintbox-100 text-preset-9 text-text-muted">
        {heading}
      </p>
      <div
        role="menu"
        aria-labelledby={headingId}
        onKeyDown={onKeyDown}
        // The options are 256px on their own; here they fill the 254px inside the border.
        className="mt-paintbox-100 flex flex-col gap-paintbox-100 [&>[role=menuitemradio]]:w-full"
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
