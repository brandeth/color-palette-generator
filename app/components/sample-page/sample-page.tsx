import type { ComponentProps, CSSProperties, ReactNode } from "react";
import {
  FellsideMark,
  HeroLandscape,
  WalkBrackenfoldEdge,
  WalkHazelClough,
  WalkMirefootWater,
} from "./illustrations";

/** The five palette roles that colour the page, lightest to darkest. */
export type SampleRoles = {
  /** The page, the chips, the footer text. */
  lightest: string;
  /** The walk cards and the hero sky. */
  light: string;
  /** The Plan a walk button, the logo's sun, the far hills. */
  mid: string;
  /** The footer and the near hills. */
  dark: string;
  /** Text, outlines, the logo's peak, the foreground. */
  darkest: string;
};

export const defaultSampleRoles: SampleRoles = {
  lightest: "#EEE8DF",
  light: "#D8A38C",
  mid: "#B6363F",
  dark: "#87294D",
  darkest: "#551B45",
};

type SamplePageProps = Omit<ComponentProps<"div">, "children"> & {
  /** The colours to fill it with; any left out use the defaults. */
  roles?: Partial<SampleRoles>;
  /**
   * Shown inside another page (the Preview panel): its header, main and
   * footer become plain wrappers, so they don't add a second set of page
   * landmarks to the page around it.
   */
  embedded?: boolean;
};

/*
 * Layouts, by the page's own width (a container query), so it lays out the
 * same in a preview frame as in a window:
 *   phone            under 28rem (the design's 351)
 *   phone landscape  28rem up    (451)  @min-[28rem]:
 *   tablet           44rem up    (704)  @min-[44rem]:
 *   desktop          64rem up    (1344) @min-[64rem]:
 * Each section's content stops at 84rem (1344) on wider screens.
 */
const inner = "mx-auto w-full max-w-[84rem]";

// Keyboard focus: a 3px ring 2px out, in the text colour of where it sits.
const focusOnPage = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--darkest)";
const focusOnFooter = "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--lightest)";

const navLinks = ["Routes", "Maps", "Journal"];

const walks = [
  { name: "Brackenfold Edge", details: "11.2 km · 4 hours · circular", tag: "Hilly", Art: WalkBrackenfoldEdge },
  { name: "Mirefoot Water", details: "6.5 km · 2 hours · circular", tag: "Easy", Art: WalkMirefootWater },
  { name: "Hazel Clough", details: "8.4 km · 3 hours · there and back", tag: "Shady in summer", Art: WalkHazelClough },
];

const footerColumns = [
  { title: "Walks", links: ["Near you", "Circular", "Family days out"] },
  { title: "Company", links: ["About us", "Journal", "Careers"] },
  { title: "Help", links: ["Walking safely", "Contact", "Get the app"] },
];

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** The Fellside logo: the mark and the name. */
function Logo({ className }: { className?: string }) {
  return (
    <a href="#" className={cx("flex items-center gap-paintbox-100 rounded-paintbox-8 text-preset-6-tight", className)}>
      <FellsideMark className="shrink-0" />
      Fellside
    </a>
  );
}

/** A pill-shaped link that looks like a button. */
function PillLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a
      href="#"
      className={cx("inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-paintbox-full", className)}
    >
      {children}
    </a>
  );
}

/*
 * Fellside, a made-up walking site, coloured by the palette: the page the
 * Preview shows, so you can see the colours at work. Every colour comes
 * from one of the five roles (see `roles`); the text is always the
 * darkest role on the lightest, or the lightest on the dark footer.
 *
 * From the top: a nav bar (the logo, Routes / Maps / Journal from tablet
 * up, and a Get the app outline pill); a hero with the headline, intro,
 * Plan a walk and See the routes, and the landscape (above the text on
 * phones, beside it from tablet up); "Walks near you this weekend" with
 * three walk cards (stacked on phones, in a row from tablet up); and a
 * footer with a call to action, the brand, three columns of links and
 * the small print.
 *
 * The links go nowhere: it's a sample.
 */
