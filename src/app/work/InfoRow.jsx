"use client";

import { useEffect, useRef, useState } from "react";
import { Bebas_Neue, DM_Sans } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const companies = [
  { name: "General Motors", href: "https://www.gm.com", arrow: true },
  { name: "UAlberta Formula Racing", href: null, arrow: false },
  { name: "Student Works", href: "https://studentworks.com", arrow: true },
  { name: "Modern Kitchens & Construction", href: "#", arrow: false },
  { name: "Hugo Boss", href: "https://www.hugoboss.com", arrow: true },
  { name: "Best Buy", href: "https://www.bestbuy.ca", arrow: true },
];

const tools = [
  "Python",
  "Java",
  "C",
  "C++",
  "JavaScript",
  "HTML5",
  "CSS3",
  "VHDL",
  "React",
  "Node.js",
  "Next.js",
  "Express",
  "jQuery",
  "Git",
  "Linux",
  "Excel",
  "Power BI",
  "Power Automate",
  "Databricks",
  "AutoCAD",
  "KiCAD",
  "SolidWorks",
  "TinkerCAD",
  "Arduino",
  "Raspberry Pi",
];

const links = [
  { label: "Email", href: "mailto:ssbansal731@gmail.com", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/simransb", external: true },
  { label: "GitHub", href: "https://github.com/ssbansal3", external: true },
];

const RESUME_VARIANTS = [
  { label: "General", href: "/resume.pdf" },
  { label: "Engineering", href: "/resume.pdf" },
  { label: "Automotive", href: "/resume.pdf" },
];

function ResumePicker() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${dmSans.className} text-left text-sm text-[var(--text)] transition-colors duration-200 hover:text-[#C17A3A]`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Resume ↗
      </button>
      {open ? (
        <div
          className="absolute left-0 top-full z-20 mt-2 min-w-[140px] rounded-md border border-[var(--border)] bg-[var(--bg)] p-2 shadow-lg"
          role="menu"
        >
          {RESUME_VARIANTS.map((variant) => (
            <a
              key={variant.label}
              href={variant.href}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              className={`${dmSans.className} block rounded px-3 py-2 text-sm text-[var(--text)] transition-colors hover:bg-[var(--surface)] hover:text-[#C17A3A]`}
              onClick={() => setOpen(false)}
            >
              {variant.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function InfoRow() {
  return (
    <section className="px-8 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className={`${bebas.className} mb-3 text-xs tracking-widest text-[var(--muted)]`}>
            ABOUT
          </p>
          <p className={`${dmSans.className} text-sm leading-relaxed text-[var(--text)]`}>
            Computer Engineering student at the University of Alberta with five years of
            work experience spanning retail floors, construction sites, and engineering
            teams. Currently a Group Leader at General Motors building Power BI dashboards
            and automations for manufacturing operations. I started in customer service and
            on construction sites — that part still shapes how I work. The thread is
            figuring out how things work and making them work better.
          </p>
        </div>

        <div>
          <p className={`${bebas.className} mb-3 text-xs tracking-widest text-[var(--muted)]`}>
            COMPANIES
          </p>
          <div className="flex flex-col gap-2">
            {companies.map((company) => {
              const content = (
                <span
                  className={`${dmSans.className} inline-flex items-center justify-between rounded-md border border-[var(--border)] px-3 py-2 text-sm transition duration-200 ease-in-out hover:border-[#C17A3A]`}
                >
                  <span>{company.name}</span>
                  {company.arrow ? <span className="ml-2">↗</span> : null}
                </span>
              );

              if (company.href) {
                return (
                  <a
                    key={company.name}
                    href={company.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content}
                  </a>
                );
              }

              return <div key={company.name}>{content}</div>;
            })}
          </div>
        </div>

        <div>
          <p className={`${bebas.className} mb-3 text-xs tracking-widest text-[var(--muted)]`}>
            TOOLS
          </p>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span
                key={tool}
                className={`${dmSans.className} rounded-md border border-[var(--border)] px-3 py-2 text-sm transition duration-200 ease-in-out hover:border-[#C17A3A]`}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className={`${bebas.className} mb-3 text-xs tracking-widest text-[var(--muted)]`}>
            LINKS
          </p>
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className={`${dmSans.className} text-sm text-[var(--text)] transition-colors duration-200 hover:text-[#C17A3A]`}
              >
                {link.label} ↗
              </a>
            ))}
            <ResumePicker />
          </div>
        </div>
      </div>
    </section>
  );
}
