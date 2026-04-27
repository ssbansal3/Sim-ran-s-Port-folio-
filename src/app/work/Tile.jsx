"use client";
import { Bebas_Neue, DM_Sans } from "next/font/google";

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

export default function Tile({ tile, index, dimmed = false, onClick }) {
  const indexLabel =
    typeof index === "number" ? String(index + 1).padStart(2, "0") : null;
  const hasPhoto = typeof tile?.photo === "string" && tile.photo.length > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden border border-[var(--border)] text-left hover:-translate-y-1 hover:border-b-2 hover:border-b-[#C17A3A]"
      style={{
        aspectRatio: "4 / 5",
        opacity: dimmed ? 0.25 : 1,
        transition: "opacity 0.4s ease, transform 0.3s ease, border-color 0.3s ease",
      }}
      aria-label={`${tile?.code ?? ""}, ${tile?.role ?? ""}, ${tile?.company ?? ""}`.trim()}
    >
      {hasPhoto ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{ backgroundImage: `url(${tile.photo})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/40" aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0 bg-[var(--surface)]" aria-hidden />
      )}

      <div className="absolute inset-0 z-[1] flex flex-col justify-between p-4">
        <div className={`${bebas.className} text-sm tracking-wider text-[var(--muted)]`}>
          {indexLabel}
        </div>
        <div className="space-y-1">
          <p
            className={`${bebas.className} leading-none text-[var(--text)]`}
            style={{
              fontSize: hasPhoto
                ? "clamp(2.2rem, 6vw, 3.5rem)"
                : "clamp(3.5rem, 9vw, 6rem)",
            }}
          >
            {tile?.code}
          </p>
          <p className={`${dmSans.className} text-sm text-[var(--text)]`}>
            {tile?.role}
          </p>
          <p className={`${dmSans.className} text-sm text-[var(--muted)]`}>
            {tile?.company}
          </p>
          <p className={`${dmSans.className} text-xs text-[var(--muted)]`}>
            {tile?.year}
          </p>
        </div>
      </div>
    </button>
  );
}