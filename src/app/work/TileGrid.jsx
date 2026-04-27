"use client";

import Tile from "./Tile";

export default function TileGrid({ tiles, activeFilter = "all", onTileClick }) {
  return (
    <div className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-4">
      {tiles.map((tile, index) => {
        const isDimmed =
          Boolean(activeFilter) &&
          activeFilter !== "all" &&
          !tile.categories.includes(activeFilter);

        const spanClass = tile.size === "2x" ? "md:col-span-2 lg:col-span-2" : "";

        return (
          <div key={tile.id} className={spanClass}>
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
