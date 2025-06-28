export function NATOHierarchy(hierarchy) {
  // Converte a hierarquia para minúsculas para uma comparação sem distinção entre maiúsculas e minúsculas
  const normalizedHierarchy = hierarchy.toLowerCase();
  console.log(hierarchy);
  switch (normalizedHierarchy) {
    case 'divisão':
      return 'X X';
    case 'brigada':
      return 'X';
    case 'regimento':
      return '| | |';
    case 'batalhão':
      return '| |';
    case 'companhia':
      return '|';
    case 'pelotão':
      return '•••';
    case 'seção':
      return '••';
    case 'esquadra':
      return '•';
    default:
      return '';
  }
}

export const getCoordinatesFromId = (id, topLeft, bottomRight) => {
  const numRows = Math.ceil(Math.abs(bottomRight[0] - topLeft[0]) / 4);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  if (id.includes("-")) {
    const rowChar = id.charAt(0);
    const colIndex = parseInt(id.slice(1, id.indexOf("-")), 10);
    const subBoxRow = parseInt(id.charAt(id.indexOf("-") + 1), 10);
    const subBoxCol = parseInt(id.charAt(id.indexOf("-") + 2), 10);

    const rowIndex = numRows - alphabet.indexOf(rowChar) - 1;

    const boxTopLeft = [
      topLeft[0] + rowIndex + (10 - subBoxRow - 1) / 10,
      topLeft[1] + colIndex + subBoxCol / 6,
    ];
    const boxBottomRight = [
      topLeft[0] + rowIndex + (10 - subBoxRow) / 10,
      topLeft[1] + colIndex + (subBoxCol + 1) / 6,
    ];

    const center = [
      (boxTopLeft[0] + boxBottomRight[0]) / 2,
      (boxTopLeft[1] + boxBottomRight[1]) / 2,
    ];
    return center;
  } else {
    const rowChar = id.charAt(0);
    const colIndex = parseInt(id.slice(1), 10);

    const rowIndex = numRows - alphabet.indexOf(rowChar) - 1;

    const boxTopLeft = [topLeft[0] + rowIndex, topLeft[1] + colIndex];
    const boxBottomRight = [
      topLeft[0] + rowIndex + 1,
      topLeft[1] + colIndex + 1,
    ];

    const center = [
      (boxTopLeft[0] + boxBottomRight[0]) / 2,
      (boxTopLeft[1] + boxBottomRight[1]) / 2,
    ];

    return center;
  }
};