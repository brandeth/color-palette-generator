"use client";

import { useSearchParams } from "next/navigation";
import { defaultPalette, parsePaletteParam } from "../lib/palette";
import { PaletteApp } from "./palette-app";

/*
 * The generator, starting from the palette in the link if there is one
 * (`?colors=EEE8DF-D8A38C-B6363F-87294D-551B45`, as Copy palette's "A link
 * to this palette" makes), otherwise from the default palette.
 */
export function PaletteFromLink() {
  const params = useSearchParams();
  return <PaletteApp initialPalette={parsePaletteParam(params.get("colors")) ?? defaultPalette} />;
}
