const fs = require('fs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

exports.saveErrorLog = (jsonToSave, error, errorCode) => {
  const stringifiedJSon = JSON.stringify(jsonToSave);
  let logContent = '';

  logContent += `\n-----------------------------------------------------------\n`;
  logContent += `-----------------------------------------------------------\n`;
  logContent += `Date: ${dayjs().utcOffset(60).format('DD-MM-YYYY HH:mm:ss')} \n`;
  logContent += `Error code: ${errorCode} \n`;
  logContent += `Error message: ${error.message} \n`;
  logContent += `-----------------------------------------------------------\n`;
  logContent += `Data received: ${stringifiedJSon} \n`;
  logContent += `-----------------------------------------------------------\n`;
  logContent += `-----------------------------------------------------------\n`;

  const filename = `${__dirname}/../logs/gradesErrorLogs.log`;

  fs.writeFile(filename, logContent, { flag: 'a' }, (err) => {
    if (err) {
      console.error('Error al guardar el archivo de log:', err);
    } else {
      console.log('Log agregado exitosamente en', filename);
    }
  });
}