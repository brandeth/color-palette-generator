"use client";

import { useCallback, useEffect, useId, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { generatePalette, type Palette, type PaletteTypeValue } from "../lib/palette";
import { CopyPaletteButton } from "./copy-palette-button";
import { GenerateButton } from "./generate-button";
import { IconButton } from "./icon-button";
import { IconPalette, IconPreview, IconRedo, IconUndo } from "./icons";
import { PaintboxLogo } from "./paintbox-logo";
import { PaletteTypeButton } from "./palette-type-button";
import { paletteTypes } from "./palette-types";
import { SamplePage } from "./sample-page/sample-page";
import { Swatch } from "./swatch";
import { Tab } from "./tab";
import { toastMessages } from "./toast-messages";
import { useToast } from "./toaster";

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

// Space generates only when it isn't already pressing or typing into something.
const INTERACTIVE = "button, a, input, textarea, select, [contenteditable], [role='menu'], [role='radio'], [role='tab']";

/*
 * The palette generator (the home page), desktop layout: 1440 × 900 in
 * the design, filling the window.
 *
 * Page: background colour, padding 32 48, three rows 24px apart.
 *
 * Header (40px): the logo with the palette's dots on the left, the
 * Palette / Preview tabs in the middle (4px apart), and Undo, Redo (4px
 * apart) and Copy palette on the right, 8px apart. The left and right
 * parts share the leftover width, so the tabs stay centred.
 *
 * Colours (the rest of the height): five Swatch columns, 12px apart, each
 * with its Lock and Copy hex. Preview shows the sample page here instead,
 * filled with the palette (Page, Cards, Buttons, Footer, Text).
 *
 * Controls (69px): on the same five columns as the colours: the palette
 * types across the first two, the chosen type's description across the
 * next two, and Generate (with the Space shortcut) under the last.
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
  const [view, setView] = useState<View>("palette");
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
    const next = { ArrowRight: (index + 1) % views.length, ArrowLeft: (index + views.length - 1) % views.length, Home: 0, End: views.length - 1 }[
      event.key
    ];
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

  return (
    <div className="flex h-dvh min-h-[40rem] flex-col gap-paintbox-300 bg-background px-paintbox-600 py-paintbox-400">
      <header className="flex items-center gap-paintbox-300">
        <div className="flex flex-1 items-center">
          <PaintboxLogo palette={palette} />
        </div>

        <div role="tablist" aria-label="View" className="flex gap-paintbox-050">
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
              // 111px each, as in the design, with the content centred.
              className="w-[6.9375rem] justify-center"
            >
              {label}
            </Tab>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-paintbox-100">
          <div className="flex gap-paintbox-050">
            <IconButton
              icon={<IconUndo />}
              label="Undo"
              aria-keyshortcuts="Control+Z Meta+Z"
              disabled={history.past.length === 0}
              onClick={() => dispatch({ type: "undo" })}
            />
            <IconButton
              icon={<IconRedo />}
              label="Redo"
              aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z Control+Y"
              disabled={history.future.length === 0}
              onClick={() => dispatch({ type: "redo" })}
            />
          </div>
          <CopyPaletteButton palette={palette} />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-paintbox-300">
        <div
          role="tabpanel"
          id={`${id}-palette-panel`}
          aria-labelledby={`${id}-palette-tab`}
          hidden={view !== "palette"}
          className="grid min-h-0 flex-1 grid-cols-5 gap-paintbox-150"
        >
          {palette.map((hex, i) => (
            <Swatch
              // By position: the slot stays as its colour changes.
              key={i}
              hex={hex}
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
          tabIndex={0}
          className="min-h-0 flex-1 overflow-y-auto rounded-paintbox-12 inset-ring-2 inset-ring-swatch-edge focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <SamplePage
            embedded
            roles={{ lightest: palette[0], light: palette[1], mid: palette[2], dark: palette[3], darkest: palette[4] }}
          />
        </div>

        <div className="grid grid-cols-5 items-center gap-paintbox-150">
          <div
            role="radiogroup"
            aria-label="Palette type"
            aria-describedby={`${id}-type-description`}
            onKeyDown={onTypeKeyDown}
            className="col-span-2 flex gap-paintbox-050"
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
              >
                {option.name}
              </PaletteTypeButton>
            ))}
          </div>
          <p id={`${id}-type-description`} className="col-span-2 text-preset-7 text-text-muted">
            {description}
          </p>
          <GenerateButton shortcut="Space" onClick={generate} className="w-full justify-center" />
        </div>
      </main>
    </div>
  );
}
