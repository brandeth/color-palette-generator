import type { ReactNode } from "react";
import { IconPalette, IconPreview } from "../../components/icons";
import { Tab } from "../../components/tab";
import { Code, Group, Meta, Section } from "./section";

/** A labelled demo cell. */
function Demo({ label, note, children }: { label: string; note?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-paintbox-150">
      <div className="flex min-h-paintbox-1000 items-center rounded-paintbox-16 border border-divider bg-surface px-paintbox-300">
        {children}
      </div>
      <div className="flex flex-col gap-paintbox-050">
        <p className="text-preset-8-bold">{label}</p>
        {note ? <Meta>{note}</Meta> : null}
      </div>
    </div>
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
          <Code>role=&quot;tablist&quot;</Code>. Height 40, padding-inline 16, gap 8, pill shape, Text
          Preset 8 (Bold). Width hugs the label.
        </p>

        <div className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2 lg:grid-cols-3">
          <Demo label="Live" note="Hover to see the real hover state.">
            <div role="tablist" aria-label="Live tab example" className="flex gap-paintbox-100">
              <Tab icon={<IconPalette />}>Palette</Tab>
              <Tab icon={<IconPreview />}>Preview</Tab>
            </div>
          </Demo>

          <Demo label="Default" note="No border, no background.">
            <div role="tablist" aria-label="Default state example">
              <Tab icon={<IconPalette />}>Palette</Tab>
            </div>
          </Demo>

          <Demo label="Hover" note="2px inset ring, divider color. Shown forced on here.">
            <div role="tablist" aria-label="Hover state example">
              <Tab icon={<IconPalette />} className="inset-ring-2 inset-ring-divider">
                Palette
              </Tab>
            </div>
          </Demo>
        </div>

        <Meta>Selected and focus states: not built yet.</Meta>
      </Group>
    </Section>
  );
}
