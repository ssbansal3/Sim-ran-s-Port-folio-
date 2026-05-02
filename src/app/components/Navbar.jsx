"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";

const LINKS = [
  { id: "home", label: "Home", href: "/" },
  { id: "work", label: "Works", href: "/work" },
  { id: "timeline", label: "Timeline", href: "/timeline" },
  { id: "about", label: "About", href: "/about" },
];

const DESKTOP_LINKS = LINKS;

// Routes where the navbar is visible immediately (no scroll trigger).
const ALWAYS_VISIBLE_ROUTES = new Set(["/work", "/timeline"]);

// Threshold above which the navbar reveals on scroll-triggered routes.
const SCROLL_REVEAL_THRESHOLD = 80;

function SplitLink({ label, active, onClick }) {
  const wordRef = useRef(null);
  const letterTargetsRef = useRef([]);

  useLayoutEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const nodes = word.querySelectorAll("[data-link-letter]");
    letterTargetsRef.current = Array.from(nodes);
    gsap.set(letterTargetsRef.current, { yPercent: 0 });
  }, []);

  const animateWord = useCallback((forward) => {
    const targets = letterTargetsRef.current;
    if (!targets.length) return;
    gsap.to(targets, {
      yPercent: forward ? -50 : 0,
      duration: 0.45,
      ease: "power2.out",
      stagger: forward ? 0.03 : { each: 0.03, from: "end" },
      overwrite: "auto",
    });
  }, []);

  return (
    <button
      ref={wordRef}
      type="button"
      onClick={onClick}
      onMouseEnter={() => animateWord(true)}
      onMouseLeave={() => animateWord(false)}
      className={[
        "text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300",
        active ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]",
      ].join(" ")}
    >
      {label.split("").map((char, i) => (
        <span
          key={`${label}-${char}-${i}`}
          style={{ display: "inline-block", overflow: "hidden", height: "1em", verticalAlign: "top" }}
        >
          <span data-link-letter className="flex flex-col" style={{ willChange: "transform" }}>
            <span className="block leading-none">{char === " " ? "\u00A0" : char}</span>
            <span className="block leading-none">{char === " " ? "\u00A0" : char}</span>
          </span>
        </span>
      ))}
    </button>
  );
}

export default function Navbar() {
  const barRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [estTime, setEstTime] = useState("");
  const pathname = usePathname();
  const { navigate } = usePageTransition();
  const alwaysVisible = ALWAYS_VISIBLE_ROUTES.has(pathname);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Toronto",
    });

    const tick = () => {
      setEstTime(formatter.format(new Date()));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const active = pathname === "/" ? "home" : pathname.replace("/", "");

  const handleNavClick = useCallback(
    (e, href) => {
      e.preventDefault();
      navigate(href);
      setMenuOpen(false);
    },
    [navigate]
  );

  // Single source of truth for navbar visibility.
  // Runs on every pathname change AND binds scroll listener for scroll-triggered routes.
  // Using useLayoutEffect so the bar is positioned before paint — no flash on route change.
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    // Kill any in-flight tweens from a previous route so they don't fight us.
    gsap.killTweensOf(bar);

    if (alwaysVisible) {
      gsap.set(bar, { y: 0 });
      return; // No scroll listener needed.
    }

    // Scroll-triggered route: position based on current scrollY.
    const visible = window.scrollY > SCROLL_REVEAL_THRESHOLD;
    gsap.set(bar, { y: visible ? 0 : -100 });

    const onScroll = () => {
      const show = window.scrollY > SCROLL_REVEAL_THRESHOLD;
      gsap.to(bar, {
        y: show ? 0 : -100,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible, pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <>
      <header
        ref={barRef}
        className={`fixed top-0 left-0 right-0 w-full will-change-transform ${
          menuOpen ? "z-[70]" : "z-50"
        }`}
      >
        <nav
          className="mx-auto flex w-full items-center justify-between px-6 py-5 sm:px-10"
          aria-label="Primary"
        >
          <span className="hidden items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)] md:inline-flex">
            <span className="text-[var(--accent)] nav-dot-pulse">●</span>
            <span>OSHAWA, ON</span>
            <span>{estTime} EST</span>
          </span>

          <div className="hidden items-center justify-end gap-8 md:flex md:gap-10">
            {DESKTOP_LINKS.map(({ id, label, href }) => (
              <SplitLink
                key={id}
                label={label}
                active={active === id}
                onClick={(e) => handleNavClick(e, href)}
              />
            ))}
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-[var(--text)] transition-colors md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-overlay"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </nav>
      </header>

      <div
        id="mobile-nav-overlay"
        className={[
          "fixed inset-0 z-[60] flex flex-col bg-[var(--bg)] transition-opacity duration-300 md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <div className="h-14 shrink-0 sm:h-16" />
        <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6">
          {LINKS.map(({ id, label, href }) => (
            <button
              key={id}
              type="button"
              onClick={(e) => handleNavClick(e, href)}
              className={[
                "text-2xl font-medium uppercase tracking-[0.15em] transition-colors duration-300 sm:text-3xl",
                active === id
                  ? "text-[var(--text)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
