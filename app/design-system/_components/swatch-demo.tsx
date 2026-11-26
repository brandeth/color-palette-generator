"use client";

import { useState, type ComponentProps } from "react";
import { Swatch } from "../../components/swatch";

/*
 * Working swatch for the design system page: Lock locks and unlocks, and
 * the hex code copies. Demo only: it doesn't lock any palette colour.
 */
export function SwatchDemo(props: Omit<ComponentProps<typeof Swatch>, "locked" | "onLockedChange">) {
  const [locked, setLocked] = useState(false);

  return <Swatch {...props} locked={locked} onLockedChange={setLocked} />;
}
