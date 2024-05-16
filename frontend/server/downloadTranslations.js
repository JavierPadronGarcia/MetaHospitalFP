require('dotenv').config();
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

function downloadTranslations() {
  const filePath = process.env.REACT_APP_TRANSLATIONS_SHEET;

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    const buffer = Buffer.from(data, 'binary');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const translationsByLanguage = {};
    const languages = ['en', 'es', 'eu', 'ca', 'gl'];
    const columnNames = ['Tname', ...languages];

    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: columnNames })
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
