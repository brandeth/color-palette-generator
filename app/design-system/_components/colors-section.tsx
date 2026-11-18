import {
  accentPrimitives,
  neutralPrimitives,
  themeTokens,
  transparentPrimitives,
  type Primitive,
} from "../_data";
import { Code, Group, Meta, Section } from "./section";
import { Swatch, primitiveVar } from "./swatch";

function PrimitiveGrid({ items }: { items: Primitive[] }) {
  return (
    <ul className="grid grid-cols-2 gap-paintbox-300 md:grid-cols-4 lg:grid-cols-5">
      {items.map((p) => (
        <li key={p.name} className="flex flex-col gap-paintbox-100">
          <Swatch color={primitiveVar(p.name)} />
          <div>
            <p className="text-preset-8-bold">{p.name}</p>
            <Meta>{p.hex}</Meta>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ColorsSection() {
  return (
    <Section
      id="colors"
      title="Colors"
      description={
        <>
          Use theme tokens in components (<Code>bg-surface</Code>, <Code>text-text-muted</Code>).
          Primitives are the raw palette (<Code>bg-paintbox-neutral-100</Code>).
        </>
      }
    >
      <Group title="Theme tokens">
        <Meta>
          Light and dark columns show both values side by side. Use the theme switch at the top to
          see the whole page change.
        </Meta>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-divider text-preset-8-bold">
                <th scope="col" className="py-paintbox-150 pr-paintbox-300">
                  Token
                </th>
                <th scope="col" className="py-paintbox-150 pr-paintbox-300">
                  Light
                </th>
                <th scope="col" className="py-paintbox-150">
                  Dark
                </th>
              </tr>
            </thead>
            <tbody>
              {themeTokens.map((t) => (
                <tr key={t.name} className="border-b border-divider align-middle">
                  <th scope="row" className="py-paintbox-150 pr-paintbox-300 font-normal">
                    <p className="text-preset-8-bold">{t.name}</p>
                    <Meta>var(--color-{t.name})</Meta>
                  </th>
                  {[t.light, t.dark].map((primitive, i) => (
                    <td key={i} className="py-paintbox-150 pr-paintbox-300">
                      <div className="flex items-center gap-paintbox-150">
                        <Swatch color={primitiveVar(primitive)} className="h-paintbox-500 w-paintbox-1000 shrink-0" />
                        <Meta>{primitive}</Meta>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>

      <Group title="Primitives: neutral">
        <PrimitiveGrid items={neutralPrimitives} />
      </Group>

      <Group title="Primitives: violet and green">
        <PrimitiveGrid items={accentPrimitives} />
      </Group>

      <Group title="Primitives: transparent">
        <PrimitiveGrid items={transparentPrimitives} />
      </Group>
    </Section>
  );
}
