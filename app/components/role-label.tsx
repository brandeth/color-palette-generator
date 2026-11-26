import type { ComponentProps } from "react";

type RoleLabelProps = Omit<ComponentProps<"span">, "children"> & {
  /** The colour's role in the palette, e.g. "Page". */
  name: string;
  /**
   * The colour's hex code, e.g. "#EEE8DF". When given, it shows after the
   * role name; leave it out to show the role name alone.
   */
  hex?: string;
};

/*
 * Names the role a colour plays in the palette, e.g. "Page". Sits on the
 * page background, so it follows the page theme.
 *
 * Default state: just the role name in Text Preset 9 (Funnel Sans Bold
 * 13px, line-height 130%, letter-spacing 2%) in text-muted (#545B63 in
 * light mode).
 *
 * Hex shown (`hex`): the hex code follows the role name, 4px after it,
 * on the same baseline, in Text Preset 9 (Hex) (the same type with
 * letter-spacing 0) in the text colour (#1B1F24 in light mode), so it
 * stands out from the muted role name.
 */
export function RoleLabel({ name, hex, className, ...props }: RoleLabelProps) {
  return (
    <span
      className={["inline-flex items-baseline gap-paintbox-050 whitespace-nowrap", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="text-preset-9 text-text-muted">{name}</span>
      {hex ? <span className="text-preset-9-hex text-text">{hex}</span> : null}
    </span>
  );
}
