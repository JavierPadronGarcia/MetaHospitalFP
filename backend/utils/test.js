const { addWorkUnits, addItems, addItemPlayerRoles, addItemCases } = require('./seederUtils');
const fs = require('fs');
const itemCases = addItemCases();
const jsonData = JSON.stringify(itemCases, null, 2);
fs.writeFile('debug.json', jsonData, err => {
  if (err) {
    console.error('Error al escribir en el archivo debug.json:', err);
  } else {
    console.log('Datos escritos en el archivo debug.json correctamente.');
  }
});