"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Bebas_Neue } from "next/font/google";
import { useIntroComplete } from "./IntroAnimation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

const DISPLAY_NAME = "SIMRAN BANSAL";

// ── Tagline bank ──────────────────────────────────────────────────────────────
// Add, remove, or reorder lines freely. They cycle randomly.
const TAGLINES = [
  "Just an Engineer on a mission to collect as many hobbies as possible.",
  "An Engineer who values communication skills.",
  "Computer Engineering student by day, hobbyist by night.",
  "Automotive manager who couldn't pick between torque specs and TypeScript.",
  "If it looks interesting, I'm probably learning it.",
  "I love talking to people... about anything and everything.",
  "I DO NOT HAVE ADHD!",
  "Proffesional Yapper",
  "\"The expert in anything was once a beginner.\" - Helen Hayes",
  "\"Jack of all trades, master of none (often times better than the master of one).\"",
  "\"Be Bold!\" - Jay Card",
  "\"Our life is shaped by our mind, for we become what we think.\" - Buddha",
];
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_SPEED = 35;       // ms per character
const WORD_PAUSE = 130;      // extra ms after a space
const HOLD_DURATION = 1250;  // ms to hold the completed line before deleting
const DELETE_SPEED = 18;     // ms per character when deleting

export default function Hero() {
  const introComplete = useIntroComplete();
  const rootRef = useRef(null);
  const nameBlockRef = useRef(null);
  const scrollRef = useRef(null);
  const rollTargetsRef = useRef([]);
  const hasAnimatedRef = useRef(false);
  const timelineRef = useRef(null);

  const [typedTagline, setTypedTagline] = useState("");
  const [shouldType, setShouldType] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  // ── Set initial hidden states ──────────────────────────────────────────────
  useLayoutEffect(() => {
    const nameBlock = nameBlockRef.current;
    const scroll = scrollRef.current;
    if (!nameBlock || !scroll) return;
    const nodes = nameBlock.querySelectorAll("[data-roll-inner]");
    rollTargetsRef.current = Array.from(nodes);
    gsap.set(rollTargetsRef.current, { yPercent: 0 });
    gsap.set(nameBlock, { opacity: 0, y: 120, scale: 0.85 });
    gsap.set(scroll, { opacity: 0 });
  }, []);

  // ── Per-letter roll ────────────────────────────────────────────────────────
  const playRoll = useCallback((forward) => {
    const targets = rollTargetsRef.current;
    if (!targets.length) return;
    gsap.to(targets, {
      yPercent: forward ? -50 : 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: forward ? 0.03 : { each: 0.03, from: "end" },
      overwrite: "auto",
    });
  }, []);

  // ── Hero entrance — fires once after intro ─────────────────────────────────
  // ── Hero entrance — fires every time section enters viewport ─────────────────
useEffect(() => {
  if (!introComplete) return;

  const nameBlock = nameBlockRef.current;
  const section = rootRef.current;
  if (!nameBlock || !section) return;

  const runAnimation = () => {
    setTypedTagline("");
    setShouldType(false);
    setTypingDone(false);

    gsap.set(nameBlock, { opacity: 0, y: 120, scale: 0.85 });

    const delay = !hasAnimatedRef.current ? 500 : 0;
    const tl = gsap.timeline();
    timelineRef.current = tl;
    window.setTimeout(() => {

      tl
        .to(nameBlock, { y: 0, opacity: 1, scale: 1.08, duration: 0.5, ease: "power3.out" })
        .to(nameBlock, { scale: 1, duration: 0.15, ease: "power2.in" })
        .call(() => playRoll(true))
        .call(() => playRoll(false), null, "+=0.4")
        .call(() => setShouldType(true), null, "+=0.3");
      }, delay);
    };

  // ScrollTrigger for replays when navigating back
  const st = ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    end: "bottom top",
    onEnter: () => runAnimation(),
    onEnterBack: () => runAnimation(),
    onLeave: () => {
      timelineRef.current?.kill();
      gsap.set(nameBlock, { opacity: 0, y: 120, scale: 0.85 });
      gsap.set(scrollRef.current, { opacity: 0 });
    },
    onLeaveBack: () => {
      timelineRef.current?.kill();
      gsap.set(nameBlock, { opacity: 0, y: 120, scale: 0.85 });
      gsap.set(scrollRef.current, { opacity: 0 });
    },
  });

  return () => {
    timelineRef.current?.kill();
    st.kill();
  };
}, [introComplete, playRoll]);

  // ── Rotating typewriter ────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldType) return;

    let taglineIndex = 0;
    let charIndex = 0;
    let phase = "typing"; // "typing" | "holding" | "deleting"
    let timeoutId = null;

    const tick = () => {
      const current = TAGLINES[taglineIndex];

      if (phase === "typing") {
        if (charIndex <= current.length) {
          setTypedTagline(current.slice(0, charIndex));
          const ch = current[charIndex - 1];
          charIndex++;
          timeoutId = window.setTimeout(tick, ch === " " ? WORD_PAUSE : TYPE_SPEED);
        } else {
          // finished typing — hold then delete
          phase = "holding";
          setTypingDone(true);
          timeoutId = window.setTimeout(tick, HOLD_DURATION);
        }

      } else if (phase === "holding") {
        phase = "deleting";
        tick();

      } else if (phase === "deleting") {
        if (charIndex > 0) {
          charIndex--;
          setTypedTagline(current.slice(0, charIndex));
          timeoutId = window.setTimeout(tick, DELETE_SPEED);
        } else {
          // move to next tagline
          taglineIndex = Math.floor(Math.random() * TAGLINES.length);
          charIndex = 0;
          phase = "typing";
          setTypingDone(false);
          timeoutId = window.setTimeout(tick, 300);
        }
      }
    };

    tick();
    return () => { if (timeoutId) window.clearTimeout(timeoutId); };
  }, [shouldType]);

  // ── Scroll indicator fades in after first type completes ──────────────────
  useEffect(() => {
    if (!typingDone || !scrollRef.current) return;
    gsap.to(scrollRef.current, {
      opacity: 1, duration: 0.5, ease: "power1.out", overwrite: "auto",
    });
  }, [typingDone]);

  return (
    <section
      id="home"
      ref={rootRef}
      className="relative flex min-h-[100dvh] h-[100dvh] scroll-mt-16 flex-col overflow-x-clip"
    >
      <div className="flex flex-1 flex-col items-center justify-center px-2 sm:px-4">
        <h1
          ref={nameBlockRef}
          className={`${bebas.className} w-screen max-w-[100dvw] cursor-default select-none whitespace-nowrap text-center text-[clamp(6rem,20vw,20rem)] uppercase leading-none tracking-tight text-[var(--text)]`}
          aria-label="Simran Bansal"
        >
          {DISPLAY_NAME.split("").map((char, i) => (
            <span
              key={`${char}-${i}`}
              style={{ display: "inline-block", overflow: "hidden", height: "1em", verticalAlign: "top" }}
              onMouseEnter={() => {
                const inner = rollTargetsRef.current[i];
                if (inner) gsap.to(inner, { yPercent: -50, duration: 0.4, ease: "power2.out", overwrite: "auto" });
              }}
              onMouseLeave={() => {
                const inner = rollTargetsRef.current[i];
                if (inner) gsap.to(inner, { yPercent: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
              }}
            >
              <span
                data-roll-inner
                ref={(el) => { if (el) rollTargetsRef.current[i] = el; }}
                className="flex flex-col"
                style={{ willChange: "transform" }}
              >
                <span className="block leading-none">{char === " " ? "\u00A0" : char}</span>
                <span className="block leading-none">{char === " " ? "\u00A0" : char}</span>
              </span>
            </span>
          ))}
        </h1>

        <p className="mt-5 max-w-3xl text-center text-[clamp(0.75rem,2.2vw,1rem)] font-light leading-relaxed text-[var(--muted)] sm:mt-6">
          {typedTagline}
          {shouldType && (
            <span
              className="hero-cursor ml-px inline-block h-[1em] w-px translate-y-[0.12em] bg-[var(--muted)] align-middle sm:h-[1.05em]"
              aria-hidden
            />
          )}
        </p>
      </div>

      <div
        ref={scrollRef}
        className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--muted)] sm:bottom-10"
      >
        <span className="text-[0.625rem] font-medium uppercase tracking-[0.25em] sm:text-xs">
          Scroll
        </span>
        <span className="hero-scroll-bob inline-flex" aria-hidden>
          <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    </section>
  );
}