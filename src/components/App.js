import React, { useState, useEffect } from "react";
import "../App.css";
import "leaflet/dist/leaflet.css";
import FetchCSVData from "../utils/fetchCSVData";
import MapContainerComponent from "./MapContainer";
import MapControls from "./MapControls";
import { CONFLICT_MAP_DATA, DEFAULT_TILE_PROVIDER } from "../constants/Constants";

const App = ({ conflict, showBLUFOR, showREDFOR }) => {
  const { mapCenter, boundaryCoordinates, maxBoundaryCoordinates } = CONFLICT_MAP_DATA[conflict] || CONFLICT_MAP_DATA.default;

  const [tileProvider, setTileProvider] = useState(DEFAULT_TILE_PROVIDER);
  const [showIds, setShowIds] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const CSVData = await FetchCSVData(conflict);
      setMarkers(CSVData || []);
    };
    fetchData();
  }, [conflict]);

  return (
    <div className="App">
      <MapControls
        tileProvider={tileProvider}
        setTileProvider={setTileProvider}
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showIds={showIds}
        setShowIds={setShowIds}
        showMarkers={showMarkers}
        setShowMarkers={setShowMarkers}
      />
      <MapContainerComponent
        mapCenter={mapCenter}
        boundaryCoordinates={boundaryCoordinates}
        maxBoundaryCoordinates={maxBoundaryCoordinates}
        tileProvider={tileProvider}
        showGrid={showGrid}
        showIds={showIds}
        showMarkers={showMarkers}
        markers={markers}
        showBLUFOR={showBLUFOR}
        showREDFOR={showREDFOR}
      />
    </div>
  );
};

export default App;