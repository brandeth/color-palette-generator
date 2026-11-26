import type { ComponentProps } from "react";

type RoleLabelProps = Omit<ComponentProps<"span">, "children"> & {
  /** The colour's role in the palette, e.g. "Page". */
  name: string;
};

/*
 * Names the role a colour plays in the palette, e.g. "Page". Sits on the
 * page background, so it follows the page theme.
 *
 * Default state: just the role name in Text Preset 9 (Hex) (Funnel Sans
 * Bold 13px, line-height 130%, letter-spacing 0; the design's spacing is
 * 0, not Preset 9's 2%) in text-muted (#545B63 in light mode).
 */
export function RoleLabel({ name, className, ...props }: RoleLabelProps) {
  return (
    <span
      className={["inline-flex items-baseline whitespace-nowrap text-preset-9-hex text-text-muted", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {name}
    </span>
  );
}
