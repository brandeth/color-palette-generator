"use client";

import { useEffect, useState } from "react";
import type { ToastMessage } from "./toast-messages";
import { useToast } from "./toaster";

// How long a copy counts as just copied.
const COPIED_MS = 2000;

/** The toast for each outcome, e.g. copiedHex(hex) and copyHexFailed(hex). */
type CopyToasts = { copied: ToastMessage; failed: ToastMessage };

/*
 * Copies text to the clipboard and says how it went, with a toast:
 *
 *   const { copied, copy } = useCopy();
 *   copy(hex, { copied: toastMessages.copiedHex(hex), failed: toastMessages.copyHexFailed(hex) });
 *
 * After a copy, `copied` is true for 2s, for a copied look such as Copy
 * Hex's checkmark; copying again restarts the 2s. If the clipboard
 * refuses (no permission, or not allowed), it shows the failed toast
 * and `copied` stays false, so nothing claims a copy that didn't happen.
 *
 * The toast is the announcement for screen readers too, so components
 * using this don't announce the copy themselves.
 */
export function useCopy() {
  const toast = useToast();
  // When the last copy happened; null when it's not just copied.
  const [copiedAt, setCopiedAt] = useState<number | null>(null);

  useEffect(() => {
    if (copiedAt === null) return;
    const timer = setTimeout(() => setCopiedAt(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copiedAt]);

  async function copy(text: string, toasts: CopyToasts) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable or refused.
      setCopiedAt(null);
      toast.show(toasts.failed);
      return;
    }
    setCopiedAt(Date.now());
    toast.show(toasts.copied);
  }

  return { copied: copiedAt !== null, copy };
}
