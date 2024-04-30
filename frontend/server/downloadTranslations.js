const axios = require('axios');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function downloadTranslations() {
  const fileURL = 'https://docs.google.com/spreadsheets/d/1ZgjDaLHXk1BUxS0OfvEHqP5ZGK_fnWcEbg2_-Xadmt0/edit?pli=1#gid=1985820596';

  axios({
    method: 'GET',
    url: fileURL,
    responseType: 'arraybuffer'
  })
    .then(response => {
      const filePath = path.join(__dirname, '../public/translations.xlsx');
      const buffer = Buffer.from(response.data, 'binary');
      fs.writeFileSync(filePath, buffer);
      console.log('Translations file saved successfully.');
    })
    .catch(error => {
      console.error('Error downloading the translations', error);
    });
}

module.exports = downloadTranslations;
// const workbook = XLSX.readFile(filePath);
// const sheetName = workbook.SheetNames[0];
// console.log(workbook.SheetNames);
// const sheet = workbook.Sheets[sheetName];
// const columnNames = ['rowIndex', 'Tname', 'en', 'es'];

// const jsonData = XLSX.utils.sheet_to_json(sheet, { header: columnNames });

// cron.schedule('0 0 * * *', () => {
//    console.log('Running translation update...');
//    downloadTranslations();
// });