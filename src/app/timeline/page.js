"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });

export default function TimelinePage() {
  const overlayRef = useRef(null);
  const tape1Ref = useRef(null);
  const tape2Ref = useRef(null);
  const warningRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = null;

    const timerId = window.setTimeout(() => {
      const overlay = overlayRef.current;
      const tape1 = tape1Ref.current;
      const tape2 = tape2Ref.current;
      const warning = warningRef.current;
      if (!overlay || !tape1 || !tape2 || !warning) return;

      gsap.set(overlay, { x: "-100%" });
      gsap.set(tape1, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(tape2, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(warning, {
        y: -600,
        rotate: -4,
        opacity: 0,
        visibility: "hidden",
      });

      ctx = gsap.context(() => {
        gsap
          .timeline()
          .to(overlay, { x: "0%", duration: 0.6, ease: "power2.out" })
          .to({}, { duration: 0.3 })
          .to(overlay, { x: "100%", duration: 0.6, ease: "power2.in" })
          .to(tape1, { scaleX: 1, duration: 0.5, ease: "power3.out" })
          .to(tape2, { scaleX: 1, duration: 0.5, ease: "power3.out" }, "+=0.15")
          .set(warning, { opacity: 1, visibility: "visible" }, "+=0.2")
          .to(warning, { y: 0, duration: 0.45, ease: "power4.out" })
          .to(warning, { y: -12, duration: 0.1, ease: "power2.inOut" })
          .to(warning, { y: 0, duration: 0.2, ease: "elastic.out(1, 0.5)" });
      });
    }, 100);

    return () => {
      window.clearTimeout(timerId);
      ctx?.revert();
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--bg)]">
      <div
        ref={overlayRef}
        style={{ position: "fixed", inset: 0, zIndex: 90, background: "#5C1A2E", pointerEvents: "none" }}
      />

      <div
        ref={tape1Ref}
        style={{
          position: "fixed",
          width: "140vw",
          left: "50%",
          top: "50%",
          height: "80px",
          transform: "translate(-50%, -50%) rotate(35deg)",
          zIndex: 20,
          pointerEvents: "none",
          opacity: 0.95,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
          backgroundImage: [
            "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%)",
            "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.2) 100%)",
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)",
            "repeating-linear-gradient(90deg, #F5C518 0px, #F5C518 40px, #1a1a1a 40px, #1a1a1a 80px)",
          ].join(", "),
        }}
      />

      <div
        ref={tape2Ref}
        style={{
          position: "fixed",
          width: "140vw",
          left: "50%",
          top: "50%",
          height: "80px",
          transform: "translate(-50%, -50%) rotate(-35deg)",
          zIndex: 20,
          pointerEvents: "none",
          opacity: 0.95,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
          backgroundImage: [
            "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 40%)",
            "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.2) 100%)",
            "repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)",
            "repeating-linear-gradient(90deg, #F5C518 0px, #F5C518 40px, #1a1a1a 40px, #1a1a1a 80px)",
          ].join(", "),
        }}
      />

      <div
        ref={warningRef}
        style={{
          position: "fixed",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%) rotate(-4deg)",
          opacity: 0,
          visibility: "hidden",
          zIndex: 30,
          width: "clamp(300px, 38vw, 500px)",
          padding: "36px 44px",
          background: "#F5C518",
          border: "6px solid #1a1a1a",
          outline: "3px solid rgba(0,0,0,0.15)",
          outlineOffset: "-10px",
          borderRadius: "6px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 6px)",
          }}
        />
        <p
          className={bebas.className}
          style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", color: "#1a1a1a", lineHeight: 1.1, letterSpacing: "0.02em" }}
        >
          ⚠ THIS AREA IS UNDER DEVELOPMENT
        </p>
        <div style={{ height: "2px", background: "#1a1a1a", opacity: 0.3, margin: "12px 0" }} />
        <p className={bebas.className} style={{ fontSize: "clamp(1rem,2.5vw,1.8rem)", color: "#1a1a1a", opacity: 0.6 }}>
          PLEASE COME BACK LATER.
        </p>
      </div>
    </main>
  );
}