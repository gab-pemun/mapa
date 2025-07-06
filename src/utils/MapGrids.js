export const createBigGrid = (conflict, topLeft, bottomRight) => {
  //console.log(bottomRight[0]);
  const numRows = Math.ceil(Math.abs(bottomRight[0] - topLeft[0]));
  const numCols = Math.ceil(Math.abs(bottomRight[1] - topLeft[1]));

  const gridBoxes = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let boxTopLeft = [topLeft[0] + i, topLeft[1] + j];
      let boxBottomRight = [topLeft[0] + (i + 1), topLeft[1] + (j + 1)];

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

export const createSmallGrid = (topLeft, bottomRight) => {
  const numRows = Math.ceil(Math.abs(bottomRight[0] - topLeft[0]));
  const numCols = Math.ceil(Math.abs(bottomRight[1] - topLeft[1]));

  const gridBoxes = [];
  const qttSquaresHorizontal = 10;
  const qttSquaresVertical = 6;

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      for (let k = 0; k < qttSquaresHorizontal; k++) {
        for (let l = 0; l < qttSquaresVertical; l++) {
          let boxTopLeft = [
            topLeft[0] + i + k / qttSquaresHorizontal,
            topLeft[1] + j + l / qttSquaresVertical,
          ];
          let boxBottomRight = [
            topLeft[0] + i + (k + 1) / qttSquaresHorizontal,
            topLeft[1] + j + (l + 1) / qttSquaresVertical,
          ];

          const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const id = `${alphabet[numRows - i - 1]}${j}-${
            qttSquaresHorizontal - k - 1
          }${l}`;

          gridBoxes.push({
            id,
            topLeft: boxTopLeft,
            bottomRight: boxBottomRight,
          });
        }
      }
    }
  }
  //console.log(numRows, numCols, 5);
  return { data: gridBoxes };
};