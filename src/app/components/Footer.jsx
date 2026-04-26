"use client";

import { useEffect, useMemo, useState } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Works" },
  { id: "timeline", label: "Timeline" },
  { id: "about", label: "About" },
];

const marqueeItems = Array.from({ length: 12 }, (_, i) => `LET'S CHAT-${i}`);

export default function Footer() {
  const [estTime, setEstTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Toronto",
    });

    const tick = () => setEstTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const marqueeRow = useMemo(
    () =>
      marqueeItems.map((item) => (
        <span key={item} className="inline-flex items-center px-3 py-0">
          <span>LET&apos;S CHAT</span>
          <span className="ml-5 text-[0.4em]">✦</span>
        </span>
      )),
    []
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="mt-auto w-full bg-[var(--text)] text-[var(--bg)]">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .footer-marquee-track {
          animation: marquee 70s linear infinite;
        }
        .footer-marquee:hover .footer-marquee-track {
          animation-play-state: paused;
        }
      `}</style>
      
      <div
          className="flex items-center justify-center gap-4 border-t border-[var(--bg)]/20"
          style={{ padding: "24px 5vw" }}
        >
          <span style={{ flex: 1, height: "0.5px", background: "var(--bg)", opacity: 0.2 }} />
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`${bebas.className} text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.2em] text-[var(--bg)] opacity-60 transition hover:opacity-100`}
          >
            BACK TO TOP
          </button>
          <span style={{ flex: 1, height: "0.5px", background: "var(--bg)", opacity: 0.2 }} />
      </div>

      <div
        className={`${bebas.className} overflow-hidden leading-none text-[#fff]`}
        style={{
          background: "#C17A3A",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <div className="footer-marquee">
          <div className="footer-marquee-track flex w-max whitespace-nowrap text-[clamp(10rem,14vw,13rem)] uppercase">
            <span className="inline-flex">{marqueeRow}</span>
            <span className="inline-flex">{marqueeRow}</span>
          </div>
        </div>
        <div style={{ height: "0.5px", background: "var(--bg)", opacity: 0.2, margin: "0 5vw" }} />
      </div>

      <div className="bg-[var(--text)] border-t border-[var(--bg)]/20">
        <div
          className="grid gap-12"
          style={{ gridTemplateColumns: "1fr 1fr", padding: "48px 5vw" }}
        >
          <div>
          <p className={`${bebas.className} mb-3 text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.15em] text-[var(--bg)]`}>(CONTACT)</p>
          <div style={{ height: "0.5px", background: "var(--bg)", opacity: 0.2, marginBottom: "24px" }} />
            <div className={`${bebas.className} flex flex-col gap-2 text-[clamp(1.5rem,4vw,3rem)] uppercase leading-none`}>
              <a
                href="mailto:ssbansal731@gmail.com"
                className="text-[var(--bg)] transition hover:opacity-70"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/simransb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--bg)] transition hover:opacity-70"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/ssbansal3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--bg)] transition hover:opacity-70"
              >
                GitHub
              </a>
              <a href="/resume.pdf" className="text-[var(--bg)] transition hover:opacity-70">
                Resume
              </a>
            </div>
          </div>

          <div>
          <p className={`${bebas.className} mb-3 text-right text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.15em] text-[var(--bg)]`}>(NAVIGATION)</p>
          <div style={{ height: "0.5px", background: "var(--bg)", opacity: 0.2, marginBottom: "24px" }} />
            <div className={`${bebas.className} flex flex-col items-end gap-2 text-[clamp(1.5rem,4vw,3rem)] uppercase leading-none`}>
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  className="w-fit text-right text-[var(--bg)] transition hover:opacity-70"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        

        <div
          className="flex items-center justify-between"
          style={{ borderTop: "0.5px solid color-mix(in srgb, var(--bg) 20%, transparent)", padding: "16px 5vw" }}
        >
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--bg)] opacity-60">
            <span className="nav-dot-pulse text-[var(--accent)]">●</span>
            <span>OSHAWA, ON</span>
            <span>{estTime} EST</span>
          </span>
          
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--bg)] opacity-60">
            © 2026 Simran Bansal
          </span>
        </div>
      </div>
    </footer>
  );
}
