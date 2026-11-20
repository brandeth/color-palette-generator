import type { CopyFormat } from "../../components/copy-palette-menu";

/** The three formats from the design, for the copy palette menu demos. */
export const copyFormats: CopyFormat[] = [
  { value: "css", name: "CSS variables", preview: "--color-1: #EEE8DF;" },
  { value: "hex", name: "Hex codes", preview: "#EEE8DF, #D8A38C, #B6363F, #87294D, #551B45" },
  { value: "link", name: "A link to this palette", preview: "Opens these exact colours" },
];
