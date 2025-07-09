import { Marker, Tooltip } from "react-leaflet";
import { NATOHierarchy } from "../utils/MapUtils";
import L from "leaflet";


const isBLUFOR = (faction) => ["Alemanha Ocidental", "Estados Unidos", "Rebeldes"].includes(faction);
const isREDFOR = (faction) => ["Alemanha Oriental", "União Soviética", "Checoslováquia", "Panem"].includes(faction);

function getNATOSymbolPath(nationality, unitType, showBLUFOR, showREDFOR) {
  let type;
  let unit;

  if (isBLUFOR(nationality) || (!showBLUFOR && showREDFOR)) {
    type = 'Allied ';
  }
  else {
    type = 'Enemy ';
  }

  switch (unitType) {
    case 'Infantaria':
      unit = 'Infantry';
      break;
    case 'Infantaria Leve':
      unit = 'Light Infantry';
      break;
    case 'Infantaria Mecanizada':
      unit = 'Mechanized Infantry';
      break;
    case 'Blindada':
      unit = 'Armored';
      break;
    case 'Helicóptero':
      unit = 'Rotary Wing Aviaton';
      break;
    default:
      unit = 'Blank';
      break;
  }
  return process.env.PUBLIC_URL + '/icons/NATO/' + type + unit + '.svg';
}

const createCustomIcon = (designation, type, hierarchy, nationality, showBLUFOR, showREDFOR, zoomLevel) => {
  //console.log(designation, zoomLevel);
  if (typeof window.L === 'undefined') {
    console.error("Leaflet (L) não está disponível globalmente para criar ícones.");
    return null;
  }

  const getHierarchyZoomFactor = (hierarchy) => {
    switch (hierarchy) {
      case "Companhia":
      case "Batalhão":
        return -2;
      case "Regimento":
      case "Brigada":
      case "Divisão":
        return 0;
      case "Corpo":
        return 2; // Example: Larger zoom effect for larger units (original value)
      default:
        return -4; // Default zoom factor if hierarchy is not specified
    }
  };

  const zoomSize = getHierarchyZoomFactor(hierarchy);

  const flagUrls = {
    "Alemanha Ocidental": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    "Canadá": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Canada.svg/2560px-Flag_of_Canada.svg.png",
    "Holanda": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Flag_of_the_Netherlands.svg/1200px-Flag_of_the_Netherlands.svg.png",
    "França": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/800px-Flag_of_France.svg.png",
    "Bélgica": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/1182px-Flag_of_Belgium.svg.png",
    "Polônia": "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Flag_of_Poland.svg/1920px-Flag_of_Poland.svg.png",
    "Dinamarca": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Flag_of_Denmark.svg/1200px-Flag_of_Denmark.svg.png",
    "Reino Unido": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/960px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
    "Estados Unidos": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    "Alemanha Oriental": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Flag_of_the_German_Democratic_Republic.svg/1024px-Flag_of_the_German_Democratic_Republic.svg.png",
    "União Soviética": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_Soviet_Union.svg",
    "Checoslováquia": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/1200px-Flag_of_the_Czech_Republic.svg.png",
    "Panem": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Flag_of_Panem.svg",
    "Rebeldes": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Post-Revolution_Flag_of_Panem_%28Hunger_Games%29.webp",
  };
  const flagUrl = flagUrls[nationality] || "https://placehold.co/20x15/cccccc/000000?text=Flag";

const iconHtml = `
  <div style="
    display: flex;
    flex-direction: column; /* Main container stacks items vertically */
    align-items: center;   /* Centers items horizontally within the column */
    width: fit-content;    /* Adjusts width to content */
    height: fit-content;   /* Adjusts height to content */
    color: black;
    gap: 2px;             /* Small gap between stacked sections */
  ">
    <div style="
      font-size: ${Math.min(15, 15 * Math.pow((zoomLevel + zoomLevel) / 10, 3))}px;
      font-weight: bold;
      line-height: 1;
      white-space: nowrap;
      /* margin-bottom: 2px; /* Add margin if you want more space below hierarchy */
    ">${NATOHierarchy(hierarchy)}</div>

    <img
      src="${getNATOSymbolPath(nationality, type, showBLUFOR, showREDFOR)}"
      style="
        width: ${Math.min(75, 75 * Math.pow((zoomLevel + zoomSize) / 10, 3))}px;
        height: ${Math.min(50, 50 * Math.pow((zoomLevel + zoomSize) / 10, 3))}px;
        border-radius: 2px;
        /* margin-top: 2px; /* Add margin if you want more space above symbol */
      "
    />

    <div style="
      display: flex;
      flex-direction: row; /* Inner container stacks items horizontally */
      align-items: center; /* Aligns designation text and flag vertically */
      gap: 4px;             /* Gap between designation and flag */
      /* margin-top: 2px; /* Add margin if you want more space above this section */
    ">
      <div style="
        font-size: ${Math.min(12, 12 * Math.pow((zoomLevel + zoomSize) / 10, 3))}px;
        font-weight: bold;
        white-space: nowrap;
      ">${designation}</div>
      <img
        src="${flagUrl}"
        style="
          width: ${Math.min(35, 35 * Math.pow((zoomLevel + zoomSize) / 10, 3))}px;
          height: ${Math.min(21, 21 * Math.pow((zoomLevel + zoomSize) / 10, 3))}px;
        "
      />
    </div>
  </div>
`;

  
  return window.L.divIcon({
    html: iconHtml,
    className: 'custom-military-icon',
    iconAnchor: [Math.min(37.5, 37.5 * Math.pow((zoomLevel + zoomSize) / 10, 3)), Math.min(42.5, 42.5 * Math.pow((zoomLevel + zoomSize) / 10, 3))],
  });
};

