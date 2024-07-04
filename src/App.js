import React, { useState, useEffect } from "react";
import { Tooltip, MapContainer, TileLayer, Polygon, useMapEvents, Marker} from "react-leaflet";
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from 'react-router-dom';
import "./App.css";
import "leaflet/dist/leaflet.css";
import FetchCSVData from "./utils/fetchCSVData";
import L from "leaflet";

const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVXTWQtJYVaG0cBLzdfPoNX0HDL-hRl8QeaShGJIBW-hBbfJ-sKll7sO-XHJHUgOH6YVbC3oFTpbz3/pub?output=csv'

const iconDict = {
  "Aeroporto": "plane-departure",
  "Alvo": "crosshairs",
  "Arma": "gun",
  "Armadilha": "road-spikes",
  "Avião": "plane",
  "Aviso": "triangle-exclamation",
  "Bandeira": "flag",
  "Barco": "ship",
  "Bomba": "bomb",
  "Caça": "jet-fighter",
  "Espionagem": "mask",
  "Ferido": "user-injured",
  "Governo": "landmark",
  "Hospital": "house-medical",
  "Logística": "truck-front",
  "Marinha": "anchor",
  "Mídia": "video",
  "Mina": "land-mine-on",
  "Paz": "dove",
  "Ponto": "location-dot",
  "Porta-aviões": "ferry",
  "Tenda": "tents",
  "Tropa": "person-rifle",
};

const factionDict = {
  "Norte": "norte",
  "Vietcongue": "vcong",
  "Neutro": "solid",
  "EUA": "eua",
  "Sul": "sul",
};

const getMarkerIconPath = (faction, icon) => {
  faction = factionDict[faction];
  icon = iconDict[icon];
  return `${process.env.PUBLIC_URL}/icons/${faction}/${icon}-${faction}.svg`;
};

const createBigGrid = (topLeft, bottomRight) => {
  const numRows = Math.ceil((bottomRight[0] - topLeft[0]));
  const numCols = Math.ceil((bottomRight[1] - topLeft[1]));

  const gridBoxes = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let boxTopLeft = [
        topLeft[0] + i,
        topLeft[1] + j,
      ];
      let boxBottomRight = [
        topLeft[0] + (i + 1),
        topLeft[1] + (j + 1),
      ];

      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const id = `${alphabet[numRows - i - 1]}${j}`;

      gridBoxes.push({
        id,
        topLeft: boxTopLeft,
        bottomRight: boxBottomRight,
      });
    }
  }

  return { data: gridBoxes };
};

const createSmallGrid = (topLeft, bottomRight) => {
  const numRows = Math.ceil((bottomRight[0] - topLeft[0]));
  const numCols = Math.ceil((bottomRight[1] - topLeft[1]));

  const gridBoxes = [];
  const qttSquares = 8;
  
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      for (let k = 0; k < qttSquares; k++) {
        for (let l = 0; l < qttSquares; l++) {
          let boxTopLeft = [
            topLeft[0] + i + (k / qttSquares),
            topLeft[1] + j + (l / qttSquares),
          ];
          let boxBottomRight = [
            topLeft[0] + i + ((k + 1) / qttSquares),
            topLeft[1] + j + ((l + 1) / qttSquares),
          ];

          const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const id = `${alphabet[numRows - i - 1]}${j}-${(qttSquares - k - 1)}${l}`;

          gridBoxes.push({
            id,
            topLeft: boxTopLeft,
            bottomRight: boxBottomRight,
          });
        }
      }
    }
  }

  return { data: gridBoxes };
};

const getCoordinatesFromId = (id, topLeft, bottomRight) => {
  const numRows = Math.ceil((bottomRight[0] - topLeft[0]));
  const numCols = Math.ceil((bottomRight[1] - topLeft[1]));
  const qttSquares = 8;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  if (id.includes('-')) {
    const rowChar = id.charAt(0);
    const colIndex = parseInt(id.slice(1, id.indexOf('-')), 10);
    const subBoxRow = parseInt(id.charAt(id.indexOf('-') + 1), 10);
    const subBoxCol = parseInt(id.charAt(id.indexOf('-') + 2), 10);

    const rowIndex = numRows - alphabet.indexOf(rowChar) - 1;

    const boxTopLeft = [
      topLeft[0] + rowIndex + ((qttSquares - subBoxRow - 1) / qttSquares),
      topLeft[1] + colIndex + (subBoxCol / qttSquares)
    ];
    const boxBottomRight = [
      topLeft[0] + rowIndex + ((qttSquares - subBoxRow) / qttSquares),
      topLeft[1] + colIndex + ((subBoxCol + 1) / qttSquares)
    ];

    const center = [
      (boxTopLeft[0] + boxBottomRight[0]) / 2,
      (boxTopLeft[1] + boxBottomRight[1]) / 2
    ];

    return center;
  } else {
    const rowChar = id.charAt(0);
    const colIndex = parseInt(id.slice(1), 10);

    const rowIndex = numRows - alphabet.indexOf(rowChar) - 1;

    const boxTopLeft = [
      topLeft[0] + rowIndex,
      topLeft[1] + colIndex
    ];
    const boxBottomRight = [
      topLeft[0] + rowIndex + 1,
      topLeft[1] + colIndex + 1
    ];

    const center = [
      (boxTopLeft[0] + boxBottomRight[0]) / 2,
      (boxTopLeft[1] + boxBottomRight[1]) / 2
    ];

    return center;
  }
};

