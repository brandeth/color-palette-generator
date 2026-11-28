"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatPalette, type CopyFormatValue, type Palette } from "../lib/palette";
import { Button } from "./button";
import { CopyPaletteMenu, type CopyFormat } from "./copy-palette-menu";
import { IconCopyAll } from "./icons";
import { toastMessages } from "./toast-messages";
import { useCopy } from "./use-copy";

// The toast for each format when the copy works.
const copiedToast = {
  css: toastMessages.copiedCss,
  hex: toastMessages.copiedHexCodes,
  link: toastMessages.copiedLink,
};

/*
 * "Copy palette" and the menu it opens: copy the whole palette as CSS
 * variables, hex codes or a link that opens these colours.
 *
 * Click (or Enter / Space) opens the menu under the button, right-aligned,
 * 8px below, with focus on the last format used (CSS variables at first).
 * Choosing a format copies, closes the menu, puts focus back on the
 * button and shows a toast ("Copied as CSS variables", or "Couldn't copy
 * the palette. Try again."). Escape or a click outside closes it too.
 * The button shows its pressed look while the menu is open. `className`
 * goes on the button, e.g. to show it as an icon button on tablets.
 */
export function CopyPaletteButton({ palette, className }: { palette: Palette; className?: string }) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<CopyFormatValue>("css");
  const { copy } = useCopy();
  const menuId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const formats: CopyFormat[] = [
    { value: "css", name: "CSS variables", preview: `--color-1: ${palette[0]};` },
    { value: "hex", name: "Hex codes", preview: palette.join(", ") },
    { value: "link", name: "A link to this palette", preview: "Opens these exact colours" },
  ];

  // While open: focus the current format, and close on Escape or a click outside.
  useEffect(() => {
    if (!open) return;
    wrapper.current?.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function choose(value: string) {
    const chosen = value as CopyFormatValue;
    setFormat(chosen);
    setOpen(false);
    button.current?.focus();
    copy(formatPalette(chosen, palette, window.location.origin), {
      copied: copiedToast[chosen](),
      failed: toastMessages.copyPaletteFailed(),
    });
  }

  return (
    <div ref={wrapper} className="relative">
      <Button
        ref={button}
        icon={<IconCopyAll />}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={className}
      >
        Copy palette
      </Button>
      {open ? (
        <CopyPaletteMenu
          id={menuId}
          heading={`Copy all ${palette.length === 5 ? "five" : palette.length} colours as`}
          formats={formats}
          selected={format}
          onSelect={choose}
          className="absolute top-full right-0 z-20 mt-paintbox-100"
        />
      ) : null}
    </div>
  );
}
