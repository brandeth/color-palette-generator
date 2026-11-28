"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { IconPalette, IconPreview } from "../../components/icons";
import { RoleLabel } from "../../components/role-label";
import { SamplePage, defaultSampleRoles, type SampleRoles } from "../../components/sample-page/sample-page";
import { Tab } from "../../components/tab";
import { SwatchDemo } from "./swatch-demo";

type View = "palette" | "preview";

const views: { id: View; label: string; Icon: typeof IconPalette }[] = [
  { id: "palette", label: "Palette", Icon: IconPalette },
  { id: "preview", label: "Preview", Icon: IconPreview },
];

const roleNames: Record<keyof SampleRoles, string> = {
  lightest: "Lightest",
  light: "Light",
  mid: "Mid",
  dark: "Dark",
  darkest: "Darkest",
};

/*
 * The Palette / Preview switcher with its panels, on the sample palette:
 * Palette shows the five role colours as swatches; Preview shows the
 * sample page (Fellside) filled with them, laid out for the panel's width.
 *
 * Keyboard, as the WAI-ARIA tabs pattern: Tab reaches the selected tab,
 * Left / Right move to the other one and show it, Home / End go to the
 * first / last.
 */
export function PreviewTabsDemo({ roles = defaultSampleRoles }: { roles?: SampleRoles }) {
  const [selected, setSelected] = useState<View>("palette");
  const id = useId();
  const tabs = useRef<Partial<Record<View, HTMLButtonElement | null>>>({});

  function select(view: View) {
    setSelected(view);
    tabs.current[view]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = views.findIndex((view) => view.id === selected);
    const next = {
      ArrowRight: (index + 1) % views.length,
      ArrowLeft: (index - 1 + views.length) % views.length,
      Home: 0,
      End: views.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(views[next].id);
  }

  return (
    <div className="flex flex-col gap-paintbox-300">
      <div role="tablist" aria-label="View" className="flex gap-paintbox-100">
        {views.map(({ id: view, label, Icon }) => (
          <Tab
            key={view}
            ref={(element) => {
              tabs.current[view] = element;
            }}
            id={`${id}-${view}-tab`}
            aria-controls={`${id}-${view}-panel`}
            // Only the selected tab is in the Tab order; arrows move between them.
            tabIndex={selected === view ? 0 : -1}
            icon={<Icon />}
            selected={selected === view}
            onClick={() => setSelected(view)}
            onKeyDown={handleKeyDown}
          >
            {label}
          </Tab>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-palette-panel`}
        aria-labelledby={`${id}-palette-tab`}
        hidden={selected !== "palette"}
        tabIndex={0}
        className="rounded-paintbox-16 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ul className="flex flex-col gap-paintbox-200">
          {(Object.keys(roleNames) as (keyof SampleRoles)[]).map((role) => (
            <li key={role} className="flex flex-col gap-paintbox-100">
              <RoleLabel name={roleNames[role]} variant="stacked" />
              <SwatchDemo hex={roles[role]} layout="row" className="h-paintbox-800" />
            </li>
          ))}
        </ul>
      </div>

      <div
        role="tabpanel"
        id={`${id}-preview-panel`}
        aria-labelledby={`${id}-preview-tab`}
        hidden={selected !== "preview"}
        tabIndex={0}
        className="overflow-hidden rounded-paintbox-16 border border-divider focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <SamplePage roles={roles} embedded />
      </div>
    </div>
  );
}
