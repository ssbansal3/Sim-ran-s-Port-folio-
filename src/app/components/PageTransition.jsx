"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";

const PageTransitionContext = createContext(null);

export function PageTransitionProvider({ children }) {
  const router = useRouter();

  const navigate = useCallback(
    (href) => {
      router.push(href);
    },
    [router]
  );

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used inside PageTransitionProvider");
  return ctx;
}
