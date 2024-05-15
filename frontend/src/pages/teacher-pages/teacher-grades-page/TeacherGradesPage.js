import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseCard from '../../../components/exerciseCard/ExerciseCard';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';
import GradeService from '../../../services/grade.service';
import './TeacherGradesPage.css';
import FloatingExcelButton from '../../../components/FloatingExcelButton/FloatingExcelButton ';
import FilterComponent from '../../../components/filterDateComponent/filterDateComponent';
import { useTranslation } from 'react-i18next';
import useNotification from '../../../utils/shared/errorHandler';

const TeacherGradesPage = () => {
    const { id, workUnitName, gradeid } = useParams();
    const [t] = useTranslation('global');
    const { noConnectionError, exerciseGetError } = useNotification();

    const [exercises, setExercises] = useState([]);
    const [filteredData, setFilteredData] = useState([]);


    const getAllGrades = async () => {
        try {
            const allExercises = await GradeService.getGradesByExercises(gradeid);
            setExercises(allExercises);
            setFilteredData(allExercises);
        } catch (err) {
            if (!err.response) {
                noConnectionError();
            } else {
                exerciseGetError();
            }
        }
    }

    useEffect(() => {
        getAllGrades();
    }, []);

    const handleSearch = (filteredData) => {
        setFilteredData(filteredData);
    };

    const showAssignedExercises = () => (
        <div className='student-exercises-assigned-exercises'>
            {filteredData.map((exercise, index) => (
                <ExerciseCard
                    key={index}
                    title={exercise.studentName}
                    participationGrades={{ finalGrade: exercise.finalGrade, itemGrades: exercise?.grades }}
                    date={exercise.submittedAt}
                />
            ))}
        </div>
    )

    return (
        <div className="student-home student-exercises">
            <Headers title={workUnitName} groupId={id} data={exercises} onSearch={handleSearch} fieldName="studentName" />
            <div className='container-scloll'>
                <FilterComponent data={exercises} onFilter={handleSearch}></FilterComponent>

                <Tag name={t('exercise_p')} className="tags" />
                {showAssignedExercises()}

                <FloatingExcelButton
                    data={filteredData}
                    name={t('student_grades')}
                    forGrades={true}
                />
            </div>
        </div>
    );
}

export default TeacherGradesPage;