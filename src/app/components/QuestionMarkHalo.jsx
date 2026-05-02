"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Hand-drawn question mark variants. Each is drawn in a 64x80 viewBox.
 * Variants alternate between "filled/chunky" and "hatched/sketchy" looks
 * to mimic the inked-and-shaded vibe of the reference illustration.
 */
const QM_VARIANTS = [
  // 0 — chunky filled
  {
    hook: "M 18 22 C 18 8, 50 6, 50 22 C 50 32, 36 36, 32 44 L 32 54",
    strokeWidth: 6,
    fillHatch: false,
    dot: { cx: 32, cy: 68, r: 5.5 },
  },
  // 1 — slimmer with hatch shading
  {
    hook: "M 16 24 C 16 10, 48 8, 50 22 C 51 30, 36 36, 32 44 L 32 54",
    strokeWidth: 4.5,
    fillHatch: true,
    dot: { cx: 32, cy: 68, r: 4.5 },
  },
  // 2 — wide squat
  {
    hook: "M 14 26 C 14 6, 52 4, 52 24 C 52 34, 36 38, 32 46 L 32 54",
    strokeWidth: 6.5,
    fillHatch: false,
    dot: { cx: 32, cy: 68, r: 6 },
  },
  // 3 — tall slim hatched
  {
    hook: "M 20 20 C 20 8, 46 6, 46 20 C 46 30, 34 34, 32 42 L 32 54",
    strokeWidth: 4,
    fillHatch: true,
    dot: { cx: 32, cy: 68, r: 4 },
  },
];

// Layout tuning — adjust these to reshape the halo without touching anything else.
const COUNT = 16;
const ARC_START = 195; // degrees (lower-left)
const ARC_END = 345;   // degrees (lower-right)
const RADIUS_MIN = 240; // minimum distance from button center
const RADIUS_MAX = 380; // maximum distance from button center
const BUTTON_CLEARANCE_X = 40; // extra horizontal padding around button rect
const BUTTON_CLEARANCE_Y = 30; // extra vertical padding around button rect

/**
 * Place 16 marks around the upper arch of the button.
 * Each candidate point is pushed radially outward if its bounding box would overlap
 * the (inflated) button or arched-text rect.
 */
function buildMarks({ stackW, stackH, bx, by, btnHalfW, btnHalfH, archBottom }) {
  const list = [];

  // Inflate the button rect — marks must not enter this zone.
  const exclX = btnHalfW + BUTTON_CLEARANCE_X;
  const exclY = btnHalfH + BUTTON_CLEARANCE_Y;

  for (let i = 0; i < COUNT; i++) {
    const t = i / (COUNT - 1);
    const angleDeg = ARC_START + (ARC_END - ARC_START) * t + (Math.random() * 8 - 4);
    const rad = (angleDeg * Math.PI) / 180;

    let r = RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN);

    const baseRotation = angleDeg - 270 + (Math.random() * 24 - 12);
    const scale = 0.55 + Math.random() * 0.85;
    const w = 48 * scale;
    const h = 60 * scale;

    // Iteratively push outward until the mark's bbox clears the button + arch text.
    let x, y;
    let safety = 0;
    while (safety < 12) {
      x = bx + r * Math.cos(rad);
      y = by + r * Math.sin(rad);

      const dx = Math.abs(x - bx);
      const dy = Math.abs(y - by);
      const overlapsButton = dx < exclX + w / 2 && dy < exclY + h / 2;
      const overlapsArch =
        archBottom != null && y - h / 2 < archBottom + 8 && y < by; // only above button

      if (!overlapsButton && !overlapsArch) break;
      r += 24; // push further out and retry
      safety += 1;
    }

    // Final clamp to stack bounds.
    const pad = 12;
    x = Math.min(Math.max(x, pad + w / 2), stackW - pad - w / 2);
    y = Math.min(Math.max(y, pad + h / 2), stackH - pad - h / 2);

    list.push({
      id: `qm-${i}`,
      relX: x,
      relY: y,
      baseRotation,
      variant: i % QM_VARIANTS.length,
      w,
      h,
    });
  }
  return list;
}

