const vietnamData =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVXTWQtJYVaG0cBLzdfPoNX0HDL-hRl8QeaShGJIBW-hBbfJ-sKll7sO-XHJHUgOH6YVbC3oFTpbz3/pub?output=csv";
const pernambucoData =
  "https://docs.google.com/sheets/d/e/2PACX-1vTWg5lT88cGN058YKWPE2xcw5EFoxngZc6ybo_9PmVlE_GZt86_jgTm-B6-OcqeoWN8ybhrYH0ChzDg/pub?output=csv";

export default async function FetchCSVData(conflict) {
  let sheetURL = null;
  if (conflict === "vietnam") {
    sheetURL = vietnamData;
  } else if (conflict === "pernambuco") {
    sheetURL = pernambucoData;
  }

  if (sheetURL != null) {
    try {
      const response = await fetch(sheetURL);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const csvText = await response.text();
      const sheetObjects = csvToObjects(csvText);
      return sheetObjects;
    } catch (error) {
      console.error("Fetch error:", error);
      return null; // or handle the error as appropriate
    }
  }

  function csvToObjects(csv) {
    const csvRows = csv
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row);
    //console.log(csvRows)
    const propertyNames = csvRows[0].split(",");
    let objects = [];
    for (let i = 1; i < csvRows.length; i++) {
      let thisObject = {};
      let row = csvRows[i].split(",");
      for (let j = 0; j < row.length; j++) {
        thisObject[propertyNames[j]] = row[j];
      }
      objects.push(thisObject);
    }
    return objects;
  }
}