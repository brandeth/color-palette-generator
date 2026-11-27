"use client";

import { Button } from "../../components/button";
import { useToast } from "../../components/toaster";
import { toastMessages, type ToastMessage } from "../../components/toast-messages";

const examples: { label: string; message: ToastMessage }[] = [
  { label: "Copied hex", message: toastMessages.copiedHex("#B6363F") },
  { label: "Hex copy failed", message: toastMessages.copyHexFailed("#B6363F") },
  { label: "All locked", message: toastMessages.allLocked() },
  { label: "Copied CSS", message: toastMessages.copiedCss() },
  { label: "Copied hex codes", message: toastMessages.copiedHexCodes() },
  { label: "Copied link", message: toastMessages.copiedLink() },
  { label: "Palette copy failed", message: toastMessages.copyPaletteFailed() },
];

/* Shows each message as a real toast, at the bottom of the window. Demo only. */
export function ToastDemo() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-paintbox-100 rounded-paintbox-16 border border-divider bg-surface p-paintbox-300">
      {examples.map(({ label, message }) => (
        <Button key={label} onClick={() => toast.show(message)} className="inset-ring-2 inset-ring-divider">
          {label}
        </Button>
      ))}
    </div>
  );
}
