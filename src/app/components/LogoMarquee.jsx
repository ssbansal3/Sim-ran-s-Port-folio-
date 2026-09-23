"use client";

import { useMemo } from "react";

/**
 * Edit this list to add or reorder brands/tools shown in the Works "film".
 */
export const LOGOS = [
  { name: "General Motors" },
  { name: "UAlberta Formula Racing" },
  { name: "University of Alberta" },
  { name: "Student Works" },
  { name: "Modern Kitchens & Construction" },
  { name: "Hugo Boss" },
  { name: "Best Buy" },
  { name: "Yamaha" },
  { name: "Hertz Audio" },
  { name: "Python" },
  { name: "Java" },
  { name: "C" },
  { name: "C++" },
  { name: "JavaScript" },
  { name: "HTML5" },
  { name: "CSS3" },
  { name: "VHDL" },
  { name: "React" },
  { name: "Node.js" },
  { name: "Next.js" },
  { name: "Express" },
  { name: "jQuery" },
  { name: "Git" },
  { name: "Linux" },
  { name: "Excel" },
  { name: "Power BI" },
  { name: "Power Automate" },
  { name: "Databricks" },
  { name: "AutoCAD" },
  { name: "KiCAD" },
  { name: "SolidWorks" },
  { name: "TinkerCAD" },
  { name: "Arduino" },
  { name: "Raspberry Pi" },
  { name: "PrusaSlicer" },
];

function LogoItem({ logo }) {
  return (
    <span
      className="logo-hit inline-flex cursor-default opacity-50 saturate-[0.7] transition-all duration-300 hover:scale-105 hover:opacity-100 hover:saturate-100"
      title={logo.name}
    >
      <span className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-current/30 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text)] sm:h-12 sm:text-xs md:h-14">
        {logo.name}
      </span>
    </span>
  );
}

function MarqueeRow({ logos, animationName, vertical }) {
  const doubled = [...logos, ...logos];
  const pos =
    vertical === "top"
      ? { top: "22%", bottom: "auto" }
      : { top: "auto", bottom: "22%" };
  return (
    <div
      className="logo-marquee-row pointer-events-none absolute left-0 right-0 flex justify-center"
      style={pos}
    >
      <div
        className="logo-marquee-track flex w-max gap-12"
        style={{
          animation: `${animationName} 60s linear infinite`,
        }}
      >
        {doubled.map((logo, i) => (
          <div key={`${logo.name}-${i}`} className="pointer-events-auto shrink-0">
            <LogoItem logo={logo} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LogoMarquee() {
  const { row1, row2 } = useMemo(() => {
    const mid = Math.ceil(LOGOS.length / 2);
    return { row1: LOGOS.slice(0, mid), row2: LOGOS.slice(mid) };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <MarqueeRow logos={row1} animationName="logo-marquee-ltr" vertical="top" />
      <MarqueeRow logos={row2} animationName="logo-marquee-rtl" vertical="bottom" />
    </div>
  );
}
