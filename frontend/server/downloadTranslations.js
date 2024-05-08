require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function downloadTranslations() {
  const fileURL = process.env.REACT_APP_TRANSLATIONS_SHEET;

  axios({
    method: 'GET',
    url: fileURL,
    responseType: 'arraybuffer'
  })
    .then(response => {
      const buffer = Buffer.from(response.data, 'binary');

      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const translationsByLanguage = {};
      const range = XLSX.utils.decode_range(sheet['!ref']);
      const languages = ['en', 'es', 'eu', 'ca', 'gl'];
      const columnNames = ['rowIndex', 'Tname', ...languages];

      range.s.r = 2;

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: columnNames, range })
        .filter(row => row.Tname !== undefined);

      languages.forEach(language => {
        translationsByLanguage[language] = jsonData.map(entry => ({
          [entry.Tname]: entry[language]
        }));
      });

      languages.forEach(language => {
        const languageFolderPath = path.join(__dirname, `../src/translations/${language}`);
        if (!fs.existsSync(languageFolderPath)) {
          fs.mkdirSync(languageFolderPath, { recursive: true });
        }
        const jsonFilePath = path.join(languageFolderPath, 'global.json');

        const translationsObject = arrayToObject(translationsByLanguage[language]);

        fs.writeFileSync(jsonFilePath, JSON.stringify(translationsObject, null, 2));
        console.log(`Translations JSON file for ${language} saved successfully.`);
      });
    })
    .catch(error => {
      console.error('Error downloading the translations', error);
    });
}

function arrayToObject(array) {
  const result = {};
  array.forEach(obj => {
    const key = Object.keys(obj)[0];
    const value = obj[key];
    result[key] = value;
  });
  return result;
}

downloadTranslations();