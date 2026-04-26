"use client";

import { createContext, useContext, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

const PageTransitionContext = createContext(null);

export function PageTransitionProvider({ children }) {
  const curtainRef = useRef(null);
  const router = useRouter();

  const navigate = useCallback(
    (href) => {
      const curtain = curtainRef.current;
      if (!curtain) {
        router.push(href);
        return;
      }

      gsap.set(curtain, { scaleY: 0, transformOrigin: "top center", display: "block" });
      gsap.to(curtain, {
        scaleY: 1,
        duration: 0.55,
        ease: "power3.inOut",
        onComplete: () => {
          router.push(href);
          setTimeout(() => {
            gsap.to(curtain, {
              scaleY: 0,
              transformOrigin: "bottom center",
              duration: 0.55,
              ease: "power3.inOut",
              onComplete: () => gsap.set(curtain, { display: "none" }),
            });
          }, 180);
        },
      });
    },
    [router]
  );

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      <div
        ref={curtainRef}
        style={{
          position: "fixed",
          inset: 0,
          background: "#C17A3A",
          zIndex: 9999,
          display: "none",
          transformOrigin: "top center",
        }}
      />
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside PageTransitionProvider");
  return ctx;
}