export function SamplePage({ roles, embedded = false, className, style, ...props }: SamplePageProps) {
  const Header = embedded ? "div" : "header";
  const Main = embedded ? "div" : "main";
  const Footer = embedded ? "div" : "footer";
  const colours = { ...defaultSampleRoles, ...roles };
  const roleVariables = {
    "--lightest": colours.lightest,
    "--light": colours.light,
    "--mid": colours.mid,
    "--dark": colours.dark,
    "--darkest": colours.darkest,
  } as CSSProperties;

  return (
    <div
      className={cx("@container flex flex-col bg-(--lightest) text-(--darkest)", className)}
      style={{ ...roleVariables, ...style }}
      {...props}
    >
      <Header
        className={cx(
          inner,
          "flex items-center justify-between gap-paintbox-400",
          // Padding: 16 20 on phones, 8 20 in landscape, 20 32 on tablets, 12 48 on desktop.
          "px-paintbox-250 py-paintbox-200 @min-[28rem]:py-paintbox-100",
          "@min-[44rem]:px-paintbox-400 @min-[44rem]:py-paintbox-250",
          "@min-[64rem]:px-paintbox-600 @min-[64rem]:py-paintbox-150",
        )}
      >
        <Logo className={focusOnPage} />
        <div className="flex items-center gap-paintbox-400">
          <nav aria-label="Fellside" className="hidden @min-[44rem]:block">
            <ul className="flex gap-paintbox-300 text-preset-8-bold">
              {navLinks.map((link) => (
                <li key={link}>
                  <a href="#" className={cx("rounded-paintbox-8 hover:underline", focusOnPage)}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* 36px tall: 14px padding inside the 2px border, as the design's inside stroke. */}
          <PillLink className={cx("h-[2.25rem] border-2 border-(--darkest) px-[0.875rem] text-preset-8-bold", focusOnPage)}>
            Get the app
          </PillLink>
        </div>
      </Header>

      <Main className="flex flex-col">
        <section
          aria-labelledby="sample-headline"
          className={cx(
            inner,
            "flex flex-col gap-paintbox-300",
            // Padding: 16 20 40 on phones, 8 20 40 in landscape.
            "px-paintbox-250 pt-paintbox-200 pb-paintbox-500 @min-[28rem]:pt-paintbox-100",
            // Tablet: side by side, 80 32 40, gap 32. Desktop: 40 48 48, gap 64.
            "@min-[44rem]:flex-row @min-[44rem]:items-center @min-[44rem]:gap-paintbox-400",
            "@min-[44rem]:px-paintbox-400 @min-[44rem]:pt-paintbox-1000",
            "@min-[64rem]:gap-paintbox-800 @min-[64rem]:px-paintbox-600 @min-[64rem]:pt-paintbox-500 @min-[64rem]:pb-paintbox-600",
          )}
        >
          <div
            className={cx(
              "flex flex-col items-start gap-paintbox-250 @min-[28rem]:gap-paintbox-150",
              "@min-[44rem]:flex-1 @min-[44rem]:gap-paintbox-300 @min-[64rem]:w-[27rem] @min-[64rem]:flex-none",
            )}
          >
            {/* At most 10em wide, so it breaks after "the" at every size, as in the design. */}
            <h1
              id="sample-headline"
              className="max-w-[10em] text-preset-1-mobile @min-[28rem]:text-preset-1-tablet @min-[64rem]:text-preset-1-desktop"
            >
              Find a walk worth the whole weekend
            </h1>
            <p className="max-w-[21.375em] text-preset-7 @min-[44rem]:text-preset-6">
              Fellside plans routes that fit your legs, the weather and the time you&apos;ve got, with a café or a pub
              along the way.
            </p>
            <div className="flex flex-wrap gap-paintbox-150">
              <PillLink
                className={cx(
                  "h-paintbox-600 bg-(--mid) px-paintbox-250 text-preset-7-bold text-(--lightest)",
                  "@min-[64rem]:px-paintbox-300 @min-[64rem]:text-preset-6-bold",
                  focusOnPage,
                )}
              >
                Plan a walk
              </PillLink>
              <PillLink
                className={cx(
                  // 20px in from the outer edge (18 + the 2px border); 24 on desktop.
                  "h-paintbox-600 border-2 border-(--darkest) px-[1.125rem] text-preset-7-bold",
                  "@min-[64rem]:px-[1.375rem] @min-[64rem]:text-preset-6-bold",
                  focusOnPage,
                )}
              >
                See the routes
              </PillLink>
            </div>
          </div>
          {/* Above the text on phones; after it from landscape up. */}
          <div className="-order-1 overflow-hidden rounded-paintbox-16 @min-[28rem]:order-none @min-[44rem]:min-w-0 @min-[44rem]:flex-1">
            <HeroLandscape className="block aspect-[311/160] w-full @min-[28rem]:aspect-[2/1] @min-[64rem]:aspect-[752/268.56]" />
          </div>
        </section>

        <section
          aria-labelledby="sample-walks"
          className={cx(
            inner,
            "flex flex-col gap-paintbox-300 px-paintbox-250 pb-paintbox-500",
            "@min-[44rem]:gap-paintbox-400 @min-[44rem]:px-paintbox-400 @min-[44rem]:pt-paintbox-500 @min-[44rem]:pb-paintbox-800",
            "@min-[64rem]:gap-paintbox-200 @min-[64rem]:px-paintbox-600 @min-[64rem]:pt-0",
          )}
        >
          <div
            className={cx(
              "flex flex-col items-start gap-paintbox-100",
              "@min-[44rem]:flex-row @min-[44rem]:items-baseline @min-[44rem]:justify-between @min-[44rem]:gap-paintbox-300",
            )}
          >
            <h2
              id="sample-walks"
              className="text-preset-2-mobile @min-[28rem]:text-preset-2-tablet @min-[64rem]:text-preset-2-desktop"
            >
              Walks near you this weekend
            </h2>
            <a href="#" className={cx("shrink-0 rounded-paintbox-8 text-preset-7-bold underline", focusOnPage)}>
              See all 240 walks
            </a>
          </div>

          <ul className="grid gap-paintbox-150 @min-[44rem]:grid-cols-3 @min-[44rem]:gap-paintbox-200">
            {walks.map(({ name, details, tag, Art }) => (
              <li key={name} className="flex flex-col gap-paintbox-150 rounded-paintbox-20 bg-(--light) p-paintbox-100">
                <Art className="block aspect-[2/1] h-auto w-full rounded-paintbox-12" />
                {/* The details fill the card, so the tags line up when the cards sit in a row. */}
                <div className="flex grow flex-col items-start gap-paintbox-100 px-paintbox-150 pb-paintbox-150">
                  <h3 className="text-preset-6-bold">{name}</h3>
                  <p className="grow text-preset-8">{details}</p>
                  <p className="rounded-paintbox-full bg-(--lightest) px-paintbox-150 py-paintbox-050 text-preset-9">
                    {tag}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Main>

      <Footer className="bg-(--dark) text-(--lightest)">
        <div
          className={cx(
            inner,
            "flex flex-col gap-paintbox-500 px-paintbox-250 pt-paintbox-500 pb-paintbox-300",
            "@min-[44rem]:px-paintbox-400 @min-[44rem]:pt-paintbox-600 @min-[64rem]:px-paintbox-600",
          )}
        >
          <div
            className={cx(
              "flex flex-col items-start gap-paintbox-300",
              "@min-[44rem]:flex-row @min-[44rem]:items-center @min-[44rem]:justify-between",
            )}
          >
            {/* At most 10em wide, so it breaks after "starts", as in the design. */}
            <h2 className="max-w-[10em] text-preset-2-mobile @min-[28rem]:text-preset-2-tablet @min-[64rem]:text-preset-2-desktop">
              Your next walk starts at the front door
            </h2>
            <PillLink
              className={cx("h-paintbox-600 bg-(--lightest) px-paintbox-300 text-preset-6-bold text-(--darkest)", focusOnFooter)}
            >
              Plan a walk
            </PillLink>
          </div>

          {/* Two columns on phones (the brand across both), four from tablet up. */}
          <div
            className={cx(
              "grid grid-cols-2 gap-x-paintbox-300 gap-y-paintbox-400",
              "border-t-2 border-(--lightest)/25 pt-paintbox-400 @min-[44rem]:grid-cols-4",
            )}
          >
            <div className="col-span-2 flex flex-col items-start gap-paintbox-150 @min-[44rem]:col-span-1">
              <Logo className={cx("[--fellside-peak:var(--lightest)] [--fellside-sun:var(--lightest)]", focusOnFooter)} />
              <p className="max-w-[14.3em] text-preset-8">Walks planned around your legs, the weather and the pub.</p>
            </div>
            {footerColumns.map((column) => (
              <nav key={column.title} aria-labelledby={`sample-footer-${column.title}`} className="flex flex-col gap-paintbox-100">
                <h3 id={`sample-footer-${column.title}`} className="text-preset-8-bold">
                  {column.title}
                </h3>
                {/* The type is on the list, so each item is one 20px line. */}
                <ul className="flex flex-col gap-paintbox-100 text-preset-8">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className={cx("rounded-paintbox-8 hover:underline", focusOnFooter)}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <p className="text-preset-9">
            © 2026 Fellside ·{" "}
            <a href="#" className={cx("rounded-paintbox-8 hover:underline", focusOnFooter)}>
              Privacy
            </a>{" "}
            ·{" "}
            <a href="#" className={cx("rounded-paintbox-8 hover:underline", focusOnFooter)}>
              Terms
            </a>
          </p>
        </div>
      </Footer>
    </div>
  );
}
