import React, { useState, useEffect } from "react";
import "../App.css";
import "leaflet/dist/leaflet.css";
import FetchCSVData from "../utils/fetchCSVData";
import { createBigGrid, createSmallGrid } from "../utils/MapGrids";
import MapContainerComponent from "./MapContainer";
import MapControls from "./MapControls";
import { CONFLICT_MAP_DATA, DEFAULT_TILE_PROVIDER } from "../constants/Constants";
import { FetchConflictData } from "../utils/fetchConflictData";

const App = ({ conflict, showBLUFOR, showREDFOR }) => {
  const { mapCenter, boundaryCoordinates, maxBoundaryCoordinates } = CONFLICT_MAP_DATA[conflict] || CONFLICT_MAP_DATA.default;

  const [tileProvider, setTileProvider] = useState(DEFAULT_TILE_PROVIDER);
  const [showIds, setShowIds] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [armies, setArmies] = useState([]);
  
  const bigGrid = createBigGrid(boundaryCoordinates[0], boundaryCoordinates[1]);
  const smallGrid = createSmallGrid(boundaryCoordinates[0], boundaryCoordinates[1]);

  useEffect(() => {
    const fetchData = async () => {
      const CSVData = await FetchConflictData(conflict + "Data");
      setMarkers(CSVData || []);
    };
    fetchData();
  }, [conflict]);

  useEffect(() => {
    const fetchData = async () => {
      const CSVData = await FetchConflictData(conflict + "Armies");
      setArmies(CSVData || []);
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
        bigGrid={bigGrid}
        smallGrid={smallGrid}
        tileProvider={tileProvider}
        showGrid={showGrid}
        showIds={showIds}
        showMarkers={showMarkers}
        markers={markers}
        armies={armies}
        showBLUFOR={showBLUFOR}
        showREDFOR={showREDFOR}
      />
    </div>
  );
};

export default App;