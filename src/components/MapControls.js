import React from "react";
import { TILE_PROVIDERS } from "../constants/Constants";

const MapControls = ({
  tileProvider,
  setTileProvider,
  showGrid,
  setShowGrid,
  showIds,
  setShowIds,
  showMarkers,
  setShowMarkers,
}) => {
  return (
    <div className="controls">
      <label className="control-label">Estilo de Mapa:</label>
      <select
        className="tile-provider-select"
        onChange={(e) => setTileProvider(TILE_PROVIDERS[e.target.value])}
        value={Object.keys(TILE_PROVIDERS).find(key => TILE_PROVIDERS[key].name === tileProvider.name)}
      >
        {Object.keys(TILE_PROVIDERS).map((provider) => (
          <option key={provider} value={provider}>
            {TILE_PROVIDERS[provider].name}
          </option>
        ))}
      </select>
      <label className="control-label">
        <input
          type="checkbox"
          checked={showGrid}
          onChange={(e) => setShowGrid(e.target.checked)}
        />
        Grade
      </label>
      <label className="control-label">
        <input
          type="checkbox"
          checked={showIds}
          onChange={(e) => setShowIds(e.target.checked)}
          disabled={!showGrid}
        />
        ID
      </label>
      <label className="control-label">
        <input
          type="checkbox"
          checked={showMarkers}
          onChange={(e) => setShowMarkers(e.target.checked)}
        />
        Pins
      </label>
    </div>
  );
  };

export default MapControls;