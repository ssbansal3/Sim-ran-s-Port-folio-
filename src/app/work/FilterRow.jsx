"use client";

import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });

const FILTERS = [
  { label: "ALL", value: "all" },
  { label: "ENGINEERING", value: "engineering" },
  { label: "AUTOMOTIVE", value: "automotive" },
  { label: "LEADERSHIP", value: "leadership" },
  { label: "FIELD EXPERIENCE", value: "field" },
];

export default function FilterRow({ activeFilter, onFilterChange }) {
  return (
    <div className="py-10">
      <div className="overflow-x-auto px-3">
        <div className={`${bebas.className} flex min-w-max flex-nowrap items-center justify-center gap-8 text-sm tracking-wider`}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onFilterChange(filter.value)}
                className={[
                  "border-b-2 pb-1 transition-colors duration-300",
                  isActive
                    ? "border-b-[#C17A3A] text-[var(--text)]"
                    : "border-b-transparent text-[var(--muted)] hover:border-b-[#C17A3A] hover:text-[var(--text)]",
                ].join(" ")}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
