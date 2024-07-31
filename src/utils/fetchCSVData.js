import { useEffect, useState } from 'react';
import axios from 'axios';

/*export default function FetchCSVData(props) {
    var csvData = [];

    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSeJPHxx-bPj0Rny8jcvucyfDrp5oDU3A9fBY-cGRMCpDYvNepRXVMeLSiA8JeR6lJTtqGFnetFbL01/pubhtml';

    axios.get(csvUrl)
        .then((response) => {
            const parsedCsvData = parseCSV(response.data); // Parse the CSV data into an array of objects
            csvData = parsedCsvData; // Set the fetched data in the component's state
            console.log(parsedCsvData); // Log the parsed data to verify
            console.log(7, response)
        })
        .catch((error) => {
            console.error('Error fetching CSV data:', error);
        });
    
// Empty dependency array means it runs only once, like componentDidMount

    function parseCSV(csvText) {
        const rows = csvText.split(/\r?\n/);
        const headers = rows[0].split(',');
        const data = [];
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(',');
            if (rowData.length === headers.length) { // Ensure the row is valid
                const rowObject = {
                    Coordinates: rowData[0],
                    Icon: rowData[1],
                    Text: rowData[2]
                };
                data.push(rowObject);
            }
        }
        return data;
    }

    return csvData;
}*/

export default async function FetchCSVData(sheetURL) {
    if (sheetURL != 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVXTWQtJYVaG0cBLzdfPoNX0HDL-hRl8QeaShGJIBW-hBbfJ-sKll7sO-XHJHUgOH6YVbC3oFTpbz3/pub?output=csv' &&
        sheetURL != 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWg5lT88cGN058YKWPE2xcw5EFoxngZc6ybo_9PmVlE_GZt86_jgTm-B6-OcqeoWN8ybhrYH0ChzDg/pub?output=csv'){
        throw new Error('Unknown sheet');
    } 
    
    try {
        const response = await fetch(sheetURL);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const csvText = await response.text();
        const sheetObjects = csvToObjects(csvText);
        return sheetObjects;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;  // or handle the error as appropriate
    }

    function csvToObjects(csv) {
        const csvRows = csv.split("\n").map(row => row.trim()).filter(row => row);
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
