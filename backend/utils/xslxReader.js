const XLSX = require('xlsx');
const path = require('path');

const excelFilePath = path.join(__dirname, 'Ejercicios UT 10.xlsx');

const workbook = XLSX.readFile(excelFilePath);

function getWorkSheet(index, wb = workbook) {
  const workSheetName = wb.SheetNames[index];
  return XLSX.utils.sheet_to_json(wb.Sheets[workSheetName]);
}

function readFile(workUnitId) {
  switch (workUnitId) {
    case 10:
      const excelFilePathU10 = path.join(__dirname, 'Ejercicios UT 10.xlsx');
      return XLSX.readFile(excelFilePathU10);
    case 6:
      const excelFilePathU6 = path.join(__dirname, 'Ejercicios UT 6.xlsx');
      return XLSX.readFile(excelFilePathU6);
    default:
      return;
  }
}
exports.getItems = (workUnitId) => {

  const wb = readFile(workUnitId);
  const interactions = getWorkSheet(1, wb);

  return interactions.map(interaction => ({
    name: interaction.Interacciones || interaction.Interaccion,
    value: interaction.Nota,
    itemNumber: Number(interaction.ID.replace('int', '')) + 1,
    description: interaction['Descripción'] || interaction['Descripcion'],
    roles: parseRoles((interaction.Rol.toString()).split('_'))
  }))

  function parseRoles(roles) {
    const parsedRoles = [];
    for (const role of roles) {
      parsedRoles.push(Number(role) + 1)
    }
    return parsedRoles;
  }
}

exports.getCases = (workUnitId) => {

  const wb = readFile(workUnitId);
  const cases = getWorkSheet(0, wb);

  return cases.map((eachCase, index) => {
    let items = '';
    let itemsFound = false;

    Object.keys(eachCase).forEach(key => {
      if (!itemsFound && key.toLowerCase().includes('paso')) {
        itemsFound = true;
      }

      if (itemsFound) {
        items += eachCase[key] + '_';
        delete eachCase[key];
      }
    });

    eachCase.ID = Number(eachCase.ID.replace('ej', '')) + 1;
    eachCase['Items'] = (items.slice(0, -1)).split('_');

    return {
      name: eachCase.Ejercicio,
      workUnitID: workUnitId,
      caseNumber: eachCase.ID,
      Items: eachCase.Items
    };
  });
};

exports.getRoles = () => {
  const legendSheet = getWorkSheet(2);
  const roles = [];

  for (let i = 0; i < legendSheet.length; i++) {
    const role = legendSheet[i];
    if (Object.keys(role)[0].includes('Rol')) {
      break;
    }
    roles.push(role);
  }

  const parsedRoles = roles.map(role => ({
    id: ++role.ID,
    name: role[(Object.keys(role))[1]]
  }));

  return parsedRoles;
}