"use client";

import { Bebas_Neue } from "next/font/google";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "./MagneticButton";
import QuestionMarkHalo from "./QuestionMarkHalo";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

const P0 = { x: 80, y: 88 };
const P1 = { x: 250, y: 22 };
const P2 = { x: 400, y: 88 };

function quadPoint(t) {
  const mt = 1 - t;
  return {
    x: mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x,
    y: mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y,
  };
}

function quadTangentDeg(t) {
  const e = 0.01;
  const p0 = quadPoint(Math.max(0, t - e));
  const p1 = quadPoint(Math.min(1, t + e));
  return (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
}

/**
 * Gentle arc of muted copy above the CTA. Letters sit on a quadratic curve (~30° sweep).
 * Edit `P0`, `P1`, `P2` above to reshape the arc without touching layout math below.
 */
function ArchedText({ text }) {
  const chars = text.toUpperCase().split("");
  const letterCount = chars.filter((c) => c !== " ").length;
  const n = Math.max(letterCount - 1, 1);
  let letterIndex = 0;

  return (
    <div
      className="relative mx-auto mb-10 w-full max-w-[min(520px,92vw)] md:mb-14"
      style={{ height: "140px" }}
    >
      {chars.map((ch, i) => {
        if (ch === " ") {
          return (
            <span key={`sp-${i}`} className="inline-block w-[0.35em]" aria-hidden />
          );
        }
        const t = letterIndex / n;
        letterIndex += 1;
        const p = quadPoint(t);
        const rot = quadTangentDeg(t);
        return (
          <span
            key={`${ch}-${i}`}
            data-arch-letter
            className={`${bebas.className} absolute text-[clamp(1.25rem,3.5vw,2.25rem)] uppercase tracking-[0.18em] text-[var(--muted)]`}
            style={{
              left: `${(p.x / 500) * 100}%`,
              top: `${(p.y / 120) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/**
 * About preview — arched headline, "?" halo, magnetic CTA.
 */
export default function AboutSection() {
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const buttonRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [buttonHovered, setButtonHovered] = useState(false);
  const [marksEntry, setMarksEntry] = useState(false);
  const [haloReady, setHaloReady] = useState(false);

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

    const archLetters = section.querySelectorAll("[data-arch-letter]");
    const btnLetters = section.querySelectorAll("[data-mb-letter]");

    const tl = gsap.timeline();

    tl.fromTo(
      archLetters,
      { y: -16, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.035,
        ease: "power2.out",
      }
    );

    tl.add(() => setMarksEntry(true), "+=0.05");

    tl.fromTo(
      btnLetters,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.04,
        ease: "power3.out",
      },
      "+=0.15"
    );
  }, []);

  // Pre-set hidden states for entrance animation.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const archLetters = section.querySelectorAll("[data-arch-letter]");
    const btnLetters = section.querySelectorAll("[data-mb-letter]");
    gsap.set(archLetters, { y: -16, opacity: 0 });
    gsap.set(btnLetters, { y: -100, opacity: 0 });
  }, []);

  // Mark halo as ready to measure after first paint completes.
  // The button is displaced (y:-100) but its bounding box reflects layout, not transforms,
  // so we wait one frame to ensure the layout is fully resolved and any fonts are loaded.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      // Double-rAF to ensure layout has fully settled (font swap, image load, etc.)
      window.requestAnimationFrame(() => setHaloReady(true));
    });
    return () => window.cancelAnimationFrame(id);
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

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-20 bg-gradient-to-b from-[var(--surface)] to-transparent" />

      <div
        ref={stackRef}
        className="relative flex min-h-[55vh] w-full max-w-4xl flex-col items-center justify-center px-4"
      >
        <ArchedText text="WHO   IS   THIS   GUY" />

        {haloReady ? (
          <QuestionMarkHalo
            sectionRef={sectionRef}
            stackRef={stackRef}
            buttonRef={buttonRef}
            excited={buttonHovered}
            entrySignal={marksEntry}
          />
        ) : null}

        <div className="relative z-10">
          <MagneticButton
            ref={buttonRef}
            text="ABOUT ME"
            href="/about"
            sizeClass="text-[clamp(6rem,16vw,12rem)]"
            onHoverChange={setButtonHovered}
          />
        </div>
      </div>
    </section>
  );
}
