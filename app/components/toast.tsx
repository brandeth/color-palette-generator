import type { ComponentProps, ReactNode } from "react";
import { IconAlert, IconCheck } from "./icons";

type ToastProps = Omit<ComponentProps<"div">, "children"> & {
  /** The message, e.g. "Copied #B6363F" or "Couldn't copy #B6363F. Try again." */
  children: ReactNode;
  /**
   * "success" (default): a copy worked; shows a checkmark.
   * "failure": it didn't; shows an alert (a circle with "!").
   */
  result?: "success" | "failure";
  /** "hug" (default): as wide as the message, on one line. */
  width?: "hug";
};

/*
 * Confirms a copy or says why it failed. The same in both page themes:
 * #1B1F24 with a white border, so it stands out on either.
 *
 * Success, Hug width: a 36px-tall pill (radius 20) in #1B1F24 with a 2px
 * white border, shadow-paintbox-md, padding 16 at the sides and gap 8.
 * A 20px white checkmark, then the message in Text Preset 8 Bold (Funnel
 * Sans Bold 14px) in white, on one line, centred. As wide as it needs:
 * 164px for "Copied #B6363F" (16 + 20 + 8 + 104 + 16, counted from the
 * outer edge: 2px border + 14px padding, as the design's inside stroke).
 * The background stops inside the border, so the white edge is clean
 * all the way round (an inset ring let the dark show through at the
 * rounded ends).
 *
 * Failure: the same, with the 20px alert icon (a circle with "!") in
 * place of the checkmark: 273px for "Couldn't copy #B6363F. Try again."
 * (16 + 20 + 8 + 213 + 16).
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
        // 14px padding inside the 2px border: the content starts 16px in, as in the design.
        "inline-flex h-[2.25rem] items-center justify-center gap-paintbox-100 whitespace-nowrap px-[0.875rem]",
        "rounded-paintbox-20 bg-paintbox-neutral-900 text-paintbox-neutral-0 shadow-paintbox-md",
        // A real border, with the background kept inside it, so no dark
        // shows through the smoothed edge at the rounded ends.
        "border-2 border-paintbox-neutral-0 bg-clip-padding",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {result === "failure" ? <IconAlert className="shrink-0" /> : <IconCheck className="shrink-0" />}
      <span className="text-preset-8-bold">{children}</span>
    </div>
  );
}