const MapArmies = ({ armies, showArmies, showBLUFOR, showREDFOR, getCoordinatesFromId, zoomLevel }) => {
  return (
    armies.length > 0 &&
    armies
      .filter((item) => {
        if (!showArmies) {
          return false;
        }
        if (
          !item.Nome ||
          !item.Designação ||
          !item.Hierarquia ||
          !item.Nacionalidade ||
          !item.Localização ||
          !item.Tipo ||
          !item.Detecção
        ) {
          const missing = [];
          if (!item.Nome) missing.push('Nome');
          if (!item.Designação) missing.push('Designação');
          if (!item.Hierarquia) missing.push('Hierarquia');
          if (!item.Nacionalidade) missing.push('Nacionalidade');
          if (!item.Localização) missing.push('Localização');
          if (!item.Tipo) missing.push('Tipo');
          if (!item.Detecção) missing.push('Detecção');

          console.log(`Invalid marker data. Missing or empty fields: ${missing.join(', ')}`);
          console.log(`Full item: ${JSON.stringify(item, null, 2)}`);
          return false; // Invalid marker data
        }
        if (item.Detecção === "DETECTADO") {
          return true; // Public markers are always shown
        }
        if (showREDFOR && showBLUFOR) {
          //console.log(`Showing all armies: ${item.Nome}`);
          return true;
        }
        if (isREDFOR(item.Nacionalidade)) {
          return showREDFOR;
        }
        if (isBLUFOR(item.Nacionalidade)) {
          return showBLUFOR;
        }
        return false;
      })
      .map((item, index) => (
        <Marker
          key={index}
          position={getCoordinatesFromId(item.Localização)}
          icon={createCustomIcon(item.Designação, item.Tipo, item.Hierarquia, item.Nacionalidade, showBLUFOR, showREDFOR, zoomLevel)}
        >
        <Tooltip>
          <span>
            Soldados: {item.Soldados || 0} <br />
            Tanques: {item.Tanques || 0} <br />
            BCIs: {item.BCI || 0} <br />
            Helicópteros: {item.Helicópteros || 0}
          </span>
        </Tooltip>
        
        </Marker>
      ))
  );
};

export default MapArmies;