const App = ({ showNorth, showSouth }) => {
  //console.log(showNorth);
  //console.log(showSouth);
  const [tileProvider, setTileProvider] = useState({
    name: 'Topográfico',
    tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 12,
  });
  const [showIds, setShowIds] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);


  const tileProviders = {
    Political: {
      name: 'Político',
      tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
      maxZoom: 12,
    }, 
      
    Satellite: {
      name: 'Satélite',
      tiles: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 30,
    },
    
    Topographical: {
      name: 'Topográfico',
      tiles:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
      maxZoom: 13,
    },
    
    /*Political: {
      name: 'Político',
      tiles: 'https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=16c3739e65524510ad17106ca1175a7d',
      attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 22,
    },*/
  };


  const [markers, setMarkers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
        const CSVData = await FetchCSVData(sheetURL);
        setMarkers(CSVData || []);
        ///console.log(CSVData)
    };

    fetchData();
}, []); // Empty dependency array means this effect runs only once after initial render

  const boundaryCoordinates = [
    [8, 100],
    [24, 110]
  ];


  const coordinates = (id) => getCoordinatesFromId(id, boundaryCoordinates[0], boundaryCoordinates[1]);

  const maxBoundaryCoordinates = [
    [5, 97],
    [27, 112],
  ];

  const [zoomLevel, setZoomLevel] = useState(9);
  const bigGrid = createBigGrid(boundaryCoordinates[0], boundaryCoordinates[1]);
  const smallGrid = createSmallGrid(boundaryCoordinates[0], boundaryCoordinates[1]);

  const outerBoundary = [
    [[-90, -180], [90, -180], [90, 180], [-90, 180]], // The entire world
    [  // Inner rectangle to be cut out
      [boundaryCoordinates[0][0], boundaryCoordinates[0][1]],
      [boundaryCoordinates[0][0], boundaryCoordinates[1][1]],
      [boundaryCoordinates[1][0], boundaryCoordinates[1][1]],
      [boundaryCoordinates[1][0], boundaryCoordinates[0][1]],
    ]
  ];

  const ZoomListener = () => {
    useMapEvents({
      zoomend: (e) => {
        setZoomLevel(e.target.getZoom());
      }
    });
    return null;
  };
  
  //markers.forEach(function(item) {
      //console.log(item);
      //console.log(getMarkerIconPath(item.Responsabilidade, item.Icone))
  //});

  return (
    <div className="App">
      <div className="controls">
        <label className="control-label">Estilo de Mapa:</label>
        <select
          className="tile-provider-select"
          onChange={(e) => setTileProvider(tileProviders[e.target.value])}
        >
          {Object.keys(tileProviders).map((provider) => (
            <option key={provider} value={provider}>
              {tileProviders[provider].name}
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
      <MapContainer
        center={[16, 105]}
        zoom={9}
        maxBounds={maxBoundaryCoordinates}
        maxBoundsViscosity={1.0}
        className="map"
      >
         <TileLayer
          url={tileProvider.tiles}
          attribution={tileProvider.attribution}
          maxZoom={tileProvider.maxZoom}
          minZoom={6}
        />
        <ZoomListener />
        {markers.length > 0 && markers
        .filter(item => {
          if (!showMarkers) {
            return false;
          }
          if (!item.Coordenadas || !item.Responsabilidade || !item.Icone || !item.Secreto) {
            return false;
          }
          if (item.Secreto === "LIVRE") { // Público
            return true;
          }
          if (showNorth && showSouth) { // Diretoria
            return true;
          }
          if ((item.Responsabilidade === "Norte" || item.Responsabilidade === "Vietcongue")) {
            return item.Secreto === "SECRETO" && showNorth;
          }
          if ((item.Responsabilidade === "Sul" || item.Responsabilidade === "EUA")) {
            return item.Secreto === "SECRETO" && showSouth;
          }
          return false;
        })
        .map((item, index) => (
          <Marker
            key={index}
            position={coordinates(item.Coordenadas, boundaryCoordinates[0], boundaryCoordinates[1])}
            icon={L.icon({
              iconUrl: getMarkerIconPath(item.Responsabilidade, item.Icone),
              iconSize: [24, 24], // Size of the icon
              iconAnchor: [12, 12], // Point of the icon which will correspond to marker's location
              popupAnchor: [0, -24], // Point from which the popup should open relative to the iconAnchor
            })}
          >
            <Tooltip >
              <span>{item.Texto}</span>
            </Tooltip>
          </Marker>
        ))}
        <Polygon
          positions={outerBoundary}
          pathOptions={{ fillColor: 'green', fillOpacity: 0.3, color: 'green', weight: 1 }}
        />
        {showGrid ? (bigGrid.data.map(({ id, topLeft, bottomRight }) => (
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
              weight={0.50}
              color={"black"}
            >
            </Polygon>
          ))
        ) : null}
        {showGrid && (zoomLevel < 9 ? bigGrid : smallGrid).data.map(({ id, topLeft, bottomRight }) => (
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
            weight={0.15}
            color={"black"}
          >
            {showIds && (
              <Tooltip>
                <span>{`ID: ${id}`}</span>
              </Tooltip>
            )}
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
