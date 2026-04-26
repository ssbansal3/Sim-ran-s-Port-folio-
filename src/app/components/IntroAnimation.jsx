"use client";
import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

const IntroCompleteContext = createContext(false);
export function useIntroComplete() {
  return useContext(IntroCompleteContext);
}

export default function IntroAnimation({ children }) {
  const overlayRef = useRef(null);
  const bubbleRef = useRef(null);
  const wipeRef = useRef(null);
  const rippleRefs = useRef([]);
  const [introComplete, setIntroComplete] = useState(false);
  const contextValue = useMemo(() => introComplete, [introComplete]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const bubble = bubbleRef.current;
    const wipe = wipeRef.current;
    const ripples = rippleRefs.current;
    const pageContent = document.getElementById("page-content");

    if (!overlay || !bubble || !wipe || ripples.length !== 4 || !pageContent) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const maxScale = Math.hypot(window.innerWidth, window.innerHeight) / 24 + 2;
    const landingY = cy - 28;
    const rippleStarts = [0.9, 0.65, 0.45, 0.25];

    gsap.set(pageContent, { opacity: 0 });
    gsap.set(overlay, { display: "flex", opacity: 1 });
    gsap.set(bubble, { y: 0, opacity: 1, scale: 1, scaleX: 1, scaleY: 1 });
    gsap.set(wipe, { scale: 0, opacity: 1 });
    gsap.set(ripples, { scale: 0, opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setIntroComplete(true) });

      // 1. pause on black
      tl.to({}, { duration: 0.4 })

      // 2. drop — heavy gravity feel
        .to(bubble, {
          y: landingY,
          duration: 0.55,
          ease: "power3.in",
        })

      // 3. instant disappear on impact
      .set(bubble, { opacity: 0 });

      // 6. ripples emit from landing point
      ripples.forEach((ring, i) => {
        tl.set(ring, { scale: 0, opacity: rippleStarts[i] }, `<+${i * 0.12}`)
          .to(ring, {
            scale: 7,
            opacity: 0,
            duration: 1.4,
            ease: "power1.out",
            rotation: 30,
          }, "<");
      });

      // 7. copper wipe expands from center
      tl.to(wipe, {
        scale: maxScale,
        duration: 0.75,
        ease: "power2.inOut",
      }, "<+0.3")

      // 8. copper dissolves revealing page
        .to(overlay, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .set(overlay, { display: "none" })

      // 9. page fades in
        .to(pageContent, {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        }, "-=0.2");
    });

    return () => ctx.revert();
  }, []);

  return (
    <IntroCompleteContext.Provider value={contextValue}>
      {children}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[100] items-center justify-center"
        style={{ background: "var(--bg)", display: "flex" }}
      >
        {/* Droplet */}
        <svg
          ref={bubbleRef}
          viewBox="0 0 40 56"
          style={{
            position: "absolute",
            top: "-70px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "56px",
            fill: "#C17A3A",
          }}
          aria-hidden
        >
          <path d="M20 0 C20 0, 2 22, 2 36 C2 46.5 10.1 54 20 54 C29.9 54 38 46.5 38 36 C38 22 20 0 20 0Z" />
        </svg>

        {/* Ripple rings — centered on landing point */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { rippleRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "80px",
              height: "80px",
              marginTop: "-40px",
              marginLeft: "-40px",
              border: "1.5px solid #C17A3A",
              borderRadius: "60% 40% 55% 45% / 50% 50% 60% 40%",
              background: "transparent",
            }}
          />
        ))}

        {/* Copper wipe circle */}
        <div
          ref={wipeRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "48px",
            height: "48px",
            marginTop: "-24px",
            marginLeft: "-24px",
            borderRadius: "50%",
            background: "#C17A3A",
          }}
        />
      </div>
    </IntroCompleteContext.Provider>
  );
}