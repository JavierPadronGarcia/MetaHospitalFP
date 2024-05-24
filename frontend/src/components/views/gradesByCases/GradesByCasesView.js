import { useEffect, useState } from "react";
import Accordion from "../../accordion/Accordion";
import ExerciseCard from "../../exerciseCard/ExerciseCard";
import "./GradesByCasesView.css";
import gradeService from "../../../services/grade.service";

const GradesByCasesView = ({ groupId, dataFetched, prefetchedData }) => {

  const [gradesContent, setGradesContent] = useState([]);

  useEffect(() => {

    async function getGradesContent() {
      try {
        const data = await gradeService.getAllGradesOnAGroup(groupId);
        let dataGroupedByWorkUnit = groupReturnedData(data);
        setGradesContent(dataGroupedByWorkUnit);
        if (dataFetched) dataFetched();
      } catch (err) {
        if (dataFetched) dataFetched(err);
      }
    }

    if (!prefetchedData) {
      getGradesContent();
    } else {
      let dataGroupedByWorkUnit = groupReturnedData(prefetchedData);
      setGradesContent(dataGroupedByWorkUnit);
    }
  }, [prefetchedData]);

  const groupReturnedData = (data) => {
    return data.reduce((acc, item) => {

      let workUnit = acc.find(unit => unit.workUnitId === item.workUnitId);

      if (!workUnit) {
        workUnit = {
          workUnitId: item.workUnitId,
          workUnitName: item.workUnitName,
          cases: []
        };
        acc.push(workUnit);
      }

      let workCase = workUnit.cases.find(caseItem => caseItem.caseId === item.caseId);

      if (!workCase) {
        workCase = {
          caseId: item.caseId,
          caseName: item.caseName,
          caseNumber: item.caseNumber,
          students: []
        };
        workUnit.cases.push(workCase);
      }

      workCase.students.push({
        studentId: item.studentId,
        studentName: item.studentName,
        finalGrade: item.finalGrade,
        participationId: item.participationId,
        grades: item.grades,
        submittedAt: item.submittedAt
      });

      return acc;
    }, []);
  }

  return (
    <div className="grades-by-cases-view">
      {gradesContent.length !== 0 &&
        gradesContent.map((workUnit) => {
          return (
            <Accordion
              title={workUnit.workUnitName}
              customClass='grades-by-cases-view-accordion'
              key={workUnit.workUnitId}
            >
              {workUnit.cases.map((workCase, index) => {
                return (
                  <Accordion
                    title={workCase.caseNumber + ". " + workCase.caseName}
                    customClass='grades-by-cases-view-accordion-item'
                    key={workCase.caseId + '-' + index}
                  >
                    {workCase.students.map((student, index) => {
                      return (
                        <ExerciseCard
                          key={student.studentId + '-' + index}
                          title={student.studentName}
                          participationGrades={{
                            finalGrade: student.finalGrade,
                            itemGrades: student.grades,
                          }}
                          date={student.submittedAt}
                          customClass='grades-by-cases-view-exercise-card'
                        />
                      )
                    })}
                  </Accordion>
                )
              })}
            </Accordion>
          )
        })
      }
    </div>
  );
}

export default GradesByCasesView;