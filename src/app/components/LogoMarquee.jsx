"use client";

import { useMemo, useState } from "react";

/**
 * Edit this list to add or reorder brands/tools shown in the Works "film".
 * Place matching SVG files under `public/logos/`. If a file is missing, a styled text fallback appears.
 */
export const LOGOS = [
  { name: "General Motors", src: "/logos/gm.svg", url: "https://www.gm.com" },
  { name: "UAlberta Formula Racing", src: "/logos/uafr.svg", url: "https://ualbertaracing.ca" },
  { name: "University of Alberta", src: "/logos/ualberta.svg", url: "https://www.ualberta.ca" },
  { name: "Student Works", src: "/logos/studentworks.svg", url: "https://studentworks.com" },
  { name: "Modern Kitchens & Construction", src: "/logos/modernkitchens.svg", url: "" },
  { name: "Hugo Boss", src: "/logos/hugoboss.svg", url: "https://www.hugoboss.com" },
  { name: "Best Buy", src: "/logos/bestbuy.svg", url: "https://www.bestbuy.com" },
  { name: "Yamaha", src: "/logos/yamaha.svg", url: "https://www.yamaha.com" },
  { name: "Hertz Audio", src: "/logos/hertzaudio.svg", url: "https://www.hertzaudio.com" },
  { name: "Python", src: "/logos/python.svg" },
  { name: "Java", src: "/logos/java.svg" },
  { name: "C", src: "/logos/c.svg" },
  { name: "C++", src: "/logos/cpp.svg" },
  { name: "JavaScript", src: "/logos/javascript.svg" },
  { name: "HTML5", src: "/logos/html5.svg" },
  { name: "CSS3", src: "/logos/css3.svg" },
  { name: "VHDL", src: "/logos/vhdl.svg" },
  { name: "React", src: "/logos/react.svg" },
  { name: "Node.js", src: "/logos/nodejs.svg" },
  { name: "Next.js", src: "/logos/nextjs.svg" },
  { name: "Express", src: "/logos/express.svg" },
  { name: "jQuery", src: "/logos/jquery.svg" },
  { name: "Git", src: "/logos/git.svg" },
  { name: "Linux", src: "/logos/linux.svg" },
  { name: "Excel", src: "/logos/excel.svg" },
  { name: "Power BI", src: "/logos/powerbi.svg" },
  { name: "Power Automate", src: "/logos/powerautomate.svg" },
  { name: "Databricks", src: "/logos/databricks.svg" },
  { name: "AutoCAD", src: "/logos/autocad.svg" },
  { name: "KiCAD", src: "/logos/kicad.svg" },
  { name: "SolidWorks", src: "/logos/solidworks.svg" },
  { name: "TinkerCAD", src: "/logos/tinkercad.svg" },
  { name: "Arduino", src: "/logos/arduino.svg" },
  { name: "Raspberry Pi", src: "/logos/raspberrypi.svg" },
  { name: "PrusaSlicer", src: "/logos/prusaslicer.svg" },
];

/**
 * Renders either the brand logo image or a styled text pill fallback
 * if the image fails to load (or is missing from /public/logos/).
 *
 * The text fallback is displayed inside a bordered pill that visually fits the
 * editorial aesthetic, so missing files don't show as broken-image icons.
 */
function LogoItem({ logo }) {
  const [broken, setBroken] = useState(false);

  // Hide image entirely once we know it's broken (browser still shows the alt-text icon
  // briefly otherwise). Setting display:none on error guarantees clean fallback.
  const inner = broken ? (
    <span className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-current/30 px-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text)] sm:h-12 sm:text-xs md:h-14">
      {logo.name}
    </span>
  ) : (
    <img
      src={logo.src}
      alt={logo.name}
      title={logo.name}
      className="h-10 w-auto max-w-[10rem] object-contain sm:h-12 md:h-14"
      onError={(e) => {
        // Hide image immediately so the broken-image icon never paints,
        // then trigger fallback render.
        e.currentTarget.style.display = "none";
        setBroken(true);
      }}
    />
  );

  const className =
    "logo-hit opacity-50 saturate-[0.7] transition-all duration-300 hover:scale-105 hover:opacity-100 hover:saturate-100";

  if (logo.url) {
    return (
      <a
        href={logo.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${className} inline-flex cursor-default`}
        title={logo.name}
      >
        {inner}
      </a>
    );
  }

  return (
    <span className={`${className} inline-flex cursor-default`} title={logo.name}>
      {inner}
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
