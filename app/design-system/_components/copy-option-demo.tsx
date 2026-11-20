"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CopyOption } from "../../components/copy-option";

// Only CSS variables comes from the design; the rest are placeholder
// formats for the demo.
const formats = [
  { name: "CSS variables", preview: "--color-1: #EEE8DF;" },
  { name: "Tailwind theme", preview: "--color-paint-1: #EEE8DF;" },
  { name: "HEX list", preview: "#EEE8DF, #C9B8A4, #8A6F55" },
  { name: "JSON", preview: '{ "color-1": "#EEE8DF" }' },
];

/*
 * Working copy format menu for the design system page. Click (or press
 * Enter/Space on) a format to choose it. The arrow keys move focus
 * between the formats (wrapping round) without choosing; Home and End
 * jump to the first and last. Only the focused format is tabbable.
 * Demo only: it doesn't copy anything.
 */
export function CopyMenuDemo() {
  const [selected, setSelected] = useState(0);
  const [focused, setFocused] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(next: number) {
    setFocused(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent) {
    const last = formats.length - 1;
    const target = {
      ArrowDown: focused === last ? 0 : focused + 1,
      ArrowUp: focused === 0 ? last : focused - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    move(target);
  }

  return (
    <div role="menu" aria-label="Copy format (live example)" onKeyDown={onKeyDown} className="flex flex-col gap-paintbox-050">
      {formats.map((format, i) => (
        <CopyOption
          key={format.name}
          ref={(el) => {
            refs.current[i] = el;
          }}
          preview={format.preview}
          selected={i === selected}
          tabIndex={i === focused ? 0 : -1}
          onFocus={() => setFocused(i)}
          onClick={() => setSelected(i)}
        >
          {format.name}
        </CopyOption>
      ))}
    </div>
  );
}
