"use client";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Bebas_Neue } from "next/font/google";
import Footer from "../components/Footer";
import { EXPERIENCE, EARLIER_EXPERIENCE, PROJECTS } from "./data";
import InfoRow from "./InfoRow";
import FilterRow from "./FilterRow";
import TileGrid from "./TileGrid";
import Modal from "./Modal";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function WorkPage() {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const contentRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [openTile, setOpenTile] = useState(null);

  useLayoutEffect(() => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    const content = contentRef.current;
    if (!leftPanel || !rightPanel || !content) return;

    gsap.set(leftPanel, { x: 0, display: "block" });
    gsap.set(rightPanel, { x: 0, display: "block" });
    gsap.set(content, { opacity: 0 });

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(leftPanel, { x: "-100%", duration: 0.65, ease: "power2.inOut" }, 0)
        .to(rightPanel, { x: "100%", duration: 0.65, ease: "power2.inOut" }, 0)
        .set([leftPanel, rightPanel], { display: "none" })
        .to(content, { opacity: 1, duration: 0.5, ease: "power1.out" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={leftPanelRef}
        style={{ position: "fixed", top: 0, bottom: 0, left: 0, width: "50vw", zIndex: 90, background: "#2D1B4A" }}
      />
      <div
        ref={rightPanelRef}
        style={{ position: "fixed", top: 0, bottom: 0, right: 0, width: "50vw", zIndex: 90, background: "#2D1B4A" }}
      />
      <div ref={contentRef}>
        <main className="min-h-screen bg-[var(--bg)] px-8 pb-24">
          <header className="flex flex-col justify-between gap-6 border-b border-[var(--border)] pb-8 pt-12 md:flex-row md:items-start">
            <h1
              className={`${bebas.className} leading-none text-[var(--text)]`}
              style={{ fontSize: "clamp(3rem,8vw,6rem)" }}
            >
              SIMRAN BANSAL
            </h1>
            <div className="flex flex-col gap-2 text-sm text-[var(--muted)]">
              <a
                href="mailto:ssbansal731@gmail.com"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                ssbansal731@gmail.com ↗
              </a>
              <a
                href="https://linkedin.com/in/simransb"
                target="_blank"
                rel="noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                linkedin.com/in/simransb ↗
              </a>
            </div>
          </header>

          <InfoRow />

          <FilterRow activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          <section>
            <h2
              className={`${bebas.className} mb-6 mt-12 text-2xl tracking-widest text-[var(--muted)]`}
            >
              EXPERIENCE
            </h2>
            <TileGrid tiles={EXPERIENCE} activeFilter={activeFilter} onTileClick={setOpenTile} />
          </section>

          <section>
            <h2
              className={`${bebas.className} mb-6 mt-12 text-2xl tracking-widest text-[var(--muted)]`}
            >
              PROJECTS
            </h2>
            <TileGrid
              tiles={PROJECTS}
              activeFilter={activeFilter}
              onTileClick={setOpenTile}
            />
          </section>

          <section>
            <h2
              className={`${bebas.className} mb-6 mt-12 text-2xl tracking-widest text-[var(--muted)]`}
            >
              EARLIER EXPERIENCE
            </h2>
            <TileGrid tiles={EARLIER_EXPERIENCE} activeFilter={activeFilter} onTileClick={setOpenTile} />
          </section>
        </main>
        <Footer />
        <Modal tile={openTile} onClose={() => setOpenTile(null)} />
      </div>
    </>
  );
}
