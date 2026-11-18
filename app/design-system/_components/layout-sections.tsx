import { controlRadii, focusRingRadii, grids, shadows, spacingTokens, type RadiusToken } from "../_data";
import { Code, Group, Meta, Section } from "./section";

export function SpacingSection() {
  return (
    <Section
      id="spacing"
      title="Spacing"
      description={
        <>
          Works with every spacing utility: <Code>p-paintbox-200</Code>, <Code>gap-paintbox-150</Code>,{" "}
          <Code>mt-paintbox-400</Code>. Values are in rem.
        </>
      }
    >
      <ul className="flex flex-col">
        {spacingTokens.map((s) => (
          <li
            key={s.name}
            className="grid grid-cols-[7rem_3rem_1fr] items-center gap-paintbox-300 border-b border-divider py-paintbox-150 md:grid-cols-[10rem_4rem_1fr]"
          >
            <p className="text-preset-8-bold">paintbox-{s.name}</p>
            <Meta>{s.px}px</Meta>
            <div
              className="h-paintbox-200 bg-border"
              style={{ width: `var(--spacing-paintbox-${s.name})` }}
              aria-hidden
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function RadiusGrid({ items }: { items: RadiusToken[] }) {
  return (
    <ul className="grid grid-cols-2 gap-paintbox-300 md:grid-cols-3 lg:grid-cols-6">
      {items.map((r) => (
        <li key={r.name} className="flex flex-col gap-paintbox-100">
          <div
            className={`h-paintbox-1000 border border-border bg-surface-alt ${r.className}`}
            aria-hidden
          />
          <div>
            <p className="text-preset-8-bold">{r.name}</p>
            <Meta>{r.px}</Meta>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function RadiusSection() {
  return (
    <Section
      id="radius"
      title="Radius"
      description={
        <>
          Use with any rounded utility: <Code>rounded-paintbox-12</Code>, <Code>rounded-t-paintbox-16</Code>.
          Values are in px.
        </>
      }
    >
      <Group title="Controls">
        <RadiusGrid items={controlRadii} />
      </Group>
      <Group title="Focus ring">
        <Meta>Each focus ring radius is the radius of the control it surrounds, plus the ring&apos;s offset.</Meta>
        <RadiusGrid items={focusRingRadii} />
      </Group>
    </Section>
  );
}

export function EffectsSection() {
  return (
    <Section id="effects" title="Effects" description="Shadows and layout grids.">
      <Group title="Shadows">
        <ul className="grid grid-cols-1 gap-paintbox-300 md:grid-cols-2">
          {shadows.map((s) => (
            <li key={s.name} className="flex flex-col gap-paintbox-150">
              <div className="flex h-[10rem] items-center justify-center rounded-paintbox-16 bg-surface-alt">
                <div className={`h-paintbox-1000 w-1/2 rounded-paintbox-12 bg-surface ${s.className}`} aria-hidden />
              </div>
              <div className="flex flex-col gap-paintbox-050">
                <p className="text-preset-8-bold">{s.name}</p>
                <Meta>{s.spec}</Meta>
                <Meta>{s.use}</Meta>
              </div>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Grids">
        <p className="text-preset-8 text-text-muted">
          <Code>container-paintbox</Code> sets page margins and the 1504px max width (this page uses
          it). <Code>grid-paintbox</Code> sets the columns. Resize the window to see it switch.
        </p>
        <p className="text-preset-8-bold">
          Current grid:{" "}
          <span className="md:hidden paintbox-landscape:hidden">grid-mobile</span>
          <span className="hidden md:inline lg:hidden paintbox-landscape:hidden">grid-tablet</span>
          <span className="hidden lg:inline">grid-desktop</span>
          <span className="hidden paintbox-landscape:inline">grid-landscape</span>
        </p>
        <div className="grid-paintbox rounded-paintbox-12 bg-surface-alt py-paintbox-150" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="flex h-paintbox-1000 items-center justify-center rounded-paintbox-8 bg-divider text-preset-9 text-text-muted paintbox-landscape:hidden"
            >
              {i + 1}
            </div>
          ))}
          <div className="hidden h-paintbox-1000 items-center justify-center rounded-paintbox-8 bg-divider text-preset-9 text-text-muted paintbox-landscape:flex">
            colors
          </div>
          <div className="hidden h-paintbox-1000 items-center justify-center rounded-paintbox-8 bg-divider text-preset-9 text-text-muted paintbox-landscape:flex">
            rail
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-paintbox-200 md:grid-cols-2">
          {grids.map((g) => (
            <li key={g.name}>
              <p className="text-preset-8-bold">
                {g.name} <span className="text-preset-8 text-text-muted">· {g.when}</span>
              </p>
              <Meta>{g.spec}</Meta>
            </li>
          ))}
        </ul>
      </Group>
    </Section>
  );
}
