"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Archivo_Black } from "next/font/google";

const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: ["400"] });

/** Minimum cursor travel between spawns. Bigger = fewer, more deliberate words. */
const MIN_SPAWN_DISTANCE = 140;

/**
 * Random labels that spawn while you move the cursor in the Works section.
 * Add or reorder strings freely — they are picked at random (avoiding immediate repeats).
 */
export const WORK_WORDS = [
  "ENGINEER",
  "MANAGER",
  "GEAR HEAD",
  "PROBLEM SOLVER",
  "MAKER",
  "TINKERER",
  "BUILDER",
  "DEBUGGER",
  "DESIGNER",
  "AUTOMOTIVE",
  "FULL-STACK",
  "HARDWARE",
  "EMBEDDED",
  "FIRMWARE",
  "FRONTEND",
  "BACKEND",
  "MENTOR",
  "LEARNER",
  "SHIPPER",
  "COLLABORATOR",
  "CURIOUS",
  "RELENTLESS",
  "HANDS-ON",
  "DETAIL-FIRST",
  "CRAFTSMAN",
];

function pickWord(last) {
  let next = WORK_WORDS[Math.floor(Math.random() * WORK_WORDS.length)];
  let guard = 0;
  while (next === last && guard < 8) {
    next = WORK_WORDS[Math.floor(Math.random() * WORK_WORDS.length)];
    guard += 1;
  }
  return next;
}

export function WordSpan({ word, onRemove }) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const tl = gsap.timeline({
      onComplete: () => onRemove(word.id),
    });

    tl.fromTo(
      el,
      { opacity: 0, scale: word.scale * 0.7 },
      { opacity: 0.4, scale: word.scale, duration: 0.2, ease: "back.out(1.7)" }
    )
      .to(el, { duration: 0.8 })
      .to(
        el,
        { opacity: 0, y: "-=30", duration: 0.6, ease: "power2.in" },
        ">"
      );

    return () => {
      tl.kill();
    };
  }, [word, onRemove]);

  return (
    <span
      ref={elRef}
      className={`pointer-events-none absolute select-none whitespace-nowrap uppercase ${archivoBlack.className}`}
      style={{
        left: word.x,
        top: word.y,
        zIndex: 5,
        transform: `translate(-50%, -50%) rotate(${word.rotation}deg) scale(${word.scale})`,
        color: "var(--text)",
        opacity: 0.4,
        letterSpacing: "0.02em",
        fontSize: "clamp(2rem, 4vw, 3.5rem)",
      }}
    >
      {word.text}
    </span>
  );
}

/**
 * Spawns up to 3 floating words when the cursor moves >= MIN_SPAWN_DISTANCE from the last spawn point.
 * Pass `disabled` to suppress spawning (e.g. while CTA is hovered).
 */
export default function HoverWords({ sectionRef, disabled = false }) {
  const [words, setWords] = useState([]);
  const lastSpawnRef = useRef({ x: null, y: null });
  const lastWordRef = useRef("");
  const disabledRef = useRef(disabled);

  // Keep ref in sync so the listener (added once) reads the latest value.
  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const isTouch =
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const removeWord = useCallback((id) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  }, []);

  useEffect(() => {
    if (isTouch || reduced) return;

    const section = sectionRef?.current;
    if (!section) return;

    const onMove = (e) => {
      // Skip spawning entirely when the CTA is being hovered.
      if (disabledRef.current) return;

      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left + (Math.random() * 40 - 20);
      const y = e.clientY - rect.top + (Math.random() * 40 - 20);

      const last = lastSpawnRef.current;
      if (last.x != null && last.y != null) {
        const d = Math.hypot(x - last.x, y - last.y);
        if (d < MIN_SPAWN_DISTANCE) return;
      }

      lastSpawnRef.current = { x, y };

      const text = pickWord(lastWordRef.current);
      lastWordRef.current = text;

      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `w-${Date.now()}-${Math.random()}`;

      const rotation = -18 + Math.random() * 36;
      const scale = 0.85 + Math.random() * 0.4;

      setWords((prev) => {
        const next = [
          ...prev,
          { id, text, x, y, rotation, scale, spawnedAt: Date.now() },
        ];
        if (next.length > 3) return next.slice(-3);
        return next;
      });
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [sectionRef, isTouch, reduced]);

  if (isTouch || reduced) return null;

  return (
    <>
      {words.map((w) => (
        <WordSpan key={w.id} word={w} onRemove={removeWord} />
      ))}
    </>
  );
}
