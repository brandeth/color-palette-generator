"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PaletteTypeValue } from "../lib/palette";
import { PaletteTypeMenu } from "./palette-type-menu";
import { PaletteTypeTrigger } from "./palette-type-trigger";
import { paletteTypes } from "./palette-types";

type PaletteTypePickerProps = {
  selected: PaletteTypeValue;
  onSelect: (value: PaletteTypeValue) => void;
  /** A type was picked but nothing generated with it yet: the button says "Tap Generate". */
  waiting?: boolean;
  className?: string;
};

/*
 * The palette type on phones: the Palette type button (the current type's
 * diagram and name) opening the menu of all five, with their descriptions.
 *
 * The menu opens above the button (its chevron points up), from its left
 * edge, 8px up, with focus on the chosen type. Arrow keys (and Home / End)
 * change the type as they move; clicking a type, or Enter / Space on it,
 * chooses it and closes the menu. Escape or a click outside closes it
 * too. Closing puts focus back on the button.
 */
export function PaletteTypePicker({ selected, onSelect, waiting = false, className }: PaletteTypePickerProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const current = paletteTypes.find((type) => type.value === selected) ?? paletteTypes[0];

  // While open: focus the chosen type, and close on Escape or a click outside.
  useEffect(() => {
    if (!open) return;
    wrapper.current?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className={["relative flex min-w-0", className].filter(Boolean).join(" ")}>
      <PaletteTypeTrigger
        ref={button}
        icon={current.icon}
        waiting={waiting}
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((isOpen) => !isOpen)}
        // Fills the space beside Generate (207px in the design) instead of its own 236;
        // min-w-0 lets it go narrower than that 236.
        className="min-w-0 grow basis-0"
      >
        {current.name}
      </PaletteTypeTrigger>
      {open ? (
        <PaletteTypeMenu
          id={menuId}
          aria-label="Palette type"
          types={paletteTypes}
          selected={selected}
          onSelect={(value) => onSelect(value as PaletteTypeValue)}
          // A click (or Enter / Space) on a type chooses it and closes; the arrow keys only move.
          onClick={(event) => {
            if ((event.target as Element).closest('[role="radio"]')) {
              setOpen(false);
              button.current?.focus();
            }
          }}
          className="absolute bottom-full left-0 z-20 mb-paintbox-100 max-w-[calc(100vw-1.5rem)]"
        />
      ) : null}
    </div>
  );
}
