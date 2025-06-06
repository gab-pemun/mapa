import React, { useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents, Tooltip } from "react-leaflet";
import { createBigGrid, createSmallGrid } from "../utils/MapGrids";
import { getCoordinatesFromId } from "../utils/MapUtils";
import MapMarkers from "./MapMarkers"; // Import MapMarkers component
import MapArmies from "./MapArmies"; // Import MapMarkers component

const ZoomListener = ({ setZoomLevel }) => {
  useMapEvents({
    zoomend: (e) => {
      console.log(e.target.getZoom());
      setZoomLevel(e.target.getZoom());
    },
  });
  return null;
};

const MapContainerComponent = ({
  mapCenter,
  boundaryCoordinates,
  maxBoundaryCoordinates,
  tileProvider,
  showGrid,
  showIds,
  showMarkers,
  markers,
  armies,
  showBLUFOR,
  showREDFOR,
}) => {
  const [zoomLevel, setZoomLevel] = useState(9);

  const bigGrid = createBigGrid(boundaryCoordinates[0], boundaryCoordinates[1]);
  const smallGrid = createSmallGrid(boundaryCoordinates[0], boundaryCoordinates[1]);

  const outerBoundary = [
    [
      [-90, -180],
      [90, -180],
      [90, 180],
      [-90, 180],
    ], // The entire world
    [
      // Inner rectangle to be cut out
      [boundaryCoordinates[0][0], boundaryCoordinates[0][1]],
      [boundaryCoordinates[0][0], boundaryCoordinates[1][1]],
      [boundaryCoordinates[1][0], boundaryCoordinates[1][1]],
      [boundaryCoordinates[1][0], boundaryCoordinates[0][1]],
    ],
  ];

  return (
    <MapContainer
      center={mapCenter}
      zoom={9}
      maxBounds={maxBoundaryCoordinates}
      maxBoundsViscosity={1.0}
      className="map"
    >
      <TileLayer
        url={tileProvider.tiles}
        attribution={tileProvider.attribution}
        maxZoom={tileProvider.maxZoom}
        minZoom={4}
      />
      <ZoomListener setZoomLevel={setZoomLevel} />

      {/* Render Markers */}
      <MapMarkers
        markers={markers}
        showMarkers={showMarkers}
        showBLUFOR={showBLUFOR}
        showREDFOR={showREDFOR}
        getCoordinatesFromId={(id) => getCoordinatesFromId(id, boundaryCoordinates[0], boundaryCoordinates[1])}
      />

      <MapArmies
        armies={armies}
        showArmies={showMarkers}
        showBLUFOR={showBLUFOR}
        showREDFOR={showREDFOR}
        getCoordinatesFromId={(armies) => getCoordinatesFromId(armies, boundaryCoordinates[0], boundaryCoordinates[1])}
        zoomLevel={zoomLevel}
      />

      <Polygon
        positions={outerBoundary}
        pathOptions={{
          fillColor: "green",
          fillOpacity: 0.3,
          color: "green",
          weight: 1,
        }}
      />

      {showGrid &&
        (zoomLevel < 9 ? bigGrid : smallGrid).data.map(
          ({ id, topLeft, bottomRight }) => (
            <Polygon
              key={id}
              positions={[
                topLeft,
                [bottomRight[0], topLeft[1]],
                bottomRight,
                [topLeft[0], bottomRight[1]],
              ]}
              fill={true}
              fillOpacity={0}
              weight={zoomLevel < 9 ? 1.0 : 0.5} // Adjust weight based on zoom level
              color={"black"}
            >
              {showIds && (
                <Tooltip>
                  <span>{`ID: ${id}`}</span>
                </Tooltip>
              )}
            </Polygon>
          )
        )}
    </MapContainer>
  );
};

export default MapContainerComponent;