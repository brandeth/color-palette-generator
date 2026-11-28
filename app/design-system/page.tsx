import type { Metadata } from "next";
import { ButtonLink } from "../components/button";
import { IconChevronUp } from "../components/icons";
import { ColorsSection } from "./_components/colors-section";
import { ComponentsSection } from "./_components/components-section";
import { EffectsSection, RadiusSection, SpacingSection } from "./_components/layout-sections";
import { ThemeSwitcher } from "./_components/theme-switcher";
import { TypographySection } from "./_components/typography-section";

export const metadata: Metadata = {
  title: "Design system · paintbox",
  description: "Paintbox design tokens and components.",
  // Internal reference page: keep it out of search results.
  robots: { index: false, follow: false },
};

const sections = [
  { id: "components", label: "Components" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "radius", label: "Radius" },
  { id: "effects", label: "Effects" },
];

export default function DesignSystemPage() {
  return (
    <>
      {/* Sticky, except on phones in landscape where it would eat the screen. */}
      <header className="sticky top-0 z-10 border-b border-divider bg-surface paintbox-landscape:static">
        <div className="container-paintbox flex flex-wrap items-center justify-between gap-paintbox-200 py-paintbox-200">
          <div>
            <p className="text-preset-9 text-text-muted">paintbox</p>
            <h1 className="text-preset-6-tight">Design system</h1>
          </div>
          <div className="flex flex-wrap items-center gap-paintbox-300">
            {/* The chevron, turned to point forward, after the label. */}
            <ButtonLink href="/sample" icon={<IconChevronUp className="rotate-90" />} className="flex-row-reverse">
              Sample page
            </ButtonLink>
            <ThemeSwitcher />
          </div>
        </div>
        <nav aria-label="Sections" className="container-paintbox overflow-x-auto pb-paintbox-150">
          <ul className="flex gap-paintbox-300 whitespace-nowrap">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-preset-8 text-text-muted underline-offset-4 hover:text-text hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="container-paintbox flex flex-col gap-paintbox-1000 py-paintbox-800">
        <ComponentsSection />
        <ColorsSection />
        <TypographySection />
        <SpacingSection />
        <RadiusSection />
        <EffectsSection />
      </main>
    </>
  );
}
