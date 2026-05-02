"use client";

import Tile from "./Tile";

export default function TileGrid({ tiles, activeFilter = "all", onTileClick, compact = false }) {
  const sortedTiles =
    activeFilter && activeFilter !== "all"
      ? [...tiles].sort((a, b) => {
          const aMatches = a.categories?.includes(activeFilter) ? 0 : 1;
          const bMatches = b.categories?.includes(activeFilter) ? 0 : 1;
          return aMatches - bMatches;
        })
      : tiles;

  return (
    <div
      className="grid grid-flow-dense grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4"
      style={{ gridAutoRows: compact ? "minmax(220px, 1fr)" : "minmax(520px, 1fr)" }}
    >
      {sortedTiles.map((tile, index) => {
        const isDimmed =
          Boolean(activeFilter) &&
          activeFilter !== "all" &&
          !tile.categories.includes(activeFilter);

        const spanClass =
          tile.size === "2x" ? "lg:col-span-2 lg:row-span-2" : "col-span-1";

        return (
          <div key={tile.id} className={`${spanClass} flex`}>
            <Tile
              tile={tile}
              index={index}
              dimmed={isDimmed}
              onClick={onTileClick ? () => onTileClick(tile) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
