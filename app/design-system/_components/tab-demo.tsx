"use client";

import { useState } from "react";
import { IconPalette, IconPreview } from "../../components/icons";
import { Tab } from "../../components/tab";

/*
 * Clickable Palette / Preview pair for the design system page.
 * Demo only: arrow-key navigation and tab panels belong to the real
 * tablist, which isn't built yet.
 */
export function TabDemo() {
  const [selected, setSelected] = useState<"palette" | "preview">("palette");

  return (
    <div role="tablist" aria-label="Live tab example" className="flex gap-paintbox-100">
      <Tab icon={<IconPalette />} selected={selected === "palette"} onClick={() => setSelected("palette")}>
        Palette
      </Tab>
      <Tab icon={<IconPreview />} selected={selected === "preview"} onClick={() => setSelected("preview")}>
        Preview
      </Tab>
    </div>
  );
}
