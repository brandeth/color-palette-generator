"use client";

import { useEffect, useState } from "react";

// How long a copy counts as just copied.
const COPIED_MS = 2000;

/*
 * Copies text to the clipboard and remembers it for 2s, for the copied
 * look and the "Copied …" announcement. Copying again restarts the 2s.
 * If the clipboard refuses (no permission, or not allowed), nothing
 * changes, so nothing claims a copy that didn't happen.
 */
export function useCopy() {
  // When the last copy happened; null when it's not just copied.
  const [copiedAt, setCopiedAt] = useState<number | null>(null);

  useEffect(() => {
    if (copiedAt === null) return;
    const timer = setTimeout(() => setCopiedAt(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copiedAt]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAt(Date.now());
    } catch {
      // Clipboard unavailable or refused: leave things as they were.
    }
  }

  return { copied: copiedAt !== null, copy };
}
