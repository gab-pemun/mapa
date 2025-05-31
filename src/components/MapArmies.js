import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";


const isBLUFOR = (faction) => ["Alemanha Ocidental", "Estados Unidos"].includes(faction);
const isREDFOR = (faction) => ["Alemanha Oriental", "União Soviética", "Checoslováquia"].includes(faction);

const createCustomIcon = (designacao, hierarquia, nacionalidade) => {
  // Certifica-se de que L está disponível globalmente
  if (typeof window.L === 'undefined') {
    console.error("Leaflet (L) não está disponível globalmente para criar ícones.");
    return null; // Retorna nulo ou um ícone padrão se L não estiver carregado
  }

  const natoBaseIconUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Military_Symbol_-_Friendly_Unit_%28Solid_Light_1.5x1_Frame%29-_Armour_%28NATO_APP-6%29.svg/1024px-Military_Symbol_-_Friendly_Unit_%28Solid_Light_1.5x1_Frame%29-_Armour_%28NATO_APP-6%29.svg.png";

  // Mapeamento de URLs de bandeiras para nacionalidades
  const flagUrls = {
    "Alemanha Ocidental": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    "Estados Unidos": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
    "Alemanha Oriental": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Flag_of_the_German_Democratic_Republic.svg/1024px-Flag_of_the_German_Democratic_Republic.svg.png",
    "União Soviética": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_Soviet_Union.svg",
    "Checoslováquia": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/1200px-Flag_of_the_Czech_Republic.svg.png",
  };
  const flagUrl = flagUrls[nacionalidade] || "https://placehold.co/20x15/cccccc/000000?text=Flag";

  const iconSize = 60;
  const iconAnchor = iconSize / 2;

  const iconHtml = `
    <div class="relative w-[${iconSize}px] h-[${iconSize}px] flex items-center justify-center text-black" style="background-image: url('${natoBaseIconUrl}'); background-size: contain; background-repeat: no-repeat; background-position: center;">
      <div class="absolute top-[2px] text-[10px] font-bold text-center w-full leading-none">${hierarquia}</div>
      <div class="absolute left-[2px] text-[10px] font-bold transform -rotate-90 origin-bottom-left whitespace-nowrap">${designacao}</div>
      <img src="${flagUrl}" class="absolute right-[2px] top-1/2 -translate-y-1/2 w-[25px] h-[18px] rounded-sm shadow-sm border border-gray-300" />
    </div>
  `;

  return window.L.divIcon({
    html: iconHtml,
    className: 'custom-military-icon',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconAnchor, iconAnchor],
  });
};

const MapArmies = ({ armies, showArmies, showBLUFOR, showREDFOR, getCoordinatesFromId }) => {
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
          return false; // Invalid marker data
        }
        if (item.Detecção === "DETECTADO") {
          console.log(`Filtering out: ${item.Nome} (invalid data)`);
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
          position={getCoordinatesFromId(item.Coordenadas)}
          icon={createCustomIcon(item.Designação, item.Hierarquia, item.Nacionalidade)}
        >
          <Tooltip>
            <span>{item.Texto}</span>
          </Tooltip>
        </Marker>
      ))
  );
};

export default MapArmies;