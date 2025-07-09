import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents, Tooltip, useMap } from "react-leaflet";
import { getCoordinatesFromId } from "../utils/MapUtils";
import L from 'leaflet';
import MapMarkers from "./MapMarkers"; // Import MapMarkers component
import MapArmies from "./MapArmies"; // Import MapMarkers component

const ZoomAndBoundsListener = ({ setZoomLevel, setMapBounds }) => {
  const map = useMap(); // Get the map instance

  const updateMapState = useCallback(() => {
    setZoomLevel(map.getZoom());
    setMapBounds(map.getBounds());
  }, [map, setZoomLevel, setMapBounds]);

  useMapEvents({
    zoomend: updateMapState, // Update on zoom changes
    moveend: updateMapState, // Update on map movement
    load: updateMapState,    // Update on initial map load
  });

  // Initial update when component mounts and map is ready
  useEffect(() => {
    if (map) {
      updateMapState();
    }
  }, [map, updateMapState]);

  return null;
};

const MapContainerComponent = ({
  mapCenter,
  boundaryCoordinates,
  maxBoundaryCoordinates,
  bigGrid,
  smallGrid,
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
  const [mapBounds, setMapBounds] = useState(null); // State to store current map bounds


    const isGridCellVisible = useCallback((gridCell, currentMapBounds) => {
    if (!currentMapBounds) return false;

    const [topLeftLat, topLeftLng] = gridCell.topLeft;
    const [bottomRightLat, bottomRightLng] = gridCell.bottomRight;

    // Create Leaflet LatLngBounds for the grid cell
    const gridCellBounds = L.latLngBounds(
      L.latLng(bottomRightLat, topLeftLng ), // SW corner
      L.latLng(topLeftLat, bottomRightLng)   // NE corner
    );

    // Check for intersection
    return currentMapBounds.intersects(gridCellBounds);
  }, []);


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

  const currentGrid = zoomLevel < 8 ? bigGrid : smallGrid;
  //console.log(mapBounds);
  const filteredGrid = mapBounds && showGrid
  ? currentGrid.data.filter(cell => isGridCellVisible(cell, mapBounds))
  : [];


    
  //console.log(filteredGrid);

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
      <ZoomAndBoundsListener setZoomLevel={setZoomLevel} setMapBounds={setMapBounds} />

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

      {showGrid && filteredGrid.map(
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