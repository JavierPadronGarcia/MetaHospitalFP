import { DownloadOutlined } from '@ant-design/icons';
import { Affix, Button } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useParams } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import GradeService from '../../services/grade.service';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useNotification from '../../utils/shared/errorHandler';

dayjs.extend(customParseFormat);

const FloatingExcelButton = ({ data, name, forGrades, manySheets, groupID, groupNAME }) => {

  const params = useParams();
  const { errorMessage, noConnectionError } = useNotification();
  const groupName = params.name || groupNAME || localStorage.getItem('groupsName');
  const groupId = params.id || groupID || localStorage.getItem('groupsId');
  const [t] = useTranslation('global');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    GradeService.getAllGradesOnAGroupForExcel(groupId).then((gradesData) => {
      const wb = utils.book_new();

      const newSheetName = t('excel_general_information');
      const newSheetData = [
        [t('excel_general_student_information')],
        [],
        [t('group_s') + ':', groupName],
        [t('date_generated') + ":", dayjs().format('DD-MM-YYYY')],
        [],
        ['UT', t('case_s'), t('final_grade'), t('submit_date'), t('submit_time'), t('student_s')],
      ];

      gradesData.forEach((data) => {
        newSheetData.push(Object.values((data)));
      });

      const newSheet = utils.aoa_to_sheet(newSheetData);
      const dataSize = gradesData.length;

      newSheet['!autofilter'] = { ref: `A6:F${dataSize + 6}` };
      // { f: `HYPERLINK("#'${studentName}'!A1", "Ver detalles")` }
      utils.book_append_sheet(wb, newSheet, newSheetName);
      // gradesData.forEach(({ studentName, finalGrade, grades }) => {
      //   const parsedGrades = parseGrades(grades);
      //   const ws = utils.json_to_sheet([...parsedGrades]);
      //   const studentInfo = [[`Nombre:`, ` ${studentName}`, '', `Nota final:`, `${finalGrade}`], []];
      //   const newWsData = studentInfo.concat(utils.sheet_to_json(ws, { header: 1 }));
      //   const newWs = utils.aoa_to_sheet(newWsData);
      //   utils.book_append_sheet(wb, newWs, studentName);
      // });

      const filename = name + ".xlsx" || 'grades.xlsx';
      writeFile(wb, filename, { bookType: 'xlsx', type: 'buffer' });
    }).catch((err) => {
      if (!err.response) {
        noConnectionError();
      } else {
        errorMessage(t('error_while_generating_excel'), t('try_again'));
      }
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
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
        loading={loading}
        icon={<DownloadOutlined />}
        size="large"
        onClick={() => {
          if (forGrades) {
            generateExcelOfGrades();
          } else if (manySheets) {
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
