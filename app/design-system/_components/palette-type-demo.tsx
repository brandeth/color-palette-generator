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

const types = [
  { name: "Random", icon: <IconModeRandom /> },
  { name: "Analogous", icon: <IconModeAnalogous /> },
  { name: "Complementary", icon: <IconModeComplementary /> },
  { name: "Triadic", icon: <IconModeTriadic /> },
  { name: "Monochrome", icon: <IconModeMonochrome /> },
];

/*
 * Working palette type picker for the design system page: a radio group.
 * Click an option to select it. With the keyboard, Tab lands on the
 * selected option and the arrow keys move the selection (wrapping round),
 * as in a native radio group.
 */
export function PaletteTypeGroupDemo({
  variant = "labelled",
}: {
  variant?: ComponentProps<typeof PaletteTypeButton>["variant"];
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
    <div role="radiogroup" aria-label={variant === "cell" ? "Palette type, cells (live example)" : "Palette type (live example)"} onKeyDown={onKeyDown} className="flex flex-wrap gap-paintbox-100">
      {types.map((type, i) => (
        <PaletteTypeButton
          key={type.name}
          ref={(el) => {
            refs.current[i] = el;
          }}
          variant={variant}
          icon={type.icon}
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
