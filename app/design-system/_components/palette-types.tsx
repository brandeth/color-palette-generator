import {
  IconModeAnalogous,
  IconModeComplementary,
  IconModeMonochrome,
  IconModeRandom,
  IconModeTriadic,
} from "../../components/mode-icons";
import type { PaletteType } from "../../components/palette-type-menu";

/** The five palette types from the design, in the menu's order. */
export const paletteTypes: PaletteType[] = [
  { value: "random", name: "Random", description: "Anything goes, a surprise every time", icon: <IconModeRandom /> },
  { value: "monochrome", name: "Monochrome", description: "One colour, from light to dark", icon: <IconModeMonochrome /> },
  { value: "analogous", name: "Analogous", description: "Calm colours that sit side by side", icon: <IconModeAnalogous /> },
  {
    value: "complementary",
    name: "Complementary",
    description: "A colour and its opposite, for strong contrast",
    icon: <IconModeComplementary />,
  },
  { value: "triadic", name: "Triadic", description: "A bold mix built from three far-apart colours", icon: <IconModeTriadic /> },
];
