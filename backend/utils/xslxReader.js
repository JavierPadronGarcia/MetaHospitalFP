const XLSX = require('xlsx');
const path = require('path');

const excelFilePath = path.join(__dirname, 'Ejercicios UT 10.xlsx');

const workbook = XLSX.readFile(excelFilePath);

function getWorkSheet(index) {
  const workSheetName = workbook.SheetNames[index];
  return XLSX.utils.sheet_to_json(workbook.Sheets[workSheetName]);
}

exports.getItems = () => {

  const interactions = getWorkSheet(1);

  return interactions.map(interaction => ({
    id: Number(interaction.ID.replace('int', '')) + 1,
    name: interaction.Interacciones,
    value: interaction.Nota,
    description: interaction['Descripción'],
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
  const cases = getWorkSheet(0);

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
      id: ++index,
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