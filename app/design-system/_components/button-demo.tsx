"use client";

import { useState } from "react";
import { Button } from "../../components/button";
import { IconCopyAll } from "../../components/icons";

/*
 * Clickable "Copy palette" for the design system page. Demo only: it flips
 * aria-expanded as if its menu opened and closed, but there's no menu yet.
 */
export function ButtonMenuDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Button
      icon={<IconCopyAll />}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
    >
      Copy palette
    </Button>
  );
}
