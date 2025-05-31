import { fetchCsvData } from './FetchDataService.js';

const vietnamData = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_placeholder_vietnam/pub?output=csv";
const pernambucoData = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_placeholder_pernambuco/pub?output=csv";
const germanyArmies = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgVF0EAsYl4RV8NIrSSS_xiLgYD41AFSw0s8uE54KXvJhYPSj2lzGl-zhL85UHgAfinyNFjxo5jKIu/pub?output=csv";
const germanyData = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQbDe_ajIW7B4tUSv6tekm5slTu-Ion19-L59g4vXx4rkBojNd0oCrV0qIyjVJxYppMi152ACnb33jC/pub?output=csv";

/**
 * Fetches conflict data based on the provided conflict name.
 * This function acts as a dispatcher, mapping a conflict name to its corresponding URL
 * and then using `fetchCsvData` to retrieve the data.
 *
 * @param {string} conflict - The name of the conflict (e.g., "vietnam", "pernambuco", "germanyArmies", "germanyData").
 * @returns {Promise<Array<Object>|null>} A promise that resolves to an array of objects
 * for the specified conflict, or null if the conflict name is not recognized or an error occurs during fetch.
 */

export async function FetchConflictData(conflict) {
  let sheetURL = null; // Initialize sheetURL to null.

  // Use a switch statement to select the correct URL based on the conflict name.
  switch (conflict) {
    case "vietnam":
      sheetURL = vietnamData;
      break;
    case "pernambuco":
      sheetURL = pernambucoData;
      break;
    case "germanyArmies":
      sheetURL = germanyArmies;
      break;
    case "germanyData":
      sheetURL = germanyData;
      break;
    default:
      // Log a warning if an unknown conflict name is provided.
      console.warn(`Unknown conflict specified: "${conflict}". No data will be fetched.`);
      return null; // Return null for unrecognized conflicts.
  }

  // Use the generic fetchCsvData function to get the data from the determined URL.
  return await fetchCsvData(sheetURL);
}