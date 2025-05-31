// FetchDataService.js

/**
 * Parses a CSV string into an array of JavaScript objects.
 * The first row of the CSV is assumed to be the header row,
 * providing the property names for the objects.
 *
 * @param {string} csv - The CSV string to parse.
 * @returns {Array<Object>} An array of objects, where each object represents a row in the CSV.
 */
function csvToObjects(csv) {
  // Split the CSV string into rows, trim whitespace, and filter out any empty rows.
  const csvRows = csv
    .split("\n")
    .map((row) => row.trim())
    .filter((row) => row);

  // If there are no rows (e.g., empty CSV), return an empty array.
  if (csvRows.length === 0) {
    return [];
  }

  // The first row contains the property names (headers).
  const propertyNames = csvRows[0].split(",");
  let objects = [];

  // Iterate over the remaining rows (starting from index 1 to skip the header).
  for (let i = 1; i < csvRows.length; i++) {
    let thisObject = {}; // Create an empty object for the current row.
    let row = csvRows[i].split(","); // Split the current row into individual values.

    // Iterate over the values in the current row.
    for (let j = 0; j < row.length; j++) {
      // Assign the value to the corresponding property name from the header.
      // Ensure that the property name exists to prevent errors if a row has fewer columns.
      if (propertyNames[j]) {
        thisObject[propertyNames[j]] = row[j];
      }
    }
    objects.push(thisObject); // Add the constructed object to the array.
  }
  return objects; // Return the array of objects.
}

/**
 * Fetches data from a given CSV URL and parses it into an array of objects.
 * This function handles the network request and error handling.
 *
 * @param {string} sheetURL - The URL of the CSV sheet to fetch.
 * @returns {Promise<Array<Object>|null>} A promise that resolves to an array of objects
 * if the fetch and parsing are successful, or null if an error occurs (e.g., network issue, invalid URL).
 */
export async function fetchCsvData(sheetURL) {
  // Check if a sheet URL is provided.
  if (!sheetURL) {
    console.error("Sheet URL is null or undefined. Cannot fetch data.");
    return null;
  }

  try {
    // Attempt to fetch the data from the provided URL.
    const response = await fetch(sheetURL);

    // Check if the network response was successful (status code 200-299).
    if (!response.ok) {
      // If not successful, throw an error with the status text.
      throw new Error(`Network response was not ok: ${response.statusText} (Status: ${response.status})`);
    }

    // Get the response body as plain text (CSV content).
    const csvText = await response.text();
    // Parse the CSV text into an array of JavaScript objects.
    const sheetObjects = csvToObjects(csvText);
    return sheetObjects; // Return the parsed data.
  } catch (error) {
    // Catch any errors that occur during the fetch or parsing process.
    console.error("Fetch error:", error);
    return null; // Return null to indicate failure.
  }
}
