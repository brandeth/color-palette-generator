"use client";

import { Fragment, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { IconAlert, IconCheck } from "./icons";

type ToastProps = Omit<ComponentProps<"div">, "children"> & {
  /** The message, e.g. "Copied #B6363F" or "Couldn't copy #B6363F. Try again." */
  children: ReactNode;
  /**
   * "success" (default): a copy worked; shows a checkmark.
   * "failure": it didn't; shows an alert (a circle with "!").
   */
  result?: "success" | "failure";
  /**
   * "hug" (default): as wide as the message, on one line.
   * "wide": a fixed 313px pill with the content centred, for desktop.
   * "full": as wide as its container, the content on the left, for
   * tablets and phones; a long message wraps between its sentences.
   */
  width?: "hug" | "wide" | "full";
};

const widthClasses = {
  hug: "inline-flex h-[2.25rem] justify-center whitespace-nowrap",
  wide: "inline-flex h-[2.25rem] w-[19.5625rem] justify-center whitespace-nowrap", // 313px
  full: "flex min-h-[2.25rem] w-full",
};

// "A. B." → ["A.", "B."], so each sentence can stay on its own line.
function sentences(message: ReactNode): ReactNode {
  if (typeof message !== "string") return message;
  const parts = message.split(/(?<=[.!?])\s+/);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      <span className="inline-block">{part}</span>
    </Fragment>
  ));
}

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
 * Wide width: the same pill at a fixed 313px, the icon and message
 * centred together, so desktop toasts are all one size.
 *
 * Full width: as wide as its container (351px in the design), with the
 * icon and message on the left, 16px in; the message takes the rest of
 * the width. When the message doesn't fit on one line, it breaks between
 * sentences ("All five colours are locked." / "Unlock one to get new
 * colours.") and the padding becomes 16 all round: 72px tall for two
 * lines, the icon centred, the corners still 20.
 *
 * It's a status message, so screen readers read it without moving focus.
 */
export function Toast({ children, result = "success", width = "hug", className, ...props }: ToastProps) {
  const messageRef = useRef<HTMLSpanElement>(null);
  // Whether the Full toast's message runs over more than one line.
  const [wrapped, setWrapped] = useState(false);

  useLayoutEffect(() => {
    const message = messageRef.current;
    if (width !== "full" || !message) return;
    const check = () => {
      const lineHeight = parseFloat(getComputedStyle(message).lineHeight);
      setWrapped(message.getBoundingClientRect().height > lineHeight * 1.5);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(message);
    return () => observer.disconnect();
  }, [width, children]);

  return (
    <div
      role="status"
      data-result={result}
      data-width={width}
      data-wrapped={width === "full" && wrapped ? "" : undefined}
      className={[
        // 14px padding inside the 2px border: the content starts 16px in, as in the design.
        "items-center gap-paintbox-100 px-[0.875rem]",
        // Two lines: 16px all round (14 + the border).
        width === "full" && wrapped ? "py-[0.875rem]" : "",
        "rounded-paintbox-20 bg-paintbox-neutral-900 text-paintbox-neutral-0 shadow-paintbox-md",
        // A real border, with the background kept inside it, so no dark
        // shows through the smoothed edge at the rounded ends.
        "border-2 border-paintbox-neutral-0 bg-clip-padding",
        widthClasses[width],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {result === "failure" ? <IconAlert className="shrink-0" /> : <IconCheck className="shrink-0" />}
      {width === "full" ? (
        <span ref={messageRef} className="min-w-0 grow text-preset-8-bold">
          {sentences(children)}
        </span>
      ) : (
        <span className="text-preset-8-bold">{children}</span>
      )}
    </div>
  );
}
