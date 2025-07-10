import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { ICON_DICT, FACTION_DICT } from "../constants/Constants";


const isBLUFOR = (faction) => ["Alemanha Ocidental", "Estados Unidos", "Rebeldes"].includes(faction);
const isREDFOR = (faction) => ["Alemanha Oriental", "União Soviética", "Checoslováquia", "Panem"].includes(faction);

const getMarkerIconPath = (faction, icon, fullShow, blueNotRed) => {
  let mappedColor;
  if (!isBLUFOR && !isREDFOR(faction)) {
    mappedColor = "black";
  }
  else if (isBLUFOR(faction) && fullShow) {
    mappedColor = "blue";
  }
  else if (isREDFOR(faction) && fullShow) {
    mappedColor = "red";
  }
  else if (blueNotRed && isREDFOR(faction)) {
    mappedColor = "blue";
  }
  else if (blueNotRed && isBLUFOR(faction)) {
    mappedColor = "red";
  }
  else if (!blueNotRed && isREDFOR(faction)) {
    mappedColor = "red";
  }
  else if (!blueNotRed && isBLUFOR(faction)) {
    mappedColor = "blue";
  }

  const mappedIcon = ICON_DICT[icon];
  return `${process.env.PUBLIC_URL}/icons/${mappedColor}/${mappedIcon}-${mappedColor}.svg`;
};

const MapMarkers = ({ markers, showMarkers, showBLUFOR, showREDFOR, getCoordinatesFromId, zoomLevel }) => {
  return (
    markers.length > 0 &&
    markers
      .filter((item) => {
        if (!showMarkers) {
          return false;
        }
        if (
          !item.Coordenadas ||
          !item.Nacionalidade ||
          !item.Icone ||
          !item.Secreto
        ) {
          return false; // Invalid marker data
        }
        if (item.Secreto === "LIVRE") {
          return true; // Public markers are always shown
        }
        if (showREDFOR && showBLUFOR) {
          return true; // Diretoria mode shows all secret markers
        }
        if (isREDFOR(item.Nacionalidade)) {
          return item.Secreto === "SECRETO" && showREDFOR;
        }
        if (isBLUFOR(item.Nacionalidade)) {
          return item.Secreto === "SECRETO" && showBLUFOR;
        }
        return false;
      })
      .map((item, index) => (
        <Marker
          key={index}
          position={getCoordinatesFromId(item.Coordenadas)}
          icon={L.icon({
            iconUrl: getMarkerIconPath(item.Nacionalidade, item.Icone, (showREDFOR && showBLUFOR), (showREDFOR && !showBLUFOR)),
            iconSize: [Math.min(24, 24 * Math.pow((zoomLevel + 1) / 10, 3)), Math.min(24, 24 * Math.pow((zoomLevel + 1) / 10, 3))],
            iconAnchor: [Math.min(12, 12 * Math.pow((zoomLevel + 1) / 10, 3)), Math.min(12, 12 * Math.pow((zoomLevel + 1) / 10, 3))],
            popupAnchor: [0, - Math.min(24, 24 * Math.pow((zoomLevel + 1) / 10, 3))],
          })}
        >
          <Tooltip>
            <span>{item.Texto}</span>
          </Tooltip>
        </Marker>
      ))
  );
};

export default MapMarkers;