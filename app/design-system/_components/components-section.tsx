import type { ComponentProps, ReactNode } from "react";
import { IconButton } from "../../components/icon-button";
import { IconMoon, IconPalette, IconRedo, IconUndo } from "../../components/icons";
import { Tab } from "../../components/tab";
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
        </div>

        <Meta>Pressed on and focus states: not built yet.</Meta>
      </Group>
    </Section>
  );
}
