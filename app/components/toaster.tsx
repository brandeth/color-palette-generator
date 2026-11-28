"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Toast } from "./toast";
import type { ToastMessage } from "./toast-messages";

// How long a toast stays: failures longer, since they ask you to do something.
const SHOW_MS = { success: 3000, failure: 5000 };
// The fade out; matches duration-150 below.
const LEAVE_MS = 150;

// Desktop (the grid's 64rem breakpoint): a Hug pill. Below it: Full width.
const DESKTOP = "(width >= 64rem)";

type Current = { id: number; message: ToastMessage; leaving: boolean };

type ToastApi = {
  /** Shows a toast, replacing the one showing, if any. */
  show: (message: ToastMessage) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Shows toasts from anywhere inside <Toaster>:
 *
 *   const toast = useToast();
 *   toast.show(toastMessages.copiedHex("#B6363F"));
 */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast() needs a <Toaster> above it (it's in the root layout).");
  return api;
}

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/*
 * Holds the one toast on screen and the place it shows. Wraps the app in
 * the root layout; components call useToast().show(message).
 *
 * Placement, fixed over the page at the top, as in the designs' Copied
 * states. Phones and tablets: Full width inside the page margins (12px
 * on phones, 32 on tablets), 20px from the top, over the header (below
 * a phone's notch or status bar, where there is one), and 40px tall so
 * it covers the header's 40px row. Desktop (64rem and
 * up): a Hug pill, top centre, 112px from the top of the window (16px
 * into the generator's colours, over the swatches).
 *
 * Timing: it fades in while coming down 8px into place (200ms), stays 3s
 * (5s for a failure), then fades out going back up (150ms). With reduced
 * motion it only fades.
 * Hovering it pauses the timer, so it doesn't go while you're reading it.
 *
 * One at a time: a new toast takes the old one's place straight away and
 * its own timer starts, so copying five codes in a row never piles up.
 *
 * Screen readers: the place it shows is one status region that's always
 * there, so each new message is read once, politely, without moving focus.
 */
export function Toaster({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Current | null>(null);
  const [paused, setPaused] = useState(false);
  const nextId = useRef(0);
  // Time left on the showing toast, kept across pauses.
  const remaining = useRef({ id: 0, ms: 0 });

  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );

  const show = useCallback((message: ToastMessage) => {
    nextId.current += 1;
    remaining.current = { id: nextId.current, ms: SHOW_MS[message.result] };
    setCurrent({ id: nextId.current, message, leaving: false });
  }, []);

  const id = current?.id;
  const leaving = current?.leaving;

  // Counts down while it's showing and not hovered, then starts the fade out.
  useEffect(() => {
    if (id === undefined || leaving || paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => {
      setCurrent((toast) => (toast?.id === id ? { ...toast, leaving: true } : toast));
    }, remaining.current.ms);
    return () => {
      clearTimeout(timer);
      // Not when it's been replaced: the new toast has its own time.
      if (remaining.current.id === id) remaining.current.ms -= Date.now() - startedAt;
    };
  }, [id, leaving, paused]);

  // Once faded out, it's gone.
  useEffect(() => {
    if (id === undefined || !leaving) return;
    const timer = setTimeout(() => {
      setCurrent((toast) => (toast?.id === id ? null : toast));
      setPaused(false);
    }, LEAVE_MS);
    return () => clearTimeout(timer);
  }, [id, leaving]);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={[
          // Over the page, clicks pass through except on the toast itself.
          "pointer-events-none fixed inset-x-0 z-50 flex justify-center",
          // Phones and tablets: 20px down, over the header, inside the page margins.
          "top-[calc(var(--spacing-paintbox-250)+env(safe-area-inset-top))] px-(--grid-paintbox-margin)",
          // Desktop: top centre, 112px down (32 page padding + 40 header + 24 gap + 16).
          "lg:top-[7rem]",
        ].join(" ")}
      >
        {current ? (
          <Toast
            // A new toast is a new element, so it animates in again and is read again.
            key={current.id}
            // The region above is the status message; the toast is just its look.
            role={undefined}
            result={current.message.result}
            width={desktop ? "hug" : "full"}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={[
              "pointer-events-auto transition-[opacity,translate] duration-200 ease-out",
              // Over the 40px header on phones and tablets: 40 tall, so it covers the row (the
              // design's Copied frames); a two-line message is taller anyway.
              "max-lg:min-h-[2.5rem]!",
              // Enter: from transparent and 8px higher (just the fade with reduced motion).
              "starting:opacity-0 motion-safe:starting:-translate-y-paintbox-100",
              // Leave: back to transparent and higher, a little quicker.
              current.leaving ? "opacity-0 duration-150 ease-in motion-safe:-translate-y-paintbox-100" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {current.message.text}
          </Toast>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}