function QMSvg({ variant }) {
  const v = QM_VARIANTS[variant];
  return (
    <svg
      viewBox="0 0 64 80"
      className="h-full w-full overflow-visible"
      fill="none"
      aria-hidden
    >
      <path
        d={v.hook}
        stroke="currentColor"
        strokeWidth={v.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {v.fillHatch && (
        <g
          stroke="currentColor"
          strokeWidth={v.strokeWidth * 0.4}
          strokeLinecap="round"
          opacity={0.85}
        >
          <line x1="22" y1="14" x2="28" y2="20" />
          <line x1="26" y1="12" x2="34" y2="20" />
          <line x1="32" y1="12" x2="40" y2="20" />
          <line x1="38" y1="14" x2="44" y2="22" />
          <line x1="29" y1="38" x2="33" y2="44" />
          <line x1="32" y1="36" x2="33" y2="50" />
        </g>
      )}
      <circle cx={v.dot.cx} cy={v.dot.cy} r={v.dot.r} fill="currentColor" />
    </svg>
  );
}

function Mark({ cfg, reducedMotion, isTouch, sectionRef, excited }) {
  const rootRef = useRef(null);
  const idleRef = useRef(null);
  const cursorRef = useRef(null);
  const idleTlRef = useRef(null);
  const rotToRef = useRef(null);
  const baseRot = cfg.baseRotation;

  useLayoutEffect(() => {
    const idle = idleRef.current;
    const cursor = cursorRef.current;
    if (!idle || !cursor) return;

    gsap.set(cursor, { rotation: baseRot });

    if (reducedMotion || isTouch) return;

    const dur = 3 + Math.random() * 2;
    const delay = Math.random() * 2;
    const half = dur / 2;
    const tl = gsap.to(idle, {
      keyframes: [
        { y: -4, duration: half, ease: "sine.inOut" },
        { y: 4, duration: half, ease: "sine.inOut" },
      ],
      repeat: -1,
      delay,
    });
    idleTlRef.current = tl;

    rotToRef.current = gsap.quickTo(cursor, "rotation", {
      duration: 0.35,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
      idleTlRef.current = null;
      rotToRef.current = null;
    };
  }, [baseRot, reducedMotion, isTouch]);

  useEffect(() => {
    if (reducedMotion || isTouch || !sectionRef?.current) return;

    const onMove = (e) => {
      const root = rootRef.current;
      const cursor = cursorRef.current;
      const rotTo = rotToRef.current;
      if (!root || !cursor || !rotTo) return;
      const mr = root.getBoundingClientRect();
      const mx = mr.left + mr.width / 2;
      const my = mr.top + mr.height / 2;
      const dx = e.clientX - mx;
      const dy = e.clientY - my;
      const dist = Math.hypot(dx, dy);
      if (dist > 250) {
        rotTo(baseRot);
        return;
      }
      const tilt = dx > 0 ? 8 : -8;
      rotTo(baseRot + tilt);
    };

    const sec = sectionRef.current;
    sec?.addEventListener("mousemove", onMove);
    return () => sec?.removeEventListener("mousemove", onMove);
  }, [sectionRef, baseRot, reducedMotion, isTouch]);

  useEffect(() => {
    if (!excited || reducedMotion || isTouch) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    gsap
      .timeline()
      .to(cursor, { rotation: baseRot + 5, duration: 0.08, ease: "power1.out" })
      .to(cursor, { rotation: baseRot - 5, duration: 0.1, ease: "power1.inOut" })
      .to(cursor, { rotation: baseRot + 3, duration: 0.08, ease: "power1.inOut" })
      .to(cursor, { rotation: baseRot, duration: 0.12, ease: "power2.out" });
  }, [excited, baseRot, reducedMotion, isTouch]);

  return (
    <span
      ref={rootRef}
      data-q-mark
      className="pointer-events-none absolute text-[var(--text)]"
      style={{
        left: cfg.relX,
        top: cfg.relY,
        width: cfg.w,
        height: cfg.h,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span
        ref={idleRef}
        className="inline-flex h-full w-full items-center justify-center will-change-transform"
      >
        <span
          ref={cursorRef}
          className="inline-flex h-full w-full items-center justify-center will-change-transform"
        >
          <QMSvg variant={cfg.variant} />
        </span>
      </span>
    </span>
  );
}

/**
 * Decorative "?" halo above the About CTA. Polar placement around the button center,
 * with a clearance check that pushes marks outward if they would overlap the button
 * or the arched headline above it.
 */
export default function QuestionMarkHalo({
  sectionRef,
  stackRef,
  buttonRef,
  excited,
  entrySignal,
}) {
  const wrapRef = useRef(null);
  const [marks, setMarks] = useState([]);
  const playedEntryRef = useRef(false);

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const isTouch = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
    []
  );

  useLayoutEffect(() => {
    const stack = stackRef?.current;
    const btn = buttonRef?.current;
    if (!stack || !btn) return;

    // Strip GSAP transform so we measure resting layout, not displaced state.
    const savedTransform = btn.style.transform;
    const savedTransition = btn.style.transition;
    btn.style.transform = "none";
    btn.style.transition = "none";
    void btn.offsetHeight;

    const sr = stack.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const bx = br.left + br.width / 2 - sr.left;
    const by = br.top + br.height / 2 - sr.top;
    const btnHalfW = br.width / 2;
    const btnHalfH = br.height / 2;

    // Find arched-text bottom (so marks don't overlap "WHO IS THIS GUY").
    const archEl = stack.querySelector("[data-arch-letter]");
    let archBottom = null;
    if (archEl) {
      // Find the lowest bottom across all arch letters.
      const archLetters = stack.querySelectorAll("[data-arch-letter]");
      let maxBottom = -Infinity;
      archLetters.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > maxBottom) maxBottom = r.bottom;
      });
      archBottom = maxBottom - sr.top;
    }

    btn.style.transform = savedTransform;
    btn.style.transition = savedTransition;

    setMarks(
      buildMarks({
        stackW: sr.width,
        stackH: sr.height,
        bx,
        by,
        btnHalfW,
        btnHalfH,
        archBottom,
      })
    );
  }, [stackRef, buttonRef]);

  useEffect(() => {
    if (!entrySignal || !marks.length || playedEntryRef.current) return;
    playedEntryRef.current = true;

    const wrap = wrapRef.current;
    if (!wrap) return;
    const els = wrap.querySelectorAll("[data-q-mark]");

    if (reducedMotion || isTouch) {
      gsap.set(els, { opacity: 1, scale: 1 });
      return;
    }

    gsap.fromTo(
      els,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.5)",
        stagger: { amount: 0.45, from: "random" },
      }
    );
  }, [entrySignal, marks, reducedMotion, isTouch]);

  // Hide marks until entry plays — prevents flash before stagger animation.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !marks.length) return;
    const els = wrap.querySelectorAll("[data-q-mark]");
    if (reducedMotion || isTouch) return;
    gsap.set(els, { opacity: 0, scale: 0 });
  }, [marks, reducedMotion, isTouch]);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0">
      {marks.map((cfg) => (
        <Mark
          key={cfg.id}
          cfg={cfg}
          reducedMotion={reducedMotion}
          isTouch={isTouch}
          sectionRef={sectionRef}
          excited={excited}
        />
      ))}
    </div>
  );
}
