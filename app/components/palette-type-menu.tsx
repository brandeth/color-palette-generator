"use client";

import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from "react";
import { PaletteTypeButton } from "./palette-type-button";

export type PaletteType = {
  /** Identifies the type in onSelect and `selected`, e.g. "analogous". */
  value: string;
  /** e.g. "Analogous". */
  name: ReactNode;
  /** e.g. "Calm colours that sit side by side". */
  description: ReactNode;
  /** The mode icon, e.g. <IconModeAnalogous />. */
  icon: ReactNode;
};

type PaletteTypeMenuProps = Omit<ComponentProps<"div">, "role" | "children" | "onSelect"> & {
  /** Accessible name for the group, e.g. "Palette type". */
  "aria-label": string;
  types: PaletteType[];
  /** The chosen type's value; it shows the selected look and a checkmark. */
  selected: string;
  /** Called with a type's value when it's clicked or reached with the arrow keys. */
  onSelect?: (value: string) => void;
};

/*
 * The popover the palette type button opens: one PaletteTypeButton row
 * per type.
 *
 * One-column variant: 358px wide, including a 1px border in the divider
 * token. Surface background, radius 16, the large shadow
 * (shadow-paintbox-lg, meant for this popover). Padding 8, rows 4px
 * apart. Each row fills the width (340px) and is at least 92px tall,
 * with the icon and text centred; long descriptions wrap to two lines.
 * With five types it's 494px tall (1 + 8 + 5 × 92 + 4 × 4 + 8 + 1).
 *
 * Only one type can be chosen, so it's a role="radiogroup" of radios,
 * like a native radio group: Tab lands on the selected type, and the
 * arrow keys move the selection (wrapping round), as do Home and End.
 * Opening, closing (Escape) and returning focus to the button are the
 * button's job.
 */
export function PaletteTypeMenu({ types, selected, onSelect, className, ...props }: PaletteTypeMenuProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = Math.max(
    0,
    types.findIndex((type) => type.value === selected),
  );

  function onKeyDown(event: KeyboardEvent) {
    const last = types.length - 1;
    const target = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowRight: current === last ? 0 : current + 1,
      ArrowUp: current === 0 ? last : current - 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    onSelect?.(types[target].value);
    refs.current[target]?.focus();
  }

  return (
    <div
      role="radiogroup"
      onKeyDown={onKeyDown}
      className={[
        "flex w-[22.375rem] flex-col gap-paintbox-050",
        "rounded-paintbox-16 border border-divider bg-surface p-paintbox-100 shadow-paintbox-lg",
        // Rows are 61px on their own; here they are at least 92px, content centred.
        "[&>[role=radio]]:min-h-[5.75rem]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {types.map((type, i) => (
        <PaletteTypeButton
          key={type.value}
          ref={(el) => {
            refs.current[i] = el;
          }}
          variant="row"
          icon={type.icon}
          description={type.description}
          selected={i === current}
          tabIndex={i === current ? 0 : -1}
          onClick={() => onSelect?.(type.value)}
        >
          {type.name}
        </PaletteTypeButton>
      ))}
    </div>
  );
}
