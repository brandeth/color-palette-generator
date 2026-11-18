import { typePresets } from "../_data";
import { Code, Meta, Section } from "./section";

export function TypographySection() {
  return (
    <Section
      id="typography"
      title="Typography"
      description={
        <>
          One class per preset sets family, weight, size, line height, letter spacing and case, e.g.{" "}
          <Code>text-preset-7</Code>. Presets 1–3 scale with the viewport.
        </>
      }
    >
      <ul className="flex flex-col">
        {typePresets.map((p) => (
          <li
            key={p.className}
            className="flex flex-col gap-paintbox-150 border-b border-divider py-paintbox-300 first:pt-0"
          >
            <Meta>
              {p.label} · <span className="font-mono">{p.className}</span> · {p.spec}
            </Meta>
            <p className={p.className}>The quick brown fox jumps over the lazy dog.</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
