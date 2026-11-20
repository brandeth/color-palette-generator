import type { ComponentProps, ReactNode } from "react";

type CopyOptionProps = ComponentProps<"button"> & {
  /** A sample of what gets copied, e.g. "--color-1: #EEE8DF;". */
  preview: ReactNode;
};

/*
 * One format in the "Copy palette" menu (CSS variables, …): the format's
 * name with a sample line of the output under it.
 *
 * Default state: 256px wide, padding 8 (top/bottom) and 12 (sides),
 * radius 12, no border, transparent background. Name in Text Preset 7
 * Bold (16px, text color), sample in Text Preset 8 (14px, text-muted),
 * left-aligned: 8 + 24.8 + 20.3 + 8 = 61px tall. The 12px gap is
 * between the text and the checkmark the selected state adds.
 *
 * Hover, selected and focus states come next.
 */
export function CopyOption({ preview, className, children, ...props }: CopyOptionProps) {
  return (
    <button
      type="button"
      className={[
        "flex w-[16rem] shrink-0 cursor-pointer items-center gap-paintbox-150",
        "rounded-paintbox-12 px-paintbox-150 py-paintbox-100",
        "text-left text-text",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-preset-7-bold">{children}</span>
        <span className="text-preset-8 text-text-muted">{preview}</span>
      </span>
    </button>
  );
}
