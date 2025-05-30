export const ICON_DICT = {
  Aeroporto: "plane-departure",
  Alvo: "crosshairs",
  Arma: "gun",
  Armadilha: "road-spikes",
  Avião: "plane",
  Aviso: "triangle-exclamation",
  Bandeira: "flag",
  Barco: "ship",
  Bomba: "bomb",
  Caça: "jet-fighter",
  Espionagem: "mask",
  Ferido: "user-injured",
  Governo: "landmark",
  Hospital: "house-medical",
  Logística: "truck-front",
  Marinha: "anchor",
  Mídia: "video",
  Mina: "land-mine-on",
  Paz: "dove",
  Ponto: "location-dot",
  "Porta-aviões": "ferry",
  Tenda: "tents",
  Tropa: "person-rifle",
};

export const FACTION_DICT = {
  Norte: "red",
  Vietcongue: "green",
  Neutro: "black",
  EUA: "blue",
  Sul: "yellow",
  Brasil: "green", // Assuming 'Brasil' maps to green for consistency with 'Vietcongue'
  Pernambuco: "blue",
};

export const TILE_PROVIDERS = {
  Political: {
    name: "Político",
    tiles:
      "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
    maxZoom: 12,
  },
  Satellite: {
    name: "Satélite",
    tiles:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 30,
  },
  Topographical: {
    name: "Topográfico",
    tiles:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri",
    maxZoom: 13,
  },
};

export const DEFAULT_TILE_PROVIDER = TILE_PROVIDERS.Topographical;

export const CONFLICT_MAP_DATA = {
  vietnam: {
    mapCenter: [16, 105],
    boundaryCoordinates: [
      [8, 100],
      [24, 110],
    ],
    maxBoundaryCoordinates: [
      [5, 97],
      [27, 112],
    ],
  },
  pernambuco: {
    mapCenter: [-8.063148806001525, -34.87113988210946],
    boundaryCoordinates: [
      [-11, -44],
      [-2, -34],
    ],
    maxBoundaryCoordinates: [
      [-20, -53],
      [3, -30],
    ],
  },
  default: {
    mapCenter: [0, 0],
    boundaryCoordinates: [
      [0, 0],
      [0, 0],
    ],
    maxBoundaryCoordinates: [
      [-180, -180],
      [180, 180],
    ],
  },
};