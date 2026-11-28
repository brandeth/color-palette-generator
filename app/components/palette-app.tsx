"use client";

import {
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { generatePalette, roleNames, type Palette, type PaletteTypeValue } from "../lib/palette";
import { CopyPaletteButton } from "./copy-palette-button";
import { GenerateButton } from "./generate-button";
import { IconButton } from "./icon-button";
import { IconMoon, IconPalette, IconPreview, IconRedo, IconUndo } from "./icons";
import { PaintboxLogo } from "./paintbox-logo";
import { PaletteTypeButton } from "./palette-type-button";
import { PaletteTypePicker } from "./palette-type-picker";
import { RoleLabel } from "./role-label";
import { paletteTypes } from "./palette-types";
import { SamplePage } from "./sample-page/sample-page";
import { Swatch } from "./swatch";
import { Tab } from "./tab";
import { toastMessages } from "./toast-messages";
import { useToast } from "./toaster";
import { Tooltip } from "./tooltip";

type View = "palette" | "preview";

const views: { value: View; label: string; Icon: typeof IconPalette }[] = [
  { value: "palette", label: "Palette", Icon: IconPalette },
  { value: "preview", label: "Preview", Icon: IconPreview },
];

/* The palette with its undo and redo stacks. */
type History = { past: Palette[]; present: Palette; future: Palette[] };
type HistoryAction = { type: "set"; palette: Palette } | { type: "undo" } | { type: "redo" };

function historyReducer(state: History, action: HistoryAction): History {
  switch (action.type) {
    case "set":
      return { past: [...state.past, state.present], present: action.palette, future: [] };
    case "undo": {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] };
    }
    case "redo": {
      const [next, ...rest] = state.future;
      if (!next) return state;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
  }
}

// Whether to show Mac shortcuts (⌘) in the tooltips; Ctrl elsewhere, and while rendering on the server.
const noSubscription = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

// Space generates only when it isn't already pressing or typing into something.
const INTERACTIVE =
  "button, a, input, textarea, select, [contenteditable], [role='menu'], [role='radio'], [role='tab']";

/*
 * The palette generator (the home page), filling the window. Desktop
 * (64rem up) is the design's 1440 × 900; tablet (48 to 64rem) its
 * 768 × 1024; phone (below 48rem) its 375 × 812. The layouts switch in
 * CSS, so nothing jumps on load.
 *
 * Page: background colour, padding 32 48, three rows 24px apart.
 * Tablet: padding 20 32 12, rows 16px apart. Phone: padding 20 12 12,
 * rows 12px apart.
 *
 * Header (40px): the logo with the palette's dots on the left, the
 * Palette / Preview tabs in the middle (4px apart), and Undo, Redo (4px
 * apart) and Copy palette on the right, 8px apart. The left and right
 * parts share the leftover width, so the tabs stay centred.
 *
 * Tablet header: the same, with the 26px wordmark and Copy palette as a
 * 40px icon button (same name and menu).
 *
 * Phone header (92px): two rows 12px apart. The 24px wordmark (no dots)
 * with Undo, Redo and Copy palette on the right, 8px apart; then the
 * tabs, sharing the full width (173.5px each).
 *
 * Colours (the rest of the height): five Swatch columns, 12px apart, each
 * with its Lock and Copy hex. Tablet: five rows sharing the height, 12px
 * apart, each with the hex code and then Lock on the left. Phone: the
 * same rows, 8px apart, with the round 40px Lock. Preview shows
 * the sample page here instead, filled with the palette (Page, Cards,
 * Buttons, Footer, Text).
 *
 * Controls (69px): on the same five columns as the colours: the palette
 * types across the first two, the chosen type's description across the
 * next two, and Generate (with the Space shortcut) under the last.
 * Tablet (padding 8 0, rows 8px apart): the types as five equal cells
 * across the width (24px icons, 61px tall); below them the description
 * (14px) and Generate (medium: padding 20, no Space badge).
 * Phone (64px, padding 8 0, 8px apart): the Palette type button, which
 * opens the menu of types, filling the width beside Generate (medium).
 * After you pick a type and before you generate, it says "Tap Generate".
 *
 * Caption (tablet and desktop): the chosen type's description. While
 * waiting, "Press Generate to use it" (Text Preset 8 Bold, pending green)
 * above it. Hovering another type with a mouse previews that one
 * instead: its name (Text Preset 7 Bold on desktop, muted) above its
 * description.
 *
 * Preview (desktop, the design's Preview): the colours as a strip, five
 * Strip swatches 64px tall (small hex code, round Lock), each with its
 * role (Page, Cards, Buttons, Footer, Text) under it, 89px in all; then
 * the sample page in the rest of the height (566px at 1440 × 900),
 * scrolling inside its box (no scrollbar), with the 2px swatch-edge drawn over it. The
 * moon (Dark preview) shows 8px right of the tabs, without moving them,
 * with its name in a tooltip 8px to its right on hover (Undo and Redo
 * get theirs below them, with their shortcuts);
 * pressed, the sample page shows its dark version (the darkest role as
 * the page, the lightest as its text; cards, pictures and footer as they
 * are). Tablet: Strip Icon swatches (131 × 64) with the role and its
 * hex centred below, 28px (as in the design). Phone (the design's
 * Mobile Preview): Strip Compact swatches (63.8 × 56, 8px apart, the
 * whole swatch is Lock) with the role centred below in the text colour,
 * 81px in all; the moon joins the top row, 8px before Undo, and the tabs
 * keep the full width below.
 *
 * Generate (or Space, when focus isn't on a control) makes a new palette
 * of the chosen type, keeping locked colours; with all five locked it
 * says so in a toast instead. Undo and Redo step through the palettes
 * (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z or Ctrl+Y); they're dimmed when there's
 * nothing to go back or forward to. Locks stay as they are.
 */
