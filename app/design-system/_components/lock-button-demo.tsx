"use client";

import { useState, type ComponentProps } from "react";
import { LockButton } from "../../components/lock-button";

/*
 * Working lock button for the design system page: click (or press
 * Enter/Space) to lock and unlock. Demo only: it doesn't lock any colour.
 */
export function LockButtonDemo({
  swatch,
  variant,
  "aria-label": ariaLabel,
}: Pick<ComponentProps<typeof LockButton>, "swatch" | "variant" | "aria-label">) {
  const [locked, setLocked] = useState(false);

  return (
    <LockButton
      swatch={swatch}
      variant={variant}
      aria-label={ariaLabel}
      locked={locked}
      onClick={() => setLocked(!locked)}
    />
  );
}
