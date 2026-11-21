"use client";

import { useState } from "react";
import { PaletteTypeMenu } from "../../components/palette-type-menu";
import { paletteTypes } from "./palette-types";

/*
 * Working palette type menu for the design system page: click a type, or
 * Tab in and use the arrow keys, Home and End. Demo only: it doesn't
 * change any palette.
 */
export function PaletteTypeMenuDemo() {
  const [selected, setSelected] = useState("analogous");

  return (
    <PaletteTypeMenu
      aria-label="Palette type menu (live example)"
      types={paletteTypes}
      selected={selected}
      onSelect={setSelected}
      className="max-w-full"
    />
  );
}
