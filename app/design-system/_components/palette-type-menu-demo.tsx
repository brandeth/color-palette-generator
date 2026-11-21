"use client";

import { useState, type ComponentProps } from "react";
import { PaletteTypeMenu } from "../../components/palette-type-menu";
import { paletteTypes } from "./palette-types";

/*
 * Working palette type menu for the design system page: click a type, or
 * Tab in and use the arrow keys, Home and End. Demo only: it doesn't
 * change any palette.
 */
export function PaletteTypeMenuDemo({ variant }: Pick<ComponentProps<typeof PaletteTypeMenu>, "variant">) {
  const [selected, setSelected] = useState("analogous");

  return (
    <PaletteTypeMenu
      variant={variant}
      aria-label={variant === "landscape" ? "Palette type menu, landscape (live example)" : "Palette type menu (live example)"}
      types={paletteTypes}
      selected={selected}
      onSelect={setSelected}
      className="max-w-full"
    />
  );
}