export function PaletteApp({ initialPalette }: { initialPalette: Palette }) {
  const [history, dispatch] = useReducer(historyReducer, { past: [], present: initialPalette, future: [] });
  const palette = history.present;
  const [locked, setLocked] = useState(() => initialPalette.map(() => false));
  const [type, setType] = useState<PaletteTypeValue>("analogous");
  // The type the current palette was made with: until you generate, a new pick is waiting.
  const [generatedType, setGeneratedType] = useState<PaletteTypeValue>("analogous");
  const [view, setView] = useState<View>("palette");
  const [darkPreview, setDarkPreview] = useState(false);
  const mac = useSyncExternalStore(noSubscription, isMac, () => false);
  const toast = useToast();
  const id = useId();
  const tabs = useRef<Partial<Record<View, HTMLButtonElement | null>>>({});
  const types = useRef<(HTMLButtonElement | null)[]>([]);

  const generate = useCallback(() => {
    if (locked.every(Boolean)) {
      toast.show(toastMessages.allLocked());
      return;
    }
    dispatch({ type: "set", palette: generatePalette(type, palette, locked) });
    setGeneratedType(type);
  }, [locked, palette, toast, type]);

  // Space to generate; Ctrl/Cmd+Z to undo, Ctrl/Cmd+Shift+Z or Ctrl+Y to redo.
  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      const command = event.ctrlKey || event.metaKey;
      if (command && !event.altKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? "redo" : "undo" });
      } else if (command && !event.altKey && event.key.toLowerCase() === "y") {
        event.preventDefault();
        dispatch({ type: "redo" });
      } else if (event.key === " " && !command && !event.altKey && !event.shiftKey && !target?.closest(INTERACTIVE)) {
        event.preventDefault(); // Don't scroll the page.
        if (!event.repeat) generate();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generate]);

  // Tabs: Left / Right (and Home / End) move between them and show their panel.
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = views.findIndex((v) => v.value === view);
    const next = {
      ArrowRight: (index + 1) % views.length,
      ArrowLeft: (index + views.length - 1) % views.length,
      Home: 0,
      End: views.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setView(views[next].value);
    tabs.current[views[next].value]?.focus();
  }

  // Palette types: a radio group, so the arrow keys move the choice (wrapping round).
  function onTypeKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = paletteTypes.findIndex((t) => t.value === type);
    const next = (index + step + paletteTypes.length) % paletteTypes.length;
    setType(paletteTypes[next].value);
    types.current[next]?.focus();
  }

  const description = paletteTypes.find((t) => t.value === type)?.description;
  // The type under the mouse, previewed in the caption (not the chosen one: that's already there).
  const [hoveredType, setHoveredType] = useState<PaletteTypeValue | null>(null);
  const preview = hoveredType && hoveredType !== type ? paletteTypes.find((t) => t.value === hoveredType) : undefined;
  // A type was picked but the palette was made with another: Generate will use it.
  const waiting = type !== generatedType;

  return (
    <div
      className={[
        "flex h-dvh min-h-[40rem] flex-col gap-paintbox-150 bg-background px-paintbox-150 pt-paintbox-250 pb-paintbox-150",
        "md:gap-paintbox-200 md:px-paintbox-400 lg:gap-paintbox-300 lg:px-paintbox-600 lg:py-paintbox-400",
      ].join(" ")}
    >
      {/* Phones: the logo and actions, then the tabs on their own row. */}
      <header className="flex flex-wrap items-center gap-x-paintbox-100 gap-y-paintbox-150 md:flex-nowrap md:gap-paintbox-300">
        <div className="flex flex-1 items-center">
          <PaintboxLogo palette={palette} />
        </div>

        {/* The tabs, and in Preview the moon 8px after them; it hangs outside so the tabs stay centred.
            Phones: the wrapper steps aside (contents), so the moon joins the top row, 8px before
            Undo, and the tabs take the row below. */}
        <div className="relative flex items-center gap-paintbox-100 max-md:contents">
          <div role="tablist" aria-label="View" className="flex gap-paintbox-050 max-md:order-last max-md:w-full">
            {views.map(({ value, label, Icon }) => (
              <Tab
                key={value}
                ref={(element) => {
                  tabs.current[value] = element;
                }}
                id={`${id}-${value}-tab`}
                aria-controls={`${id}-${value}-panel`}
                tabIndex={view === value ? 0 : -1}
                icon={<Icon />}
                selected={view === value}
                onClick={() => setView(value)}
                onKeyDown={onTabKeyDown}
                // 111px each, as in the design, with the content centred; phones share the width.
                className="justify-center max-md:grow max-md:basis-0 md:w-[6.9375rem]"
              >
                {label}
              </Tab>
            ))}
          </div>
          {view === "preview" ? (
            // Its name in a tooltip 8px to its right on hover, as in the design.
            <Tooltip label="Dark preview" side="right" className="md:absolute md:left-full md:ml-paintbox-100">
              <IconButton
                icon={<IconMoon />}
                label="Dark preview"
                pressed={darkPreview}
                onClick={() => setDarkPreview((on) => !on)}
              />
            </Tooltip>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-paintbox-100 md:flex-1">
          <div className="flex gap-paintbox-050">
            <Tooltip label="Undo" shortcut={mac ? "⌘Z" : "Ctrl Z"}>
              <IconButton
                icon={<IconUndo />}
                label="Undo"
                aria-keyshortcuts="Control+Z Meta+Z"
                disabled={history.past.length === 0}
                onClick={() => dispatch({ type: "undo" })}
              />
            </Tooltip>
            <Tooltip label="Redo" shortcut={mac ? "⇧⌘Z" : "Ctrl Shift Z"}>
              <IconButton
                icon={<IconRedo />}
                label="Redo"
                aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"
                disabled={history.future.length === 0}
                onClick={() => dispatch({ type: "redo" })}
              />
            </Tooltip>
          </div>
          {/* Below 64rem: just the icon, 40px round; the label stays for screen readers. */}
          <CopyPaletteButton
            palette={palette}
            className="max-lg:size-paintbox-500 max-lg:justify-center max-lg:px-0 max-lg:[&>span]:sr-only"
          />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-paintbox-150 md:gap-paintbox-200 lg:gap-paintbox-300">
        <div
          role="tabpanel"
          id={`${id}-palette-panel`}
          aria-labelledby={`${id}-palette-tab`}
          hidden={view !== "palette"}
          className="flex min-h-0 flex-1 flex-col gap-paintbox-100 md:gap-paintbox-150 lg:grid lg:grid-cols-5"
        >
          {palette.map((hex, i) => (
            <Swatch
              // By position: the slot stays as its colour changes.
              key={i}
              hex={hex}
              layout="adaptive"
              className="min-h-0 flex-1"
              locked={locked[i]}
              onLockedChange={(value) => setLocked((current) => current.map((v, j) => (j === i ? value : v)))}
            />
          ))}
        </div>

        <div
          role="tabpanel"
          id={`${id}-preview-panel`}
          aria-labelledby={`${id}-preview-tab`}
          hidden={view !== "preview"}
          className="flex min-h-0 flex-1 flex-col gap-paintbox-150 md:gap-paintbox-200 lg:gap-paintbox-300"
        >
          {/* The colours as a strip, one per breakpoint (only one shows), each with its role below. */}
          {(
            [
              // Desktop: Strip (small hex, round Lock), the role name under it.
              {
                show: "hidden lg:grid lg:gap-x-paintbox-150",
                layout: "strip",
                swatch: "h-paintbox-800",
                hex: false,
                variant: "inline",
                // 8px above and at the sides, as the design's 4 + 4 above.
                role: "px-paintbox-100 pt-paintbox-100",
              },
              // Tablet: Strip Icon (just Lock), the role and its hex under it.
              {
                show: "hidden md:grid md:gap-x-paintbox-150 lg:hidden",
                layout: "strip-icon",
                swatch: "h-paintbox-800",
                hex: true,
                variant: "inline",
                // Centred under the swatch, 8px down; 3px below for the hex's 24px button: 28px in all.
                role: "w-full justify-center pt-paintbox-100 pb-[0.1875rem]",
              },
              // Phone: Strip Compact (the whole swatch is Lock), the role name centred under it.
              {
                show: "grid gap-x-paintbox-100 md:hidden",
                layout: "strip-compact",
                swatch: "h-[3.5rem]",
                hex: false,
                variant: "centered",
                // 4px more above the label's own 4: 8 + the 17px line, 25px as in the design.
                role: "mt-paintbox-050",
              },
            ] as const
          ).map(({ show, layout, swatch, hex, variant, role }) => (
            <ul key={layout} className={["grid-cols-5", show].join(" ")}>
              {palette.map((colour, i) => (
                <li key={i} className="flex min-w-0 flex-col">
                  <Swatch
                    hex={colour}
                    layout={layout}
                    locked={locked[i]}
                    onLockedChange={(value) => setLocked((current) => current.map((v, j) => (j === i ? value : v)))}
                    className={swatch}
                  />
                  <RoleLabel
                    name={roleNames[i]}
                    hex={hex ? colour : undefined}
                    variant={variant}
                    className={role}
                  />
                </li>
              ))}
            </ul>
          ))}

          {/* The sample page scrolls in its box; the edge is drawn over it, so the page can't cover it.
              No scrollbar, as in the design: the page keeps the box's full width and scrolls with
              the wheel, trackpad or touch, or the keyboard once the box has focus. */}
          <div className="relative min-h-0 flex-1">
            <div
              tabIndex={0}
              aria-label="Sample page"
              className={[
                "h-full overflow-y-auto rounded-paintbox-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
              ].join(" ")}
            >
              <SamplePage
                embedded
                dark={darkPreview}
                roles={{ lightest: palette[0], light: palette[1], mid: palette[2], dark: palette[3], darkest: palette[4] }}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-paintbox-12 border-2 border-swatch-edge"
            />
          </div>
        </div>

        {/* Phone: the Palette type button and Generate. Tablet: types across the top, then the
            description and Generate. Desktop: one row on the five columns. */}
        <div className="grid grid-cols-[1fr_auto] items-center gap-paintbox-100 py-paintbox-100 lg:grid-cols-5 lg:gap-paintbox-150 lg:py-0">
          <div
            role="radiogroup"
            aria-label="Palette type"
            aria-describedby={`${id}-type-description`}
            onKeyDown={onTypeKeyDown}
            className="col-span-2 flex gap-paintbox-050 max-md:hidden"
          >
            {paletteTypes.map((option, i) => (
              <PaletteTypeButton
                key={option.value}
                ref={(element) => {
                  types.current[i] = element;
                }}
                icon={option.icon}
                selected={option.value === type}
                tabIndex={option.value === type ? 0 : -1}
                onClick={() => setType(option.value)}
                // Mouse only, so a tap on a touch screen doesn't leave a preview behind.
                onPointerEnter={(event) => event.pointerType === "mouse" && setHoveredType(option.value)}
                onPointerLeave={() => setHoveredType(null)}
                // Tablet: the Cell look, five equal cells with 24px icons.
                className="max-lg:grow max-lg:basis-0 max-lg:[&>svg]:size-paintbox-300"
              >
                {option.name}
              </PaletteTypeButton>
            ))}
          </div>
          <PaletteTypePicker
            selected={type}
            onSelect={setType}
            waiting={waiting}
            className="md:hidden"
          />
          {/* The caption. Waiting (a type picked, not generated yet): a green "Press Generate to use
              it" above the description. It's the radio group's description, so it's read with it. */}
          {/* Hovering another type previews it: its name (bold, muted) above its description. */}
          <p id={`${id}-type-description`} className="flex flex-col max-md:hidden lg:col-span-2">
            {preview ? (
              <span className="text-preset-8-bold text-text-muted lg:text-preset-7-bold">{preview.name}</span>
            ) : waiting ? (
              <span className="text-preset-8-bold text-pending">Press Generate to use it</span>
            ) : null}
            <span className="text-preset-8 text-text-muted lg:text-preset-7">{preview ? preview.description : description}</span>
          </p>
          {/* Tablet: Medium, padding 20, without the Space badge (the key still works). */}
          <GenerateButton
            shortcut="Space"
            onClick={generate}
            className="justify-center max-lg:px-paintbox-250 max-lg:[&>kbd]:hidden lg:w-full"
          />
        </div>
      </main>
    </div>
  );
}
