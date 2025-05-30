import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { ICON_DICT, FACTION_DICT } from "../constants/Constants";

const isBLUFOR = (faction) => ["EUA", "Sul", "Brasil"].includes(faction);
const isREDFOR = (faction) => ["Norte", "Vietcongue", "Pernambuco"].includes(faction);

const getMarkerIconPath = (faction, icon) => {
  const mappedFaction = FACTION_DICT[faction];
  const mappedIcon = ICON_DICT[icon];
  return `${process.env.PUBLIC_URL}/icons/${mappedFaction}/${mappedIcon}-${mappedFaction}.svg`;
};

const MapMarkers = ({ markers, showMarkers, showBLUFOR, showREDFOR, getCoordinatesFromId }) => {
  return (
    markers.length > 0 &&
    markers
      .filter((item) => {
        if (!showMarkers) {
          return false;
        }
        if (
          !item.Coordenadas ||
          !item.Responsabilidade ||
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
        if (isREDFOR(item.Responsabilidade)) {
          return item.Secreto === "SECRETO" && showREDFOR;
        }
        if (isBLUFOR(item.Responsabilidade)) {
          return item.Secreto === "SECRETO" && showBLUFOR;
        }
        return false;
      })
      .map((item, index) => (
        <Marker
          key={index}
          position={getCoordinatesFromId(item.Coordenadas)}
          icon={L.icon({
            iconUrl: getMarkerIconPath(item.Responsabilidade, item.Icone),
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -24],
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