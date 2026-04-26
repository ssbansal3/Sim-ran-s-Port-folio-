"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Bebas_Neue } from "next/font/google";
import Footer from "../components/Footer";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function WorkPage() {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const contentRef = useRef(null);

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
        <main
          style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ textAlign: "center" }}>
            <p className={`${bebas.className} text-[var(--text)]`} style={{ fontSize: "clamp(3rem,10vw,8rem)" }}>
              COMING SOON
            </p>
            <p style={{ color: "var(--muted)" }}>Projects & experience — coming soon</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
