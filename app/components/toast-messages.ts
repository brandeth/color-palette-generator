/*
 * Every message a toast can show, from the design, with the result that
 * picks its icon. Callers pick a message here instead of writing the
 * text, so the wording stays the same everywhere.
 *
 *   const message = toastMessages.copiedHex("#B6363F");
 *   <Toast result={message.result}>{message.text}</Toast>
 */

export type ToastMessage = {
  /** "success" shows a checkmark; "failure" an alert. */
  result: "success" | "failure";
  text: string;
};

export const toastMessages = {
  /** A swatch's hex code was copied. */
  copiedHex: (hex: string): ToastMessage => ({ result: "success", text: `Copied ${hex}` }),
  /** Copying a swatch's hex code failed. */
  copyHexFailed: (hex: string): ToastMessage => ({ result: "failure", text: `Couldn't copy ${hex}. Try again.` }),
  /** Generate was pressed with every colour locked. */
  allLocked: (): ToastMessage => ({
    result: "failure",
    text: "All five colours are locked. Unlock one to get new colours.",
  }),
  /** Copy palette: CSS variables. */
  copiedCss: (): ToastMessage => ({ result: "success", text: "Copied as CSS variables" }),
  /** Copy palette: hex codes. */
  copiedHexCodes: (): ToastMessage => ({ result: "success", text: "Copied as hex codes" }),
  /** Copy palette: a link to the palette. */
  copiedLink: (): ToastMessage => ({ result: "success", text: "Copied a link to this palette" }),
  /** Copying the palette (in any format) failed. */
  copyPaletteFailed: (): ToastMessage => ({ result: "failure", text: "Couldn't copy the palette. Try again." }),
} as const;
