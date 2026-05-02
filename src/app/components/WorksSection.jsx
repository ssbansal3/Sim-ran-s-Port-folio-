"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import LogoMarquee from "./LogoMarquee";
import HoverWords, { WordSpan, WORK_WORDS } from "./HoverWords";

/**
 * Inverted full-viewport preview linking to the Works route.
 * ScrollTrigger: first visit runs letter drop + a single demo hover word; revisits echo-scale the CTA.
 */
export default function WorksSection() {
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const demoIdRef = useRef(null);
  const [demoWord, setDemoWord] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const runEchoAnimation = useCallback(() => {
    const anchor = sectionRef.current?.querySelector(".magnetic-button-anchor");
    if (!anchor) return;
    gsap
      .timeline()
      .to(anchor, { scale: 1.04, duration: 0.2, ease: "power2.out" })
      .to(anchor, { scale: 1, duration: 0.2, ease: "power2.in" });
  }, []);

  const runFullEntrance = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const letters = section.querySelectorAll("[data-mb-letter]");

    gsap.fromTo(
      letters,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.04,
        ease: "power3.out",
      }
    );

    window.setTimeout(() => {
      const anchor = section.querySelector(".magnetic-button-anchor");
      if (!anchor) return;
      const ar = anchor.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      const id = `demo-${Date.now()}`;
      demoIdRef.current = id;
      const text = WORK_WORDS[Math.floor(Math.random() * WORK_WORDS.length)];
      setDemoWord({
        id,
        text,
        x: ar.left + ar.width / 2 - sr.left,
        y: ar.top + ar.height * 0.22 - sr.top,
        rotation: -10 + Math.random() * 20,
        scale: 0.95 + Math.random() * 0.15,
      });
    }, 1000);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const letters = section.querySelectorAll("[data-mb-letter]");
    gsap.set(letters, { y: -100, opacity: 0 });
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      onEnter: () => {
        if (!hasAnimatedRef.current) {
          runFullEntrance();
          hasAnimatedRef.current = true;
        } else {
          runEchoAnimation();
        }
      },
      onEnterBack: () => {
        runEchoAnimation();
      },
    });

    return () => trigger.kill();
  }, [runEchoAnimation, runFullEntrance]);

  const clearDemo = useCallback(() => {
    setDemoWord(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme-invert
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <LogoMarquee />
      <HoverWords sectionRef={sectionRef} disabled={buttonHovered} />
      {demoWord ? <WordSpan word={demoWord} onRemove={clearDemo} /> : null}

      <div className="relative z-10">
        <MagneticButton
          text="WORKS"
          href="/work"
          onHoverChange={setButtonHovered}
        />
      </div>
    </section>
  );
}
