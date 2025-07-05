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

export const TILE_PROVIDERS = {
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

export const DEFAULT_TILE_PROVIDER = TILE_PROVIDERS.Satellite;

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
  germany: {
    mapCenter: [51.1657, 10.4515],
    boundaryCoordinates: [
     [47, 3], // Southwest corner of Germany
     [58, 14], // Northeast corner of Germany
    ],
    maxBoundaryCoordinates: [
      [44, 0], // Wider southwest boundary
      [61, 17], // Wider northeast boundary
    ],
  },

  panem: {
    mapCenter: [39.8283, -98.5795], // Geographic center of the contiguous USA
    boundaryCoordinates: [
      [23.5, -126], // Southernmost point (Florida Keys) and Westernmost point (Washington)
      [51.5, -66], // Northernmost point (Maine) and Easternmost point (Maine)
    ],
    maxBoundaryCoordinates: [
      [20.5, -129], // Slightly wider south and west
      [54.5, -63], // Slightly wider north and east
    ],
  },

  geonosis: {
    mapCenter: [26.5, 24], // Center of the Libyan Desert
    boundaryCoordinates: [
      [15, 6], // Southernmost and Westernmost point
      [21, 15], // Northernmost and Easternmost point
    ],
    maxBoundaryCoordinates: [
      [15, 6],  // Slightly wider south and west
      [21, 15], // Slightly wider north and east
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