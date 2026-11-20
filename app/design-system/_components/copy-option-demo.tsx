"use client";

import { useState, type ComponentProps } from "react";
import { CopyPaletteMenu } from "../../components/copy-palette-menu";
import { copyFormats } from "./copy-formats";

/*
 * Working copy palette menu for the design system page. Click (or press
 * Enter/Space on) a format to check it; the arrow keys, Home and End move
 * between formats. Demo only: it doesn't copy anything.
 */
export function CopyMenuDemo({ variant }: { variant?: ComponentProps<typeof CopyPaletteMenu>["variant"] }) {
  const [selected, setSelected] = useState("css");

  return (
    <CopyPaletteMenu
      variant={variant}
      heading="Copy all five colours as"
      formats={copyFormats}
      selected={selected}
      onSelect={setSelected}
    />
  );
}
