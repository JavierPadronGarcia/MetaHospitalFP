const XLSX = require('xlsx');
const path = require('path');

const languagesDictionary = new Map([
  ["English", "en"],
  ["Spanish", "es"],
  ["Euskera [eu]", "eu"],
  ["Catala", "ca"],
  ["Galego [gl]", "gl"],
]);

function getWorkSheet(sheetName, wb) {
  return XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
}

function readFile(workUnitId) {
  const excelFilePath = path.join(__dirname, `I2Loc Gladiolos UT${workUnitId}.xlsx`);
  return XLSX.readFile(excelFilePath);
}

exports.getTranslations = (workUnitId, sheetName) => {
  const translationJSon = {};

  const wb = readFile(workUnitId);
  const sheetContent = getWorkSheet(sheetName, wb);

  const languages = Object.keys(sheetContent[0]);
  languages.splice(0, 1);

  translationJSon.languages = languages;
  translationJSon.shortLanguages = [...languages.map((language) => languagesDictionary.get(language))];
  translationJSon.translations = sheetContent;

  return translationJSon;
}

exports.getLanguages = () => {
  return languagesDictionary
}