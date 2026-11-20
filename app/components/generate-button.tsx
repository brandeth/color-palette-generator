import type { ComponentProps } from "react";
import { IconGenerate } from "./icons";

type GenerateButtonProps = Omit<ComponentProps<"button">, "children"> & {
  /**
   * Keyboard shortcut shown as a badge after the label, e.g. "Space".
   * Also sets aria-keyshortcuts. The page must handle the key itself;
   * this only shows the hint. Leave out to hide the badge.
   */
  shortcut?: string;
};

/*
 * The main "Generate" button (generates a new palette).
 *
 * Default state: 48px tall, padding-inline 32, gap 8, pill shape.
 * Background in the text token (#1B1F24 light), icon and label in the
 * surface token (white light), so it's the inverse of the page: in dark
 * mode it turns light with dark text.
 * Label: Text Preset 7 (Bold), 16px. With the "Space" badge the button
 * is about 230px wide.
 *
 * Shortcut badge: 20px tall, 2px border, radius 8, padding-inline 8,
 * Text Preset 9 (13px bold); border and text are the surface color at
 * 80% (#D1D2D3 on the dark button). 12px after the label (gap 8 plus a
 * 4px margin), as in the design. Hidden from screen readers, since
 * aria-keyshortcuts already announces it.
 *
 * Hover: a 2px ring in the button's own color (text token) 2px outside
 * the button, with the page showing through the gap. Drawn as an
 * outline, so the button doesn't grow or shift its neighbours. Only on
 * enabled buttons, and only on devices that can hover.
 *
 * Focus (keyboard only, :focus-visible): 3px outline in the focus token
 * (#6A2BC9 light), 2px outside the button, same as the other buttons.
 * It uses the same outline as hover; the hover ring is skipped while the
 * button has keyboard focus, so the focus ring replaces it.
 *
 * Pressed (:active, while the mouse button or Space/Enter is held down):
 * a 4px ring in text-muted (#545B63 light) inside the button, drawn
 * inset so the size doesn't change. With a mouse, the hover ring stays
 * outside it; with the keyboard, the focus ring does.
 *
 * Disabled state comes next.
 */
export function GenerateButton({ shortcut, className, ...props }: GenerateButtonProps) {
  return (
    <button
      type="button"
      aria-keyshortcuts={shortcut}
      className={[
        "inline-flex h-paintbox-600 shrink-0 cursor-pointer items-center gap-paintbox-100 whitespace-nowrap",
        "rounded-paintbox-full bg-text px-paintbox-400",
        "text-preset-7-bold text-surface",
        // not-focus-visible: so the keyboard focus ring always wins over hover.
        "hover:enabled:not-focus-visible:outline-2 hover:enabled:not-focus-visible:outline-offset-2 hover:enabled:not-focus-visible:outline-text",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        "active:enabled:inset-ring-4 active:enabled:inset-ring-text-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <IconGenerate />
      {/* Trim to cap height → baseline so the label centres with the icon. */}
      <span className="[text-box:trim-both_cap_alphabetic]">Generate</span>
      {shortcut ? (
        <kbd
          aria-hidden
          className="ml-paintbox-050 inline-flex h-paintbox-250 items-center rounded-paintbox-8 border-2 border-surface/80 px-paintbox-100 text-preset-9 text-surface/80"
        >
          {shortcut}
        </kbd>
      ) : null}
    </button>
  );
}
