import type { ComponentProps, ReactNode } from "react";

type IconButtonProps = Omit<ComponentProps<"button">, "children" | "aria-label" | "aria-pressed"> & {
  /** The icon, e.g. <IconUndo />. Rendered decoratively. */
  icon: ReactNode;
  /** Accessible name, e.g. "Undo". Required: the button has no visible text. */
  label: string;
  /**
   * Leave undefined for a plain action button (Undo, Redo).
   * Pass a boolean to make it a toggle (e.g. dark mode): sets aria-pressed.
   */
  pressed?: boolean;
};

/*
 * Icon-only button used in the header (Undo, Redo, theme toggle).
 *
 * Default state (pressed off): 40×40 circle, no border, transparent
 * background, 20px icon centred in the text color token.
 *
 * Hover: surface-alt background (paintbox-neutral-100, #ECEFEC, in light;
 * neutral-800 in dark so the light icon stays visible). The button is a
 * square with a full radius, so the fill is a circle (same as 50%).
 * Only on enabled buttons, and only on devices that can hover.
 *
 * Disabled (native `disabled`): the icon drops to 40% opacity and the
 * button shows the normal arrow cursor. Only the icon fades, not the
 * button, so a background added by a later state isn't faded with it.
 * No hover fill (see above). Disabled buttons can't be focused or clicked.
 *
 * Focus (keyboard only, :focus-visible): 3px outline in the focus token
 * (#6A2BC9 light), 2px outside the button, same as Tab. The outline
 * follows the full radius, so it's a circle, and takes no space, so
 * nothing shifts. Applies on top of hover and pressed.
 *
 * Pressed on (`pressed` → aria-pressed="true"): surface-alt background
 * (#ECEFEC light) and a 2px text-muted ring (#545B63 light), drawn inset
 * so the button stays 40×40. Same look as the selected Tab. Hovering a
 * pressed button looks the same (its hover fill is the same color).
 * Disabled + pressed keeps the background and ring; only the icon fades.
 */
export function IconButton({ icon, label, pressed, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      className={[
        "inline-flex size-paintbox-500 shrink-0 cursor-pointer items-center justify-center",
        "rounded-paintbox-full text-text",
        "hover:enabled:bg-surface-alt",
        "aria-pressed:bg-surface-alt aria-pressed:inset-ring-2 aria-pressed:inset-ring-text-muted",
        "disabled:cursor-default disabled:*:opacity-40",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
    </button>
  );
}
