import { Fragment, type ComponentProps, type ReactNode } from "react";
import { Button } from "../../components/button";
import { CopyOption } from "../../components/copy-option";
import { CopyPaletteMenu } from "../../components/copy-palette-menu";
import { GenerateButton } from "../../components/generate-button";
import { IconModeAnalogous } from "../../components/mode-icons";
import { PaletteTypeButton } from "../../components/palette-type-button";
import { PaletteTypeMenu } from "../../components/palette-type-menu";
import { PaletteTypeTrigger } from "../../components/palette-type-trigger";
import { IconButton } from "../../components/icon-button";
import { CopyHex } from "../../components/copy-hex";
import { LockButton } from "../../components/lock-button";
import { RoleLabel } from "../../components/role-label";
import { LockButtonDemo } from "./lock-button-demo";
import { IconCopyAll, IconMoon, IconPalette, IconRedo, IconUndo } from "../../components/icons";
import { Tab } from "../../components/tab";
import { ButtonMenuDemo } from "./button-demo";
import { copyFormats } from "./copy-formats";
import { CopyMenuDemo } from "./copy-option-demo";
import { IconButtonToggleDemo } from "./icon-button-demo";
import { PaletteTypeGroupDemo } from "./palette-type-demo";
import { PaletteTypeMenuDemo } from "./palette-type-menu-demo";
import { paletteTypes } from "./palette-types";
import { Code, Group, Meta, Section } from "./section";
import { TabDemo } from "./tab-demo";

/** A labelled demo cell. */
function Demo({ label, note, children }: { label: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-paintbox-150">
      <div className="flex min-h-paintbox-1000 flex-wrap items-center gap-x-paintbox-300 gap-y-paintbox-200 rounded-paintbox-16 border border-divider bg-surface p-paintbox-300">
        {children}
      </div>
      <div className="flex flex-col gap-paintbox-050">
        <p className="text-preset-8-bold">{label}</p>
        {note ? <Meta>{note}</Meta> : null}
      </div>
    </div>
  );
}

/** A palette colour behind a sample, for components that sit on a swatch. */
function SwatchSample({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className="flex items-center rounded-paintbox-12 p-paintbox-300" style={{ backgroundColor: color }}>
      {children}
    </div>
  );
}

