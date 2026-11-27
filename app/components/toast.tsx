import type { ComponentProps, ReactNode } from "react";
import { IconCheck } from "./icons";

type ToastProps = Omit<ComponentProps<"div">, "children"> & {
  /** The message, e.g. "Copied #B6363F". */
  children: ReactNode;
  /** "success" (default): a copy worked; shows a checkmark. */
  result?: "success";
  /** "hug" (default): as wide as the message, on one line. */
  width?: "hug";
};

/*
 * Confirms a copy (or, later, says why it failed). The same in both page
 * themes: #1B1F24 with a white border, so it stands out on either.
 *
 * Success, Hug width: a 36px-tall pill (radius 20) in #1B1F24 with a 2px
 * white border, shadow-paintbox-md, padding 16 at the sides and gap 8.
 * A 20px white checkmark, then the message in Text Preset 8 Bold (Funnel
 * Sans Bold 14px) in white, on one line, centred. As wide as it needs:
 * 164px for "Copied #B6363F" (16 + 20 + 8 + 104 + 16). The border is an
 * inset ring, so it takes no space, as in the design.
 *
 * It's a status message, so screen readers read it without moving focus.
 */
export function Toast({ children, result = "success", width = "hug", className, ...props }: ToastProps) {
  return (
    <div
      role="status"
      data-result={result}
      data-width={width}
      className={[
        "inline-flex h-[2.25rem] items-center justify-center gap-paintbox-100 whitespace-nowrap px-paintbox-200",
        "rounded-paintbox-20 bg-paintbox-neutral-900 text-paintbox-neutral-0 shadow-paintbox-md",
        "inset-ring-2 inset-ring-paintbox-neutral-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <IconCheck className="shrink-0" />
      <span className="text-preset-8-bold">{children}</span>
    </div>
  );
}
