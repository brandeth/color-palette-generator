"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { PaletteTypeValue } from "../lib/palette";
import { PaletteTypeMenu } from "./palette-type-menu";
import { PaletteTypeTrigger } from "./palette-type-trigger";
import { paletteTypes } from "./palette-types";

// A phone on its side, as the paintbox-landscape variant. The menu only shows after a click,
// so the server's value never shows.
const LANDSCAPE = "(orientation: landscape) and (height <= 30rem) and (width < 64rem)";
function subscribeLandscape(onChange: () => void) {
  const query = window.matchMedia(LANDSCAPE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const isLandscape = () => window.matchMedia(LANDSCAPE).matches;

// Where the menu opens. Upright: above the button, the screen's width less 8px each side (the
// button sits 12px in, so 4px further left). On its side, there's no room above: the landscape
// menu (459px) opens to the button's left, 8px away and level with its top, over the colours.
const menuPlace = {
  upright: "bottom-full -left-paintbox-050 mb-paintbox-100 w-[calc(100vw-1rem)]!",
  landscape: "top-0 right-full mr-paintbox-100",
};

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
 * The menu opens above the button (its chevron points up), 8px up, as
 * wide as the screen less 8px each side (359px on a 375 phone, as in the
 * design), with focus on the chosen type. On a phone on its side the
 * button fills the 176px rail (12px in on the left, 8 on the right, 4
 * between) and the landscape menu (459 × 294) opens to its left, level
 * with its top. Arrow keys (and Home / End)
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
  const landscape = useSyncExternalStore(subscribeLandscape, isLandscape, () => false);

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
        // min-w-0 lets it go narrower than that 236. On its side it fills the 176px rail with
        // the Rail padding: 12 left, 8 right, 4 gap.
        className={[
          "min-w-0 grow basis-0",
          "paintbox-landscape:gap-paintbox-050 paintbox-landscape:pr-paintbox-100 paintbox-landscape:pl-paintbox-150",
        ].join(" ")}
      >
        {current.name}
      </PaletteTypeTrigger>
      {open ? (
        <PaletteTypeMenu
          id={menuId}
          aria-label="Palette type"
          variant={landscape ? "landscape" : "one-column"}
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
          className={["absolute z-20", menuPlace[landscape ? "landscape" : "upright"]].join(" ")}
        />
      ) : null}
    </div>
  );
}
