"use client";

import { useRef, useState, type ComponentProps, type KeyboardEvent } from "react";
import {
  IconModeAnalogous,
  IconModeComplementary,
  IconModeMonochrome,
  IconModeRandom,
  IconModeTriadic,
} from "../../components/mode-icons";
import { PaletteTypeButton } from "../../components/palette-type-button";

// Only Analogous's description comes from the design; the rest are
// placeholder copy for the demo.
const types = [
  { name: "Random", icon: <IconModeRandom />, description: "Any colours, picked at random" },
  { name: "Analogous", icon: <IconModeAnalogous />, description: "Calm colours that sit side by side" },
  { name: "Complementary", icon: <IconModeComplementary />, description: "Opposite colours that stand out" },
  { name: "Triadic", icon: <IconModeTriadic />, description: "Three colours evenly spread out" },
  { name: "Monochrome", icon: <IconModeMonochrome />, description: "Shades and tints of one colour" },
];

const labels = {
  labelled: "Palette type (live example)",
  cell: "Palette type, cells (live example)",
  row: "Palette type, rows (live example)",
};

/*
 * Working palette type picker for the design system page: a radio group.
 * Click an option to select it. With the keyboard, Tab lands on the
 * selected option and the arrow keys move the selection (wrapping round),
 * as in a native radio group.
 */
export function PaletteTypeGroupDemo({
  variant = "labelled",
  size,
}: {
  variant?: ComponentProps<typeof PaletteTypeButton>["variant"];
  size?: ComponentProps<typeof PaletteTypeButton>["size"];
}) {
  const [selected, setSelected] = useState(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (selected + step + types.length) % types.length;
    setSelected(next);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={size === "compact" ? "Palette type, compact rows (live example)" : labels[variant]}
      onKeyDown={onKeyDown}
      className={
        variant === "row"
          ? // As many 335px columns as fit (one on narrow screens, where rows can shrink).
            "grid w-full grid-cols-[repeat(auto-fill,minmax(min(20.9375rem,100%),20.9375rem))] gap-paintbox-100"
          : "flex flex-wrap gap-paintbox-100"
      }
    >
      {types.map((type, i) => (
        <PaletteTypeButton
          key={type.name}
          ref={(el) => {
            refs.current[i] = el;
          }}
          variant={variant}
          size={size}
          icon={type.icon}
          description={variant === "row" ? type.description : undefined}
          selected={i === selected}
          tabIndex={i === selected ? 0 : -1}
          onClick={() => setSelected(i)}
        >
          {type.name}
        </PaletteTypeButton>
      ))}
    </div>
  );
}
