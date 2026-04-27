"use client";

import { useEffect, useState } from "react";
import { Bebas_Neue, DM_Sans } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

export default function Modal({ tile, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!tile) return;

    const frame = requestAnimationFrame(() => setIsVisible(true));

    return () => {
      cancelAnimationFrame(frame);
      setIsVisible(false);
    };
  }, [tile]);

  useEffect(() => {
    if (!tile) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tile, onClose]);

  useEffect(() => {
    if (!tile) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [tile]);

  if (!tile) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`relative max-h-[90vh] w-full max-w-[min(900px,92vw)] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] shadow-2xl transition-all duration-[350ms] ease-out ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${tile.code} details`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-3 z-20 text-3xl leading-none text-[var(--text)] transition-colors duration-200 hover:text-[#C17A3A]"
        >
          ×
        </button>

        <div className="relative h-[220px] overflow-hidden border-b border-[var(--border)]">
          {tile.photo ? (
            <>
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${tile.photo})` }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[var(--surface)]" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${bebas.className} text-7xl tracking-wide text-white`}>
              {tile.code}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h2 className={`${bebas.className} text-3xl tracking-wide text-[var(--text)]`}>
            {tile.code}
          </h2>

          <p className={`${dmSans.className} mt-2 text-sm text-[var(--muted)]`}>
            {tile.role} · {tile.company} · {tile.dates} · {tile.location}
          </p>

          <p className={`${dmSans.className} mt-4 text-base leading-relaxed text-[var(--text)]`}>
            {tile.narrative}
          </p>

          <section className="mt-6">
            <p className={`${bebas.className} text-xs tracking-widest text-[var(--muted)]`}>
              WHAT I DID
            </p>
            <ul className="mt-3 space-y-2">
              {tile.bullets?.map((bullet) => (
                <li
                  key={bullet}
                  className={`${dmSans.className} text-sm leading-relaxed text-[var(--text)]`}
                >
                  · {bullet}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <p className={`${bebas.className} text-xs tracking-widest text-[var(--muted)]`}>
              STACK
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tile.stack?.map((item) => (
                <span
                  key={item}
                  className={`${dmSans.className} rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text)]`}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          {Array.isArray(tile.links) && tile.links.length > 0 ? (
            <section className="mt-6">
              <p className={`${bebas.className} text-xs tracking-widest text-[var(--muted)]`}>
                LINKS
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {tile.links.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`${dmSans.className} text-sm text-[var(--text)] transition-colors duration-200 hover:text-[#C17A3A]`}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
