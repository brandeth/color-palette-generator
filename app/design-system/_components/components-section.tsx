import type { ComponentProps, ReactNode } from "react";
import { Button } from "../../components/button";
import { GenerateButton } from "../../components/generate-button";
import { IconModeAnalogous } from "../../components/mode-icons";
import { PaletteTypeButton } from "../../components/palette-type-button";
import { IconButton } from "../../components/icon-button";
import { IconCopyAll, IconMoon, IconPalette, IconRedo, IconUndo } from "../../components/icons";
import { Tab } from "../../components/tab";
import { ButtonMenuDemo } from "./button-demo";
import { IconButtonToggleDemo } from "./icon-button-demo";
import { PaletteTypeGroupDemo } from "./palette-type-demo";
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
        </div>

        <Demo label="All palette types, rows (live)" note="A working radio group of rows, in as many 335px columns as fit: click to select, or Tab in and use the arrow keys. Only Analogous's description is from the design; the others are placeholders.">
          <PaletteTypeGroupDemo variant="row" />
        </Demo>

        <Meta>Row focus state: not built yet.</Meta>
      </Group>
    </Section>
  );
}
