"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { formatPalette, type CopyFormatValue, type Palette } from "../lib/palette";
import { Button } from "./button";
import { CopyPaletteMenu, type CopyFormat } from "./copy-palette-menu";
import { IconCopyAll } from "./icons";
import { toastMessages } from "./toast-messages";
import { useCopy } from "./use-copy";

// The menu's size by screen: a phone on its side (as the paintbox-landscape variant), phones
// (below 48rem), tablets (to 64rem), desktop. It only shows after a click, so the server's
// value never shows.
const LANDSCAPE = "(orientation: landscape) and (height <= 30rem) and (width < 64rem)";
const PHONE = "(width < 48rem)";
const TABLET = "(48rem <= width < 64rem)";
function subscribeScreen(onChange: () => void) {
  const queries = [LANDSCAPE, PHONE, TABLET].map((query) => window.matchMedia(query));
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}
function currentScreen() {
  if (window.matchMedia(LANDSCAPE).matches) return "landscape";
  return window.matchMedia(PHONE).matches ? "phone" : window.matchMedia(TABLET).matches ? "tablet" : "desktop";
}

// The menu for each screen, and where it sits. Phones and tablets: 8px below the button, the
// screen's width less 8px (phone) or 28px (tablet) each side, its right edge 4px past the
// button's. A phone on its side: 12px below, over the colours, where the palette type menu
// opens: its right edge 12px short of the 176px rail (so 188px left of the button's), at 8, 72
// on a 667 × 375 phone.
const menuFor = {
  landscape: { variant: "landscape", place: "right-[11.75rem] mt-paintbox-150" },
  phone: { variant: "phone", place: "-right-paintbox-050 mt-paintbox-100 w-[calc(100vw-1rem)]" },
  tablet: { variant: "wide", place: "-right-paintbox-050 mt-paintbox-100 w-[calc(100vw-3.5rem)]" },
  desktop: { variant: "default", place: "right-0 mt-paintbox-100" },
} as const;

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
 * 8px below, with focus on the first format. On tablets it's the wide
 * menu, 712px: the page's width less 28px each side, 4px past the page
 * margins; on phones the phone menu, 359px: 8px from each edge of the
 * screen; on a phone on its side the landscape menu, 459px, 12px below,
 * over the colours (as in the designs). No format shows a tick: the menu closes as
 * soon as you choose one, and the toast says what was copied.
 * Choosing a format copies, closes the menu, puts focus back on the
 * button and shows a toast ("Copied as CSS variables", or "Couldn't copy
 * the palette. Try again."). Escape or a click outside closes it too.
 * The button shows its pressed look while the menu is open. `className`
 * goes on the button, e.g. to show it as an icon button on tablets.
 */
export function CopyPaletteButton({ palette, className }: { palette: Palette; className?: string }) {
  const [open, setOpen] = useState(false);
  const menu = menuFor[useSyncExternalStore(subscribeScreen, currentScreen, () => "desktop" as const)];
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
    wrapper.current?.querySelector<HTMLElement>('[role="menuitemradio"]')?.focus();

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
          variant={menu.variant}
          onSelect={choose}
          className={["absolute top-full z-20", menu.place].join(" ")}
        />
      ) : null}
    </div>
  );
}
