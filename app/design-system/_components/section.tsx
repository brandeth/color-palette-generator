import type { ReactNode } from "react";

/** Top-level page section with an anchor id, heading and intro text. */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[8.5rem] paintbox-landscape:scroll-mt-0">
      <header className="flex flex-col gap-paintbox-100 border-b border-divider pb-paintbox-300">
        <h2 id={`${id}-title`} className="text-preset-2">
          {title}
        </h2>
        {description ? <p className="text-preset-8 text-text-muted">{description}</p> : null}
      </header>
      <div className="flex flex-col gap-paintbox-600 pt-paintbox-500">{children}</div>
    </section>
  );
}

/** Sub-heading inside a section. */
export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-paintbox-300">
      <h3 className="text-preset-6-bold">{title}</h3>
      {children}
    </div>
  );
}

/** Small muted label / code text used under samples. */
export function Meta({ children }: { children: ReactNode }) {
  return <p className="text-preset-9-hex text-text-muted">{children}</p>;
}

/** Inline token name, e.g. <Code>bg-surface</Code>. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-paintbox-8 bg-surface-alt px-paintbox-050 font-mono text-[0.8125rem]">
      {children}
    </code>
  );
}
