import type { ComponentProps, ReactNode } from "react";
import { IconCheck } from "./icons";

type CopyOptionProps = Omit<ComponentProps<"button">, "role" | "aria-checked"> & {
  /** A sample of what gets copied, e.g. "--color-1: #EEE8DF;". */
  preview: ReactNode;
  /** Whether this is the chosen format. Shows the checkmark; sets aria-checked. */
  selected?: boolean;
};

/*
 * One format in the "Copy palette" menu (CSS variables, …): the format's
 * name with a sample line of the output under it.
 *
 * Default state: 256px wide, padding 8 (top/bottom) and 12 (sides),
 * radius 12, no border, transparent background. Name in Text Preset 7
 * Bold (16px, text color), sample in Text Preset 8 (14px, text-muted),
 * left-aligned: 8 + 24.8 + 20.3 + 8 = 61px tall. The 12px gap is
 * between the text and the checkmark the selected state adds.
 *
 * Hover: surface-alt background (#ECEFEC light), no border. Only on
 * enabled buttons, and only on devices that can hover.
 *
 * Selected: a 20px checkmark in the text color at the right (12px from
 * the edge, 12px after the text), lined up with the name rather than the
 * middle of the option. No background or border. The check's space is
 * kept when it's hidden, so selecting doesn't re-wrap the text.
 *
 * The "Copy palette" button opens a menu, so each option is a checkable
 * menu item (role="menuitemradio" + aria-checked) inside a role="menu".
 * The menu handles the arrow keys and moves focus between the options.
 * The check is decorative; aria-checked already says which is chosen.
 *
 * Focus (keyboard only, :focus-visible): 3px outline in the focus token
 * (#6A2BC9 light), 2px outside the option, same as the other buttons.
 * In a menu the arrow keys move focus without choosing, so the ring can
 * sit on an option that isn't selected (as in the design). A mouse
 * click doesn't show it.
 */
export function CopyOption({ preview, selected = false, className, children, ...props }: CopyOptionProps) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      className={[
        "flex w-[16rem] shrink-0 cursor-pointer items-center gap-paintbox-150",
        "rounded-paintbox-12 px-paintbox-150 py-paintbox-100",
        "text-left text-text",
        "hover:enabled:bg-surface-alt",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-preset-7-bold">{children}</span>
        <span className="text-preset-8 text-text-muted">{preview}</span>
      </span>
      {/* mt: (name line 1.55rem - 20px icon) / 2, so it centres on the name. */}
      <IconCheck className={["mt-[0.15rem] shrink-0 self-start", selected ? "" : "invisible"].join(" ")} />
    </button>
  );
}
