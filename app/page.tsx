import { Suspense } from "react";
import { PaletteApp } from "./components/palette-app";
import { PaletteFromLink } from "./components/palette-from-link";
import { defaultPalette } from "./lib/palette";

/*
 * The palette generator. The page is prerendered with the default palette;
 * in the browser, the part that reads the link's colours takes over (it
 * needs the URL, so it sits in a Suspense boundary).
 */
export default function Home() {
  return (
    <Suspense fallback={<PaletteApp initialPalette={defaultPalette} />}>
      <PaletteFromLink />
    </Suspense>
  );
}
