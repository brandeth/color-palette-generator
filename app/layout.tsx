import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import { Toaster } from "./components/toaster";
import "./globals.css";

// Variable fonts: one file each covers every weight the presets use.
const funnelSans = Funnel_Sans({
  variable: "--font-funnel-sans",
  subsets: ["latin"],
});

const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "paintbox",
  description: "Generate five-colour palettes, lock the ones you like, and see them on a sample page.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${funnelSans.variable} ${funnelDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
