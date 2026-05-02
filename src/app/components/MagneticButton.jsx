"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";
import { Bebas_Neue } from "next/font/google";
import { usePageTransition } from "./PageTransition";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

const DEFAULT_SIZE = "text-[clamp(8rem,22vw,18rem)]";

/**
 * Giant display link with magnetic pull, Hero-style per-letter roll, and accent underline.
 * Touch / reduced-motion: static link + active opacity flash only.
 *
 * Uses `usePageTransition().navigate(href)` so the site's transition animation runs
 * instead of a hard browser navigation. Still rendered as an <a> with href so middle-click,
 * cmd/ctrl+click, "Open in new tab", and SEO crawlers all behave correctly.
 */
const MagneticButton = forwardRef(function MagneticButton(
  { text, href, sizeClass = DEFAULT_SIZE, onHoverChange },
  ref
) {
  const { navigate } = usePageTransition();
  const magWrapRef = useRef(null);
  const linkRef = useRef(null);
  const underlineRef = useRef(null);
  const rollTargetsRef = useRef([]);

  const isTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none)").matches;
  }, []);

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const skipFx = isTouch || reducedMotion;

  const xToRef = useRef(null);
  const yToRef = useRef(null);

  useLayoutEffect(() => {
    const wrap = magWrapRef.current;
    if (!wrap || skipFx) return;
    xToRef.current = gsap.quickTo(wrap, "x", { duration: 0.45, ease: "power3" });
    yToRef.current = gsap.quickTo(wrap, "y", { duration: 0.45, ease: "power3" });
    gsap.set(wrap, { x: 0, y: 0 });
  }, [skipFx]);

  useLayoutEffect(() => {
    const link = linkRef.current;
    const underline = underlineRef.current;
    if (!link || !underline) return;
    const nodes = link.querySelectorAll("[data-roll-inner]");
    rollTargetsRef.current = Array.from(nodes);
    gsap.set(rollTargetsRef.current, { yPercent: 0 });
    if (!skipFx) {
      gsap.set(underline, { scaleX: 0, transformOrigin: "left" });
    }
  }, [text, skipFx]);

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

  const setHover = useCallback(
    (v) => {
      onHoverChange?.(v);
    },
    [onHoverChange]
  );

  useEffect(() => {
    if (skipFx) return;

    const wrap = magWrapRef.current;
    const link = linkRef.current;
    const underline = underlineRef.current;
    if (!wrap || !link || !underline) return;

    const onWinMove = (e) => {
      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const xTo = xToRef.current;
      const yTo = yToRef.current;
      if (!xTo || !yTo) return;

      if (dist > 200 || dist < 1) {
        xTo(0);
        yTo(0);
        return;
      }

      const nx = dx / dist;
      const ny = dy / dist;
      const falloff = 1 - Math.min(1, dist / 200);
      const mag = 12 * falloff;
      xTo(nx * mag);
      yTo(ny * mag);
    };

    const onLeave = () => {
      const xTo = xToRef.current;
      const yTo = yToRef.current;
      xTo?.(0);
      yTo?.(0);
    };

    window.addEventListener("mousemove", onWinMove);
    link.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onWinMove);
      link.removeEventListener("mouseleave", onLeave);
    };
  }, [skipFx]);

  const onEnter = () => {
    if (skipFx) return;
    setHover(true);
    playRoll(true);
    const underline = underlineRef.current;
    if (underline) {
      gsap.set(underline, { transformOrigin: "left", scaleX: 0 });
      gsap.to(underline, { scaleX: 1, duration: 0.4, ease: "power2.out" });
    }
  };

  const onLeave = () => {
    if (skipFx) return;
    setHover(false);
    playRoll(false);
    const underline = underlineRef.current;
    if (underline) {
      gsap.set(underline, { transformOrigin: "right" });
      gsap.to(underline, { scaleX: 0, duration: 0.4, ease: "power2.out" });
    }
  };

  // Intercept normal left-clicks so we run the page transition.
  // Let modifier-clicks (cmd/ctrl/shift/middle/alt) fall through to native <a> behavior.
  const onClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  const letters = text.toUpperCase().split("");

  return (
    <div ref={magWrapRef} className="relative inline-block will-change-transform">
      <a
        ref={(node) => {
          linkRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        href={href}
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className={`magnetic-button-anchor ${bebas.className} relative inline-block cursor-pointer select-none whitespace-nowrap uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] active:opacity-70 ${sizeClass}`}
      >
        {letters.map((char, i) => (
          <span
            key={`${char}-${i}`}
            data-mb-letter
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: "1em",
              verticalAlign: "top",
            }}
          >
            <span
              data-roll-inner
              className="flex flex-col"
              style={{ willChange: "transform" }}
            >
              <span className="block leading-none">{char === " " ? "\u00A0" : char}</span>
              <span className="block leading-none">{char === " " ? "\u00A0" : char}</span>
            </span>
          </span>
        ))}
        {!skipFx ? (
          <span
            ref={underlineRef}
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-1 w-full max-w-full max-h-1 origin-left scale-x-0 bg-[var(--accent)]"
          />
        ) : null}
      </a>
    </div>
  );
});

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;