/** Every trigger state (columns) with waiting off and on (rows), as in the design. */
function TriggerStateGrid({ size }: { size: "default" | "compact" }) {
  const states = ["Default", "Hover", "Focus", "Open"] as const;
  // Forced looks for the static grid. Hover only recolours the label when it isn't waiting.
  const forced = (state: (typeof states)[number], waiting: boolean): Partial<ComponentProps<typeof PaletteTypeTrigger>> =>
    ({
      Default: {},
      Hover: { className: waiting ? "bg-divider!" : "bg-divider! [&>span>span:first-child]:text-text" },
      Focus: { className: "outline-3 outline-offset-2 outline-focus" },
      Open: { "aria-expanded": true },
    })[state];

  return (
    <div className="max-w-full overflow-x-auto p-paintbox-100">
      <div className="grid w-max grid-cols-[auto_repeat(4,auto)] items-center gap-x-paintbox-400 gap-y-paintbox-300">
        <span />
        {states.map((state) => (
          <p key={state} className="text-preset-9 text-text-muted">
            {state}
          </p>
        ))}
        {[false, true].map((waiting) => (
          <Fragment key={String(waiting)}>
            <p className="text-preset-9 text-text-muted">Waiting {waiting ? "on" : "off"}</p>
            {states.map((state) => (
              <PaletteTypeTrigger key={state} size={size} waiting={waiting} icon={<IconModeAnalogous />} {...forced(state, waiting)}>
                Analogous
              </PaletteTypeTrigger>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/** One state, shown in the default and compact sizes side by side. */
function StatePair({ state, ...tabProps }: { state: string } & Omit<ComponentProps<typeof Tab>, "size">) {
  return (
    <>
      {(["default", "compact"] as const).map((size) => (
        <div key={size} role="tablist" aria-label={`${state} state example (${size})`}>
          <Tab icon={<IconPalette />} size={size} {...tabProps}>
            Palette
          </Tab>
        </div>
      ))}
    </>
  );
}

export function ComponentsSection() {
  return (
    <Section
      id="components"
      title="Components"
      description="Components from app/components, rendered with the real code."
    >
      <Group title="Tab">
        <p className="text-preset-8 text-text-muted">
          One tab in the Palette / Preview switcher. Use inside an element with{" "}
          <Code>role=&quot;tablist&quot;</Code>. Height 40, gap 8, pill shape, Text Preset 8 (Bold).
          Width hugs the label.
        </p>
        <ul className="flex flex-col gap-paintbox-050 text-preset-8 text-text-muted">
          <li>
            <Code>size=&quot;default&quot;</Code>: padding-inline 16, &quot;Palette&quot; is 105px wide.
          </li>
          <li>
            <Code>size=&quot;compact&quot;</Code>: padding-inline 12, &quot;Palette&quot; is 97px wide.
          </li>
        </ul>
        <Meta>Each example below shows default (left) and compact (right).</Meta>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Live" note="Click to select, hover for the hover state, press Tab for the focus ring.">
            <TabDemo />
            <TabDemo size="compact" />
          </Demo>

          <Demo label="Default" note="No border, no background.">
            <StatePair state="Default" />
          </Demo>

          <Demo label="Hover" note="2px inset ring, divider color. Shown forced on here.">
            <StatePair state="Hover" className="inset-ring-2 inset-ring-divider" />
          </Demo>

          <Demo label="Selected" note="surface-alt background, 2px inset ring in text-muted.">
            <StatePair state="Selected" selected />
          </Demo>

          <Demo label="Focus" note="Keyboard only. 3px outline in focus, 2px offset. Shown forced on here.">
            <StatePair state="Focus" selected className="outline-3 outline-offset-2 outline-focus" />
          </Demo>
        </div>
      </Group>

      <Group title="Icon button">
        <p className="text-preset-8 text-text-muted">
          Icon-only header button: 40×40 circle, 20px icon. Always pass a <Code>label</Code> (its
          accessible name). Pass <Code>pressed</Code> only for toggles such as the theme switch.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Live" note="Click the moon to toggle pressed on/off, hover for the hover state, press Tab for the focus ring.">
            <IconButton icon={<IconUndo />} label="Undo (live example)" />
            <IconButton icon={<IconRedo />} label="Redo (live example)" />
            <IconButtonToggleDemo />
          </Demo>

          <Demo label="Default (pressed off)" note="No border, no background, text color icon.">
            <IconButton icon={<IconUndo />} label="Undo" />
            <IconButton icon={<IconRedo />} label="Redo" />
            <IconButton icon={<IconMoon />} label="Dark mode" pressed={false} />
          </Demo>

          <Demo label="Hover" note="surface-alt background (#ECEFEC light). Shown forced on here; hover the Default ones for the real thing.">
            <IconButton icon={<IconUndo />} label="Undo (hover example)" className="bg-surface-alt" />
            <IconButton icon={<IconRedo />} label="Redo (hover example)" className="bg-surface-alt" />
            <IconButton icon={<IconMoon />} label="Dark mode (hover example)" pressed={false} className="bg-surface-alt" />
          </Demo>

          <Demo label="Disabled (pressed off)" note="Icon at 40% opacity, normal cursor, no hover fill.">
            <IconButton icon={<IconUndo />} label="Undo" disabled />
            <IconButton icon={<IconRedo />} label="Redo" disabled />
            <IconButton icon={<IconMoon />} label="Dark mode" pressed={false} disabled />
          </Demo>

          <Demo label="Focus (pressed off)" note="Keyboard only. 3px outline in focus, 2px offset. Shown forced on here; press Tab on the Default ones for the real thing.">
            <IconButton icon={<IconUndo />} label="Undo (focus example)" className="outline-3 outline-offset-2 outline-focus" />
            <IconButton icon={<IconRedo />} label="Redo (focus example)" className="outline-3 outline-offset-2 outline-focus" />
            <IconButton icon={<IconMoon />} label="Dark mode (focus example)" pressed={false} className="outline-3 outline-offset-2 outline-focus" />
          </Demo>

          <Demo label="Pressed on" note="surface-alt background, 2px inset ring in text-muted. Hovering it looks the same.">
            <IconButton icon={<IconMoon />} label="Dark mode (pressed example)" pressed />
          </Demo>

          <Demo label="Disabled (pressed on)" note="Background and ring stay; the icon drops to 40%.">
            <IconButton icon={<IconMoon />} label="Dark mode (disabled pressed example)" pressed disabled />
          </Demo>

          <Demo label="Focus (pressed on)" note="Focus ring outside the pressed ring, 2px gap between them. Shown forced on here.">
            <IconButton
              icon={<IconMoon />}
              label="Dark mode (focus pressed example)"
              pressed
              className="outline-3 outline-offset-2 outline-focus"
            />
          </Demo>
        </div>

        <Meta>
          Only toggles (such as the theme switch) use <Code>pressed</Code>. Undo and Redo are plain
          actions, so they never show the pressed look.
        </Meta>
      </Group>

      <Group title="Button">
        <p className="text-preset-8 text-text-muted">
          Labelled header button: icon + text. Height 40, padding-inline 12, gap 8, pill shape, Text
          Preset 8 (Bold). Width hugs the label: &quot;Copy palette&quot; is 133px wide.
        </p>

        <ul className="flex flex-col gap-paintbox-050 text-preset-8 text-text-muted">
          <li>
            Opens a menu (Copy palette): pass <Code>aria-haspopup=&quot;menu&quot;</Code> and{" "}
            <Code>aria-expanded</Code>. Expanded shows the pressed-on look.
          </li>
          <li>
            Toggle: pass <Code>pressed</Code> (sets <Code>aria-pressed</Code>). Same look.
          </li>
        </ul>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Live" note="Click to open/close (pressed on/off), hover for the hover state. There's no real menu yet.">
            <ButtonMenuDemo />
          </Demo>

          <Demo label="Default" note="No border, no background, text color icon and label.">
            <Button icon={<IconCopyAll />}>Copy palette</Button>
          </Demo>

          <Demo label="Hover" note="surface-alt background (#ECEFEC light), no border. Shown forced on here; hover the Default one for the real thing.">
            <Button icon={<IconCopyAll />} className="bg-surface-alt">
              Copy palette
            </Button>
          </Demo>

          <Demo label="Pressed on" note="Menu open (aria-expanded). surface-alt background, 2px inset ring in text-muted. Hovering it looks the same.">
            <Button icon={<IconCopyAll />} aria-haspopup="menu" aria-expanded>
              Copy palette
            </Button>
          </Demo>

          <Demo label="Focus (pressed off)" note="Keyboard only. 3px outline in focus, 2px offset. Shown forced on here; press Tab on the Live one for the real thing.">
            <Button icon={<IconCopyAll />} className="outline-3 outline-offset-2 outline-focus">
              Copy palette
            </Button>
          </Demo>

          <Demo label="Focus (pressed on)" note="Focus ring outside the pressed ring, 2px gap between them. Shown forced on here.">
            <Button
              icon={<IconCopyAll />}
              aria-haspopup="menu"
              aria-expanded
              className="outline-3 outline-offset-2 outline-focus"
            >
              Copy palette
            </Button>
          </Demo>
        </div>

        <Meta>Disabled state: not built yet.</Meta>
      </Group>

      <Group title="Generate button">
        <p className="text-preset-8 text-text-muted">
          The main action. Height 48, padding-inline 32, gap 8, pill shape, Text Preset 7 (Bold).
          Background in <Code>text</Code>, content in <Code>surface</Code>, so it inverts in dark
          mode. Pass <Code>shortcut=&quot;Space&quot;</Code> to show the key badge (about 230px
          wide); the page has to handle the key itself.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default" note="With the Space badge, and without it.">
            <GenerateButton shortcut="Space" />
            <GenerateButton />
          </Demo>

          <Demo label="Hover" note="2px ring in the button color, 2px outside it. Shown forced on here; hover the Default ones for the real thing.">
            <GenerateButton shortcut="Space" className="outline-2 outline-offset-2 outline-text" />
            <GenerateButton className="outline-2 outline-offset-2 outline-text" />
          </Demo>

          <Demo label="Focus" note="Keyboard only. 3px outline in focus, 2px offset; replaces the hover ring. Shown forced on here; press Tab on the Default ones for the real thing.">
            <GenerateButton shortcut="Space" className="outline-3 outline-offset-2 outline-focus" />
            <GenerateButton className="outline-3 outline-offset-2 outline-focus" />
          </Demo>

          <Demo label="Pressed" note="While held down: 4px inset ring in text-muted, with the hover ring outside. Shown forced on here; press and hold the Default ones for the real thing.">
            <GenerateButton
              shortcut="Space"
              className="outline-2 outline-offset-2 outline-text inset-ring-4 inset-ring-text-muted"
            />
            <GenerateButton className="outline-2 outline-offset-2 outline-text inset-ring-4 inset-ring-text-muted" />
          </Demo>
        </div>

        <Meta>Disabled state: not built yet.</Meta>
      </Group>

      <Group title="Palette type button">
        <p className="text-preset-8 text-text-muted">
          One option in the palette type picker. Labelled variant: 32px mode icon above a Text Preset
          9 label, padding 8 / 12, gap 4, radius 16. &quot;Analogous&quot; is 90×69. Mode icons keep
          their own colors (<Code>app/components/mode-icons.tsx</Code>).
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default (labelled)" note="No border, no background.">
            <div role="radiogroup" aria-label="Default state example">
              <PaletteTypeButton icon={<IconModeAnalogous />}>Analogous</PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Hover (labelled)" note="2px inset ring in divider, no background. Shown forced on here; hover the others for the real thing.">
            <div role="radiogroup" aria-label="Hover state example">
              <PaletteTypeButton icon={<IconModeAnalogous />} className="inset-ring-2 inset-ring-divider">
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Selected (labelled)" note="surface-alt background, 2px inset ring in text-muted. aria-checked=&quot;true&quot;; hover doesn't change it.">
            <div role="radiogroup" aria-label="Selected state example">
              <PaletteTypeButton icon={<IconModeAnalogous />} selected>
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Focus (labelled)" note="3px outline in focus, 2px outside, on the selected option. Shown forced on here; Tab into the live group below for the real thing.">
            <div role="radiogroup" aria-label="Focus state example">
              <PaletteTypeButton icon={<IconModeAnalogous />} selected className="outline-3 outline-offset-2 outline-focus">
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>
        </div>

        <Demo label="All palette types (live)" note="A working radio group: click to select, or Tab in and use the arrow keys.">
          <PaletteTypeGroupDemo />
        </Demo>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default (cell)" note="variant=&quot;cell&quot;: fixed 138px wide, 24px icon, 138×61.">
            <div role="radiogroup" aria-label="Cell default state example">
              <PaletteTypeButton variant="cell" icon={<IconModeAnalogous />}>
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Hover (cell)" note="Same as labelled: 2px inset ring in divider. Shown forced on here.">
            <div role="radiogroup" aria-label="Cell hover state example">
              <PaletteTypeButton variant="cell" icon={<IconModeAnalogous />} className="inset-ring-2 inset-ring-divider">
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Selected (cell)" note="Same as labelled: surface-alt background, 2px inset ring in text-muted.">
            <div role="radiogroup" aria-label="Cell selected state example">
              <PaletteTypeButton variant="cell" icon={<IconModeAnalogous />} selected>
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Focus (cell)" note="Same as labelled: 3px outline in focus, 2px outside, on the selected option. Shown forced on here.">
            <div role="radiogroup" aria-label="Cell focus state example">
              <PaletteTypeButton variant="cell" icon={<IconModeAnalogous />} selected className="outline-3 outline-offset-2 outline-focus">
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>
        </div>

        <Demo label="All palette types, cells (live)" note="A working radio group of cells: click to select, or Tab in and use the arrow keys.">
          <PaletteTypeGroupDemo variant="cell" />
        </Demo>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default (row)" note="variant=&quot;row&quot;: fills its container (335px here, as in the design), 24px icon, title and description, 61px tall.">
            <div role="radiogroup" aria-label="Row default state example" className="w-[20.9375rem] max-w-full">
              <PaletteTypeButton variant="row" icon={<IconModeAnalogous />} description="Calm colours that sit side by side">
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Hover (row)" note="Same as the other variants: 2px inset ring in divider, no background, following the 12px corners. Shown forced on here; hover the default row for the real thing.">
            <div role="radiogroup" aria-label="Row hover state example" className="w-[20.9375rem] max-w-full">
              <PaletteTypeButton
                variant="row"
                icon={<IconModeAnalogous />}
                description="Calm colours that sit side by side"
                className="inset-ring-2 inset-ring-divider"
              >
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Selected (row)" note="surface-alt background, 2px inset ring in text-muted, plus a 20px checkmark at the right, lined up with the title.">
            <div role="radiogroup" aria-label="Row selected state example" className="w-[20.9375rem] max-w-full">
              <PaletteTypeButton variant="row" icon={<IconModeAnalogous />} description="Calm colours that sit side by side" selected>
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Focus (row)" note="Same as the other variants: 3px outline in focus, 2px outside, on the selected option (so the checkmark shows). Shown forced on here; Tab into the live rows for the real thing.">
            <div role="radiogroup" aria-label="Row focus state example" className="w-[20.9375rem] max-w-full">
              <PaletteTypeButton
                variant="row"
                icon={<IconModeAnalogous />}
                description="Calm colours that sit side by side"
                selected
                className="outline-3 outline-offset-2 outline-focus"
              >
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>
        </div>

        <Demo label="All palette types, rows (live)" note="A working radio group of rows, in as many 335px columns as fit: click to select, or Tab in and use the arrow keys. Only Analogous's description is from the design; the others are placeholders.">
          <PaletteTypeGroupDemo variant="row" />
        </Demo>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default (compact row)" note="variant=&quot;row&quot; size=&quot;compact&quot;: 4px top/bottom padding instead of 8, so 53px tall. Hover, selected and focus are the same as the row.">
            <div role="radiogroup" aria-label="Compact row default state example" className="w-[20.9375rem] max-w-full">
              <PaletteTypeButton variant="row" size="compact" icon={<IconModeAnalogous />} description="Calm colours that sit side by side">
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>

          <Demo label="Selected (compact row)" note="The checkmark still lines up with the title.">
            <div role="radiogroup" aria-label="Compact row selected state example" className="w-[20.9375rem] max-w-full">
              <PaletteTypeButton variant="row" size="compact" icon={<IconModeAnalogous />} description="Calm colours that sit side by side" selected>
                Analogous
              </PaletteTypeButton>
            </div>
          </Demo>
        </div>

        <Demo label="All palette types, compact rows (live)" note="A working radio group of compact rows: click to select, or Tab in and use the arrow keys.">
          <PaletteTypeGroupDemo variant="row" size="compact" />
        </Demo>

      </Group>

      <Group title="Copy option">
        <p className="text-preset-8 text-text-muted">
          One format in the &quot;Copy palette&quot; menu: the format&apos;s name (Text Preset 7 Bold) above a
          sample of the output (Text Preset 8, text-muted). 256px wide, padding 8 / 12, radius 12, 61px tall.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default" note="No border, no background.">
            <div role="menu" aria-label="Copy option default state example">
              <CopyOption preview="--color-1: #EEE8DF;">CSS variables</CopyOption>
            </div>
          </Demo>

          <Demo label="Hover" note="surface-alt background, no border. Shown forced on here; hover the default for the real thing.">
            <div role="menu" aria-label="Copy option hover state example">
              <CopyOption preview="--color-1: #EEE8DF;" className="bg-surface-alt">
                CSS variables
              </CopyOption>
            </div>
          </Demo>

          <Demo label="Selected" note="20px checkmark at the right, lined up with the name; no background. aria-checked=&quot;true&quot;.">
            <div role="menu" aria-label="Copy option selected state example">
              <CopyOption preview="--color-1: #EEE8DF;" selected>
                CSS variables
              </CopyOption>
            </div>
          </Demo>

          <Demo label="Focus" note="3px outline in focus, 2px outside, on an option that isn't selected (as in the design). Shown forced on here; Tab into the live menu for the real thing.">
            <div role="menu" aria-label="Copy option focus state example">
              <CopyOption preview="--color-1: #EEE8DF;" className="outline-3 outline-offset-2 outline-focus">
                CSS variables
              </CopyOption>
            </div>
          </Demo>
        </div>

        <Meta>For a working menu of copy options, see Copy palette menu below.</Meta>
      </Group>

      <Group title="Copy palette menu">
        <p className="text-preset-8 text-text-muted">
          What the &quot;Copy palette&quot; button opens: a Text Preset 9 heading above one copy option per
          format. Default: 272×254 with three formats, 1px divider border, padding 8 (12 at the bottom), radius
          20, large shadow. Sheet (<Code>variant=&quot;sheet&quot;</Code>): 272×295, 72px options, radius 16. Landscape
          (<Code>variant=&quot;landscape&quot;</Code>): the sheet at 459×295.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default" note="Three formats, none checked. The Hex codes sample is cut off with &quot;…&quot;.">
            <CopyPaletteMenu heading="Copy all five colours as" formats={copyFormats} />
          </Demo>

          <Demo label="Sheet" note="12px above the heading, 72px options with their text centred, 16px at the bottom, radius 16.">
            <CopyPaletteMenu variant="sheet" heading="Copy all five colours as" formats={copyFormats} />
          </Demo>

          <Demo label="Live (default)" note="Click a format to check it, or Tab in and use the arrow keys, Home/End and Enter. Doesn't copy anything.">
            <CopyMenuDemo />
          </Demo>

          <Demo label="Live (sheet)" note="The same, as a sheet. The check stays level with the name in the taller options.">
            <CopyMenuDemo variant="sheet" />
          </Demo>
        </div>

        <div className="grid grid-cols-1 gap-paintbox-300 xl:grid-cols-2">
          <Demo label="Landscape" note="The sheet at 459px wide, for a phone on its side. All five hex codes fit.">
            <CopyPaletteMenu variant="landscape" heading="Copy all five colours as" formats={copyFormats} className="max-w-full" />
          </Demo>

          <Demo label="Live (landscape)" note="The same, working.">
            <CopyMenuDemo variant="landscape" className="max-w-full" />
          </Demo>
        </div>
      </Group>

      <Group title="Palette type trigger">
        <p className="text-preset-8 text-text-muted">
          The button that opens the palette type menu, showing the current type. 236×48 (compact 176×48),
          pill shape, surface-alt background, padding 16 left / 12 right. 24px mode icon, gap 8, &quot;Palette
          type&quot; (Text Preset 9, text-muted) above the type&apos;s name (Text Preset 8 Bold), 20px
          chevron at the right.
        </p>

        <Demo label="Default size" note="236×48. Hover and Focus are forced on here; hover or Tab to the Default ones for the real thing.">
          <TriggerStateGrid size="default" />
        </Demo>

        <Demo label="Compact size" note="size=&quot;compact&quot;: 176×48, padding 12 left / 8 right, gap 4. Same states.">
          <TriggerStateGrid size="compact" />
        </Demo>

        <ul className="flex list-disc flex-col gap-paintbox-050 pl-paintbox-250 text-preset-8 text-text-muted">
          <li>Hover: divider background (#DDE1DD light); the &quot;Palette type&quot; label turns to the text color, &quot;Tap Generate&quot; stays green.</li>
          <li>Focus (keyboard only): 3px outline in focus, 2px offset; fill and label as in Default.</li>
          <li>Open (aria-expanded, menu showing): 2px inset ring in text-muted; hovering it looks the same.</li>
          <li>Waiting on (after picking a type, before generating): &quot;Tap Generate&quot; in the pending token (#1E7A3E light) replaces &quot;Palette type&quot;.</li>
        </ul>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Focus (open)" note="Focus ring outside the open ring, 2px gap between them. Shown forced on here.">
            <PaletteTypeTrigger icon={<IconModeAnalogous />} aria-expanded className="outline-3 outline-offset-2 outline-focus">
              Analogous
            </PaletteTypeTrigger>
          </Demo>
        </div>
      </Group>

      <Group title="Palette type menu">
        <p className="text-preset-8 text-text-muted">
          What the palette type button opens: one palette type row per type, as a radio group. One column:
          358px wide, 1px divider border, padding 8, rows 4px apart and at least 92px tall, radius 16, large
          shadow. 358×494 with five types. Landscape (<Code>variant=&quot;landscape&quot;</Code>): 459px wide
          with 52px rows, 459×294.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 xl:grid-cols-2">
          <Demo label="One column" note="Analogous selected, as in the design. Complementary and Triadic wrap to two lines.">
            <PaletteTypeMenu aria-label="Palette type, one column example" types={paletteTypes} selected="analogous" className="max-w-full" />
          </Demo>

          <Demo label="Live (one column)" note="Click a type, or Tab in and use the arrow keys, Home and End.">
            <PaletteTypeMenuDemo />
          </Demo>

          <Demo label="Landscape" note="For a phone on its side: 459px wide, 52px rows, every description on one line.">
            <PaletteTypeMenu
              variant="landscape"
              aria-label="Palette type, landscape example"
              types={paletteTypes}
              selected="analogous"
              className="max-w-full"
            />
          </Demo>

          <Demo label="Live (landscape)" note="The same, working.">
            <PaletteTypeMenuDemo variant="landscape" />
          </Demo>
        </div>
      </Group>

      <Group title="Lock button">
        <p className="text-preset-8 text-text-muted">
          Locks a colour so Generate keeps it. It sits on the colour&apos;s swatch, so its ink follows the swatch
          (<Code>swatch=&quot;light&quot;</Code>: #1B1F24, <Code>swatch=&quot;dark&quot;</Code>: white), not the page
          theme. Labelled: 40 × 121px pill, 2px border, content centred, gap 8, 20px padlock, &quot;Lock&quot; or
          &quot;Locked&quot; in Text Preset 6 Bold. A toggle (aria-pressed).
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Labelled, lock off: default (light swatch)" note="On #EEE8DF. Transparent background, so the swatch shows through.">
            <SwatchSample color="#EEE8DF">
              <LockButton />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, lock off: default (dark swatch)" note="On #561A45. Same, with white ink.">
            <SwatchSample color="#561A45">
              <LockButton swatch="dark" />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, lock off: hover (light swatch)" note="Ink at 15% (on-swatch-dark-hover) over the swatch: #CECAC3 here. Shown forced on; hover the default for the real thing.">
            <SwatchSample color="#EEE8DF">
              <LockButton className="bg-on-swatch-dark-hover" />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, lock off: hover (dark swatch)" note="White at 15% (on-swatch-light-hover) over the swatch: #6F3C61 here. Shown forced on.">
            <SwatchSample color="#561A45">
              <LockButton swatch="dark" className="bg-on-swatch-light-hover" />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, lock off: focus (light swatch)" note="Keyboard only. Dark border, 4px white, 2px dark: reads on any swatch. Shown forced on; press Tab on the default for the real thing.">
            <SwatchSample color="#EEE8DF">
              <LockButton className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, lock off: focus (dark swatch)" note="The same ring; the border turns dark too, the label and padlock stay white. Shown forced on.">
            <SwatchSample color="#561A45">
              <LockButton swatch="dark" className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, locked: default (light swatch)" note="Filled with the ink (#1B1F24), closed padlock, &quot;Locked&quot; in white. Same 121px width as Lock. Hover keeps the fill and shows the open padlock.">
            <SwatchSample color="#EEE8DF">
              <LockButton locked />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, locked: default (dark swatch)" note="Filled with white, the padlock and label in #1B1F24.">
            <SwatchSample color="#561A45">
              <LockButton swatch="dark" locked />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, locked: focus (light swatch)" note="Keyboard only. The same dark / white / dark ring; the dark border blends into the fill. Shown forced on.">
            <SwatchSample color="#EEE8DF">
              <LockButton locked className="outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
            </SwatchSample>
          </Demo>

          <Demo label="Labelled, locked: focus (dark swatch)" note="The same ring; the white pill gets a dark border. Shown forced on; Tab to the live example and lock it for the real thing.">
            <SwatchSample color="#561A45">
              <LockButton swatch="dark" locked className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
            </SwatchSample>
          </Demo>

          <Demo label="Lock button (live example)" note="Click, or Tab and press Space, to lock and unlock. Hover previews the click: the padlock closes on Lock and opens on Locked.">
            <SwatchSample color="#EEE8DF">
              <LockButtonDemo aria-label="Lock colour 1" />
            </SwatchSample>
            <SwatchSample color="#561A45">
              <LockButtonDemo swatch="dark" aria-label="Lock colour 2" />
            </SwatchSample>
          </Demo>

          <Demo label="Icon: every state (light swatch)" note="variant=&quot;icon&quot;: 40px circle, 2px border, 20px padlock. Lock off, hover, focus, then locked, locked focus. Hover and focus shown forced on; the padlock swap shows on real hover.">
            <SwatchSample color="#EEE8DF">
              <div className="flex items-center gap-paintbox-300">
                <LockButton variant="icon" />
                <LockButton variant="icon" className="bg-on-swatch-dark-hover" />
                <LockButton variant="icon" className="outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
                <LockButton variant="icon" locked />
                <LockButton variant="icon" locked className="outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
              </div>
            </SwatchSample>
          </Demo>

          <Demo label="Icon: every state (dark swatch)" note="The same five, with white ink. Focus turns the border dark.">
            <SwatchSample color="#561A45">
              <div className="flex items-center gap-paintbox-300">
                <LockButton variant="icon" swatch="dark" />
                <LockButton variant="icon" swatch="dark" className="bg-on-swatch-light-hover" />
                <LockButton variant="icon" swatch="dark" className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
                <LockButton variant="icon" swatch="dark" locked />
                <LockButton variant="icon" swatch="dark" locked className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
              </div>
            </SwatchSample>
          </Demo>

          <Demo label="Icon (live example)" note="Click, or Tab and press Space, to lock and unlock. Its accessible name stays &quot;Lock colour 3&quot;; aria-pressed says whether it's locked.">
            <SwatchSample color="#EEE8DF">
              <LockButtonDemo variant="icon" aria-label="Lock colour 3" />
            </SwatchSample>
            <SwatchSample color="#561A45">
              <LockButtonDemo variant="icon" swatch="dark" aria-label="Lock colour 4" />
            </SwatchSample>
          </Demo>

          <Demo label="Icon small: every state (light swatch)" note="variant=&quot;icon-small&quot;: 20px padlock in a 64 × 56 tap area, radius 12, no border. Lock off, hover, focus, then locked (32px circle), locked focus. Hover and focus shown forced on.">
            <SwatchSample color="#EEE8DF">
              <div className="flex flex-wrap items-center gap-paintbox-200">
                <LockButton variant="icon-small" />
                <LockButton variant="icon-small" className="bg-on-swatch-dark-hover" />
                <LockButton variant="icon-small" className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
                <LockButton variant="icon-small" locked />
                <LockButton variant="icon-small" locked className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
              </div>
            </SwatchSample>
          </Demo>

          <Demo label="Icon small: every state (dark swatch)" note="The same five, with white ink: #6F3D62 hover, a white circle when locked.">
            <SwatchSample color="#561A45">
              <div className="flex flex-wrap items-center gap-paintbox-200">
                <LockButton variant="icon-small" swatch="dark" />
                <LockButton variant="icon-small" swatch="dark" className="bg-on-swatch-light-hover" />
                <LockButton variant="icon-small" swatch="dark" className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
                <LockButton variant="icon-small" swatch="dark" locked />
                <LockButton variant="icon-small" swatch="dark" locked className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
              </div>
            </SwatchSample>
          </Demo>

          <Demo label="Icon small (live example)" note="Click, or Tab and press Space, to lock and unlock. Hover tints the tap area when unlocked and only swaps the padlock when locked.">
            <SwatchSample color="#EEE8DF">
              <LockButtonDemo variant="icon-small" aria-label="Lock colour 5" />
            </SwatchSample>
            <SwatchSample color="#561A45">
              <LockButtonDemo variant="icon-small" swatch="dark" aria-label="Lock colour 6" />
            </SwatchSample>
          </Demo>
          <Demo label="Icon extra-small: every state (light swatch)" note="variant=&quot;icon-xsmall&quot;: 16px padlock in the same 64 × 56 tap area. Lock off, hover, focus, then locked (20px circle), locked focus. Hover and focus shown forced on.">
            <SwatchSample color="#EEE8DF">
              <div className="flex flex-wrap items-center gap-paintbox-200">
                <LockButton variant="icon-xsmall" />
                <LockButton variant="icon-xsmall" className="bg-on-swatch-dark-hover" />
                <LockButton variant="icon-xsmall" className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
                <LockButton variant="icon-xsmall" locked />
                <LockButton variant="icon-xsmall" locked className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
              </div>
            </SwatchSample>
          </Demo>

          <Demo label="Icon extra-small: every state (dark swatch)" note="The same five, with white ink: #6F3D62 hover, a white circle when locked.">
            <SwatchSample color="#561A45">
              <div className="flex flex-wrap items-center gap-paintbox-200">
                <LockButton variant="icon-xsmall" swatch="dark" />
                <LockButton variant="icon-xsmall" swatch="dark" className="bg-on-swatch-light-hover" />
                <LockButton variant="icon-xsmall" swatch="dark" className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
                <LockButton variant="icon-xsmall" swatch="dark" locked />
                <LockButton variant="icon-xsmall" swatch="dark" locked className="border-on-swatch-dark! outline-4 outline-offset-0 outline-on-swatch-light ring-6 ring-on-swatch-dark" />
              </div>
            </SwatchSample>
          </Demo>

          <Demo label="Icon extra-small (live example)" note="Click, or Tab and press Space, to lock and unlock. Hover tints the tap area when unlocked and only swaps the padlock when locked.">
            <SwatchSample color="#EEE8DF">
              <LockButtonDemo variant="icon-xsmall" aria-label="Lock colour 7" />
            </SwatchSample>
            <SwatchSample color="#561A45">
              <LockButtonDemo variant="icon-xsmall" swatch="dark" aria-label="Lock colour 8" />
            </SwatchSample>
          </Demo>
        </div>

        <Meta>Every LockButton variant and state is built.</Meta>
      </Group>

      <Group title="Copy hex">
        <p className="text-preset-8 text-text-muted">
          Copies a colour&apos;s hex code. It sits on the colour&apos;s swatch, so its ink follows the swatch
          (<Code>swatch=&quot;light&quot;</Code>: #1B1F24, <Code>swatch=&quot;dark&quot;</Code>: white), not the page
          theme. Large: 40px tall, padding 8, gap 4, the code in Text Preset 4, then the 20px copy icon in a 36px
          circle. Small (<Code>size=&quot;small&quot;</Code>): the same height and states, the code in Text Preset 5
          and the icon in a 28px circle, 145px wide.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Large: default (light swatch)" note="On #EEE8DF. 186px wide, no border or background.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" />
            </SwatchSample>
          </Demo>

          <Demo label="Large: default (dark swatch)" note="On #561A45. Same, with white ink.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" />
            </SwatchSample>
          </Demo>

          <Demo label="Large: hover (light swatch)" note="2px underline under the code; the icon's circle fills with the ink at 15% (#CECAC3 here). Shown forced on; hover the default for the real thing.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" className="[&>.text-preset-4]:underline [&>span:last-child]:bg-on-swatch-dark-hover" />
            </SwatchSample>
          </Demo>

          <Demo label="Large: hover (dark swatch)" note="White underline; white at 15% in the circle (#6F3C61 here). Shown forced on.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" className="[&>.text-preset-4]:underline [&>span:last-child]:bg-on-swatch-light-hover" />
            </SwatchSample>
          </Demo>

          <Demo label="Large: focus (light swatch)" note="Keyboard only. 2px dark, 3px white, 2px dark, all outside the button. Shown forced on; press Tab on the default for the real thing.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" className="ring-7 ring-on-swatch-dark outline-3 outline-offset-2 outline-on-swatch-light" />
            </SwatchSample>
          </Demo>

          <Demo label="Large: focus (dark swatch)" note="The same ring; the code and icon stay white. Shown forced on.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" className="ring-7 ring-on-swatch-dark outline-3 outline-offset-2 outline-on-swatch-light" />
            </SwatchSample>
          </Demo>

          <Demo label="Large: copied (light swatch)" note="The copy icon turns into a checkmark for 2s after a click; nothing else changes. Shown forced on (copied). Click the defaults above to copy for real.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" copied />
            </SwatchSample>
          </Demo>

          <Demo label="Large: copied (dark swatch)" note="The same, with a white checkmark.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" copied />
            </SwatchSample>
          </Demo>
        </div>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Small: default (light swatch)" note="On #EEE8DF. 145px wide: padding 8 on the left, 4 on the right.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" size="small" />
            </SwatchSample>
          </Demo>

          <Demo label="Small: default (dark swatch)" note="On #561A45. Same, with white ink.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" size="small" />
            </SwatchSample>
          </Demo>

          <Demo label="Small: hover (light swatch)" note="2px underline, 2px below the baseline; the 28px circle fills with the ink at 15%. Shown forced on.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" size="small" className="[&>.text-preset-5]:underline [&>span:last-child]:bg-on-swatch-dark-hover" />
            </SwatchSample>
          </Demo>

          <Demo label="Small: hover (dark swatch)" note="White underline; white at 15% in the circle. Shown forced on.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" size="small" className="[&>.text-preset-5]:underline [&>span:last-child]:bg-on-swatch-light-hover" />
            </SwatchSample>
          </Demo>

          <Demo label="Small: focus (light swatch)" note="The same dark / white / dark ring as the large size. Shown forced on.">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" size="small" className="ring-7 ring-on-swatch-dark outline-3 outline-offset-2 outline-on-swatch-light" />
            </SwatchSample>
          </Demo>

          <Demo label="Small: focus (dark swatch)" note="The same ring; the code and icon stay white. Shown forced on.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" size="small" className="ring-7 ring-on-swatch-dark outline-3 outline-offset-2 outline-on-swatch-light" />
            </SwatchSample>
          </Demo>

          <Demo label="Small: copied (light swatch)" note="The checkmark for 2s after a click. Shown forced on (copied).">
            <SwatchSample color="#EEE8DF">
              <CopyHex hex="#EEE8DF" size="small" copied />
            </SwatchSample>
          </Demo>

          <Demo label="Small: copied (dark swatch)" note="The same, with a white checkmark.">
            <SwatchSample color="#561A45">
              <CopyHex hex="#561A45" swatch="dark" size="small" copied />
            </SwatchSample>
          </Demo>
        </div>

        <Meta>Every CopyHex size and state is built.</Meta>
      </Group>

      <Group title="Role label">
        <p className="text-preset-8 text-text-muted">
          Names the role a colour plays in the palette. It sits on the page background, so it follows the page
          theme. Default: the role name in Text Preset 9, in <Code>text-muted</Code>. With <Code>hex</Code>, the hex code
          follows 4px after it in Text Preset 9 (Hex), in <Code>text</Code>.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 xl:grid-cols-3">
          <Demo label="Default" note="Text Preset 9: Funnel Sans Bold 13px, letter-spacing 2%, in text-muted (#545B63).">
            <RoleLabel name="Page" />
          </Demo>

          <Demo label="Hex shown" note="The hex follows 4px after the role, on the same baseline: Text Preset 9 (Hex), letter-spacing 0, in text (#1B1F24).">
            <RoleLabel name="Page" hex="#EEE8DF" />
          </Demo>
        </div>

        <Meta>The hex&apos;s hover and focus, and the dark label: not built yet.</Meta>
      </Group>
    </Section>
  );
}
