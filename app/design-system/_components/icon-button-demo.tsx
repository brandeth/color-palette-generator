"use client";

import { useState } from "react";
import { IconButton } from "../../components/icon-button";
import { IconMoon } from "../../components/icons";

/*
 * Clickable toggle for the design system page. Demo only: it flips
 * aria-pressed, it doesn't change the page theme (the switcher in the
 * header does that).
 */
export function IconButtonToggleDemo() {
  const [pressed, setPressed] = useState(false);

  return (
    <IconButton
      icon={<IconMoon />}
      label="Dark mode (live example)"
      pressed={pressed}
      onClick={() => setPressed((p) => !p)}
    />
  );
}
