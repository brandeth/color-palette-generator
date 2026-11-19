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
 * Hover, pressed-on, disabled and focus states come next.
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
