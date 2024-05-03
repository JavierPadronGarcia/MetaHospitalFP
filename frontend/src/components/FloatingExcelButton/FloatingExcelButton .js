import { DownloadOutlined } from '@ant-design/icons';
import { Affix, Button } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import { useParams } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';

dayjs.extend(customParseFormat);

const FloatingExcelButton = ({ data, name, forGrades }) => {

  const params = useParams();
  const groupName = params.name;

  const generateExcel = () => {
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, name + '.xlsx');
  }

  const generateExcelWithMoreSheets = () => {
    const wb = utils.book_new();
    const workSheets = [];
    data.forEach((dataForSheet) => {
      const workSheet = utils.json_to_sheet(dataForSheet.content)
      workSheets.push(workSheet);
      utils.book_append_sheet(wb, workSheet, dataForSheet.sheetTitle);
    })
    writeFile(wb, name + '.xlsx');
  }

  const generateExcelOfGrades = () => {
    const gradesData = [...data];
    const wb = utils.book_new();

    const newSheetName = "Información General";
    const newSheetData = [
      ["Información general de los estudiantes"],
      [],
      ['Grupo:', groupName],
      ["Fecha de generación:", dayjs().format('DD-MM-YYYY')],
      [],
      ['Nombre del estudiante', 'Nota final'],
    ];

    gradesData.forEach(({ studentName, finalGrade }) => {
      newSheetData.push([studentName, String(finalGrade), { f: `HYPERLINK("#'${studentName}'!A1", "Ver detalles")` }])
    });

    const newSheet = utils.aoa_to_sheet(newSheetData);
    utils.book_append_sheet(wb, newSheet, newSheetName);

    gradesData.forEach(({ studentName, finalGrade, grades }) => {
      const parsedGrades = parseGrades(grades);
      const ws = utils.json_to_sheet([...parsedGrades]);
      const studentInfo = [[`Nombre:`, ` ${studentName}`, '', `Nota final:`, `${finalGrade}`], []];
      const newWsData = studentInfo.concat(utils.sheet_to_json(ws, { header: 1 }));
      const newWs = utils.aoa_to_sheet(newWsData);
      utils.book_append_sheet(wb, newWs, studentName);
    });

    const name = 'grades.xlsx';
    writeFile(wb, name, { bookType: 'xlsx', type: 'buffer' });
  };


  const parseGrades = (gradesArray) => {
    return gradesArray.map(({ gradeCorrect, gradeValue, itemName }) => (
      {
        "nombre_interacción": itemName,
        "correcto": gradeCorrect,
        "nota": gradeValue,
      }
    ));
  }

  return (
    <Affix style={{ position: 'fixed', bottom: 20, left: 20 }}>
      <Button
        type="primary"
        shape="circle"
        icon={<DownloadOutlined />}
        size="large"
        onClick={() => {
          if (forGrades) {
            generateExcelOfGrades();
          } else if (Array.isArray(data)) {
            generateExcelWithMoreSheets();
          } else {
            generateExcel();
          }
        }}
      />
    </Affix>
  );
}

export default FloatingExcelButton;
