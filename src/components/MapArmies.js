import { Marker, Tooltip } from "react-leaflet";
import { NATOHierarchy } from "../utils/MapUtils";
import L from "leaflet";


const isBLUFOR = (faction) => ["Alemanha Ocidental", "Estados Unidos"].includes(faction);
const isREDFOR = (faction) => ["Alemanha Oriental", "União Soviética", "Checoslováquia"].includes(faction);

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
  console.log('/icons/NATO/' + type + unit + '.svg')
  return '/icons/NATO/' + type + unit + '.svg';
}

const createCustomIcon = (designation, type, hierarchy, nationality, showBLUFOR, showREDFOR, zoomLevel) => {
  console.log("Creating custom icon for:", { designacao: designation, hierarquia: hierarchy, nacionalidade: nationality });
  if (typeof window.L === 'undefined') {
    console.error("Leaflet (L) não está disponível globalmente para criar ícones.");
    return null;
  }

  

  const flagUrls = {
    "Alemanha Ocidental": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    "Estados Unidos": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    "Alemanha Oriental": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Flag_of_the_German_Democratic_Republic.svg/1024px-Flag_of_the_German_Democratic_Republic.svg.png",
    "União Soviética": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_Soviet_Union.svg",
    "Checoslováquia": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/1200px-Flag_of_the_Czech_Republic.svg.png",
  };
  const flagUrl = flagUrls[nationality] || "https://placehold.co/20x15/cccccc/000000?text=Flag";

  const iconHtml = `
    <div style="display: flex; flex-direction: row; align-items: flex-end; width: 100%; height: fit-content; color: black; gap: 4px;">
      <!-- Designação à esquerda -->
      <div style="font-size: 10px; font-weight: bold; white-space: nowrap;">${designation}</div>

      <!-- Ícone central com hierarquia acima -->
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="font-size: 15px; font-weight: bold; line-height: 1; margin-bottom: 2px;">${NATOHierarchy(hierarchy)}</div>
        <img src="${getNATOSymbolPath(nationality, type, showBLUFOR, showREDFOR)}" style="width: 60px; height: 40px; border-radius: 2px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); border: 1px solid #d1d5db;" />
      </div>

      <!-- Bandeira à direita -->
      <img src="${flagUrl}"
            style="width: 35px; height: 21px;" />
    </div>
  `;

  return window.L.divIcon({
    html: iconHtml,
    className: 'custom-military-icon',
    iconAnchor: [60, 35],
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
          !item.Detecção ||
          !item.Texto
        ) {
          const missing = [];
          if (!item.Nome) missing.push('Nome');
          if (!item.Designação) missing.push('Designação');
          if (!item.Hierarquia) missing.push('Hierarquia');
          if (!item.Nacionalidade) missing.push('Nacionalidade');
          if (!item.Localização) missing.push('Localização');
          if (!item.Tipo) missing.push('Tipo');
          if (!item.Detecção) missing.push('Detecção');
          if (!item.Texto) missing.push('Texto');

          console.log(`Invalid marker data. Missing or empty fields: ${missing.join(', ')}`);
          console.log(`Full item: ${JSON.stringify(item, null, 2)}`);
          return false; // Invalid marker data
        }

        if (item.Detecção === "DETECTADO") {
          return true; // Public markers are always shown
        }
        if (showREDFOR && showBLUFOR) {
          console.log(`Showing all armies: ${item.Nome}`);
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
          icon={createCustomIcon(item.Designação, item.Tipo, item.Hierarquia, item.Nacionalidade, zoomLevel)}
        >
          <Tooltip>
            <span>{item.Texto}</span>
          </Tooltip>
        </Marker>
      ))
  );
};

export default MapArmies;