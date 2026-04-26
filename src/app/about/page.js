"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import About from "../components/About";
import Footer from "../components/Footer";

export default function AboutPage() {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    gsap.set(overlay, { y: "100%", display: "block" });
    gsap.set(content, { opacity: 0 });

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(overlay, { y: "0%", duration: 0.5, ease: "power2.inOut" })
        .set(overlay, { display: "none" })
        .to(content, { opacity: 1, duration: 0.4, ease: "power1.out" });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        style={{ position: "fixed", inset: 0, zIndex: 90, background: "#1B2A4A" }}
      />
      <div ref={contentRef}>
        <About />
        <Footer />
      </div>
    </>
  );
}
