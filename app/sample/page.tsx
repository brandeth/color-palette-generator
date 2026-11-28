import type { Metadata } from "next";
import { ButtonLink } from "../components/button";
import { IconChevronUp } from "../components/icons";
import { SamplePage } from "../components/sample-page/sample-page";

export const metadata: Metadata = {
  title: "Sample page · paintbox",
  description: "Fellside, the sample page the Preview fills with your palette.",
  // Internal reference page: keep it out of search results.
  robots: { index: false, follow: false },
};

/*
 * The sample page on its own, at the full width of the window, in the
 * default palette. A paintbox bar above it leads back to the design
 * system; it's part of this route, not of the sample page, so the
 * Preview won't show it.
 */
export default function SamplePageRoute() {
  return (
    <>
      <nav aria-label="paintbox" className="border-b border-divider bg-surface">
        {/* The pill hangs 12px into the margin, so its icon starts at the page margin. */}
        <div className="container-paintbox flex py-paintbox-100">
          <ButtonLink href="/design-system" icon={<IconChevronUp className="-rotate-90" />} className="-ml-paintbox-150">
            Design system
          </ButtonLink>
        </div>
      </nav>
      <SamplePage className="flex-1" />
    </>
  );
}
