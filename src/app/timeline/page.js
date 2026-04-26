"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Bebas_Neue } from "next/font/google";
import Footer from "../components/Footer";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function TimelinePage() {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    gsap.set(overlay, { x: "-100%", display: "block" });
    gsap.set(content, { opacity: 0 });

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(overlay, { x: "0%", duration: 0.6, ease: "power2.out" })
        .to({}, { duration: 0.3 })
        .to(overlay, { x: "100%", duration: 0.6, ease: "power2.in" })
        .set(overlay, { display: "none" })
        .to(content, { opacity: 1, duration: 0.4, ease: "power1.out" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        style={{ position: "fixed", inset: 0, zIndex: 90, background: "#5C1A2E" }}
      >
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: 0,
            right: 0,
            height: "3px",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: 0,
            right: 0,
            height: "3px",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)",
          }}
        />
      </div>
      <div ref={contentRef}>
        <main
          style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ textAlign: "center" }}>
            <p className={`${bebas.className} text-[var(--text)]`} style={{ fontSize: "clamp(3rem,10vw,8rem)" }}>
              COMING SOON
            </p>
            <p style={{ color: "var(--muted)" }}>My journey — coming soon</p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
