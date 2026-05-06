"use client";
import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

const IntroCompleteContext = createContext(false);
export function useIntroComplete() {
  return useContext(IntroCompleteContext);
}

const COPPER = "#C17A3A";
const RIPPLE_COUNT = 7;

export default function IntroAnimation({ children }) {
  const overlayRef = useRef(null);
  const dropletRef = useRef(null);
  const reboundRef = useRef(null);
  const impactFlashRef = useRef(null);
  const splashRef = useRef(null);
  const rippleRefs = useRef([]);
  const paintRef = useRef(null);
  const dripRefs = useRef([]);
  const [introComplete, setIntroComplete] = useState(false);
  const contextValue = useMemo(() => introComplete, [introComplete]);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const droplet = dropletRef.current;
    const rebound = reboundRef.current;
    const impactFlash = impactFlashRef.current;
    const splash = splashRef.current;
    const ripples = rippleRefs.current.filter(Boolean);
    const paint = paintRef.current;
    const drips = dripRefs.current.filter(Boolean);
    const pageContent = document.getElementById("page-content");

    if (!overlay || !droplet || !paint || ripples.length !== RIPPLE_COUNT || !pageContent) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The droplet's container is positioned so its bottom tip sits at exact center.
    // We animate the droplet's `y` from off-screen-top to 0 (its resting position = center).
    const startY = -(window.innerHeight / 2 + 100); // start above viewport

    // Initial states
    gsap.set(pageContent, { opacity: 0 });
    gsap.set(overlay, { display: "block", opacity: 1, y: 0 });
    gsap.set(paint, { y: 0, opacity: 1 });
    gsap.set(drips, { scaleY: 0, transformOrigin: "top center" });
    gsap.set(droplet, { y: startY, opacity: 1, scaleX: 1, scaleY: 1, transformOrigin: "50% 100%" });
    gsap.set(rebound, { y: 0, opacity: 0, scale: 0.6, transformOrigin: "50% 100%" });
    gsap.set(impactFlash, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(splash, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
    gsap.set(ripples, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });

    // Reduced motion: simple fade
    if (prefersReducedMotion) {
      const ctx = gsap.context(() => {
        gsap.timeline({ onComplete: () => setIntroComplete(true) })
          .to(overlay, { opacity: 0, duration: 0.5, ease: "power2.out" })
          .set(overlay, { display: "none" })
          .to(pageContent, { opacity: 1, duration: 0.5, ease: "power2.out" }, "<");
      });
      return () => ctx.revert();
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setIntroComplete(true) });

      // 1. brief hold — let viewer's eye settle
      tl.to({}, { duration: 0.3 })

      // 2. anticipation — droplet stretches slightly as it "lets go"
        .to(droplet, {
          scaleY: 1.18,
          scaleX: 0.9,
          duration: 0.18,
          ease: "power1.out",
        })

      // 3. heavy fall to dead-center
        .to(droplet, {
          y: 0,
          duration: 0.55,
          ease: "power3.in",
        }, ">-0.05")

      // 4. impact: droplet squashes & disappears at exact center
        .to(droplet, {
          scaleY: 0.15,
          scaleX: 1.5,
          duration: 0.07,
          ease: "power2.out",
        })
        .to(droplet, {
          opacity: 0,
          duration: 0.08,
          ease: "power1.out",
        }, ">-0.03")

      // 5. impact flash — bright bloom at landing point
        .fromTo(impactFlash,
          { scale: 0, opacity: 0.95 },
          { scale: 4, opacity: 0, duration: 0.55, ease: "power2.out" },
          "<-0.05"
        )

      // 6. splash crown — quick filled disk that punches outward then fades
        .fromTo(splash,
          { scale: 0, opacity: 0.7 },
          { scale: 1.8, opacity: 0, duration: 0.4, ease: "power2.out" },
          "<+0.02"
        )

      // 7. rebound droplet — small droplet pops up from impact and falls back
        .fromTo(rebound,
          { y: 0, opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.05, ease: "none" },
          "<+0.05"
        )
        .to(rebound, {
          y: -55,
          duration: 0.35,
          ease: "power2.out",
        }, ">-0.02")
        .to(rebound, {
          y: 0,
          duration: 0.3,
          ease: "power2.in",
        })
        .to(rebound, {
          scaleY: 0.2,
          scaleX: 1.3,
          duration: 0.06,
          ease: "power2.out",
        })
        .to(rebound, {
          opacity: 0,
          duration: 0.08,
        }, ">-0.04");

      // 8. concentric ripples — emit from impact, organic stagger like real water
      const rippleConfigs = [
        { startOpacity: 1.0,  scale: 22, duration: 1.8, delay: 0.0,  ease: "power2.out" },
        { startOpacity: 0.85, scale: 19, duration: 1.7, delay: 0.07, ease: "power2.out" },
        { startOpacity: 0.7,  scale: 16, duration: 1.6, delay: 0.16, ease: "power2.out" },
        { startOpacity: 0.55, scale: 13, duration: 1.5, delay: 0.27, ease: "power2.out" },
        { startOpacity: 0.42, scale: 11, duration: 1.4, delay: 0.40, ease: "power1.out" },
        { startOpacity: 0.3,  scale: 9,  duration: 1.3, delay: 0.55, ease: "power1.out" },
        { startOpacity: 0.2,  scale: 7,  duration: 1.2, delay: 0.72, ease: "power1.out" },
      ];

      // Anchor ripples to the moment of impact (when droplet flattens)
      const rippleAnchor = "ripple_anchor";
      tl.addLabel(rippleAnchor, "-=0.95");

      rippleConfigs.forEach((cfg, i) => {
        const ring = ripples[i];
        tl.fromTo(ring,
          { scale: 0, opacity: cfg.startOpacity },
          { scale: cfg.scale, opacity: 0, duration: cfg.duration, ease: cfg.ease },
          `${rippleAnchor}+=${cfg.delay}`
        );
      });

      // 9. paint ooze exit
      tl.to(drips, {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.in",
        stagger: { each: 0.035, from: "random" },
      }, `${rippleAnchor}+=1.0`)

        .to(pageContent, {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        }, ">-0.25")

        .to(overlay, {
          y: "110%",
          duration: 1.1,
          ease: "power2.in",
        }, "<+0.05")

        .set(overlay, { display: "none" });
    });

    return () => ctx.revert();
  }, []);

  const drips = Array.from({ length: 14 });

  return (
    <IntroCompleteContext.Provider value={contextValue}>
      {children}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[100]"
        style={{ background: "transparent" }}
        aria-hidden
      >
        {/* Paint layer — the cream surface that will ooze off */}
        <div
          ref={paintRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--bg)",
          }}
        >
          {/* Drip tongues hanging off the bottom edge */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              height: "180px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}
          >
            {drips.map((_, i) => {
              const heights = [120, 70, 160, 95, 140, 60, 175, 110, 85, 150, 75, 130, 100, 165];
              const widths  = [9, 6, 11, 7, 10, 5, 12, 8, 6, 10, 7, 9, 8, 11];
              const h = heights[i % heights.length];
              const w = widths[i % widths.length];
              return (
                <div
                  key={i}
                  ref={(el) => { dripRefs.current[i] = el; }}
                  style={{
                    width: `${w}%`,
                    height: `${h}px`,
                    background: "var(--bg)",
                    borderBottomLeftRadius: "50% 40%",
                    borderBottomRightRadius: "50% 40%",
                    marginTop: "-1px",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Visual layer — droplet, ripples, splash. All centered on screen. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Droplet container — bottom edge sits exactly at vertical center */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "32px",
              height: "44px",
              marginTop: "-44px",
              marginLeft: "-16px",
              pointerEvents: "none",
            }}
          >
            <svg
              ref={dropletRef}
              viewBox="0 0 40 56"
              style={{ width: "100%", height: "100%", overflow: "visible" }}
              aria-hidden
            >
              <defs>
                <radialGradient id="droplet-gradient" cx="35%" cy="30%" r="75%">
                  <stop offset="0%" stopColor="#E5A06A" stopOpacity="1" />
                  <stop offset="55%" stopColor={COPPER} stopOpacity="1" />
                  <stop offset="100%" stopColor="#8E5527" stopOpacity="1" />
                </radialGradient>
              </defs>
              <path
                d="M20 0 C20 0, 2 22, 2 36 C2 46.5 10.1 54 20 54 C29.9 54 38 46.5 38 36 C38 22 20 0 20 0Z"
                fill="url(#droplet-gradient)"
              />
              {/* highlight gives the droplet wet/glossy feel */}
              <ellipse cx="13" cy="32" rx="3" ry="7" fill="#FFFFFF" opacity="0.35" />
              <circle cx="15" cy="42" r="1.5" fill="#FFFFFF" opacity="0.4" />
            </svg>
          </div>

          {/* Splash crown — solid disk that punches outward at impact */}
          <div
            ref={splashRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "44px",
              height: "44px",
              marginTop: "-22px",
              marginLeft: "-22px",
              borderRadius: "50%",
              background: COPPER,
              filter: "blur(0.5px)",
            }}
          />

          {/* Impact flash — bright radial bloom */}
          <div
            ref={impactFlashRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "80px",
              height: "80px",
              marginTop: "-40px",
              marginLeft: "-40px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${COPPER} 0%, ${COPPER} 25%, rgba(193,122,58,0.4) 55%, transparent 75%)`,
            }}
          />

          {/* Concentric ripple rings — emit from exact impact point */}
          {Array.from({ length: RIPPLE_COUNT }).map((_, i) => {
            const baseSizes    = [70, 66, 62, 58, 54, 50, 46];
            const strokeWidths = [2.5, 2, 1.5, 1.25, 1, 0.85, 0.7];
            const blurs        = [0,   0, 0,   0,    0.3, 0.6, 1.0];
            const size = baseSizes[i];
            const stroke = strokeWidths[i];
            const blur = blurs[i];
            return (
              <div
                key={i}
                ref={(el) => { rippleRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${size}px`,
                  height: `${size}px`,
                  marginTop: `-${size / 2}px`,
                  marginLeft: `-${size / 2}px`,
                  border: `${stroke}px solid ${COPPER}`,
                  borderRadius: "50%",
                  background: "transparent",
                  filter: blur ? `blur(${blur}px)` : "none",
                  willChange: "transform, opacity",
                }}
              />
            );
          })}
        </div>
      </div>
    </IntroCompleteContext.Provider>
  );
}
