import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExerciseCard from '../../../components/exerciseCard/ExerciseCard';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';
import GradeService from  '../../../services/grade.service';
import './TeacherGradesPage.css';

const TeacherGradesPage = () => {
    const { name, id, workUnitId, workUnitName, gradeid } = useParams();

    const [assignedExercises, setAssignedExercises] = useState([]);

    const [filteredData, setFilteredData] = useState([]);

    const getAllGrades = async () => {
        try {
            const allExercises = await GradeService.getGradesByExercises(gradeid);
            setAssignedExercises(allExercises);
            setFilteredData(allExercises);
        } catch (err) {
            message.error('Error al obtener ejercicios');
        }
    }

    useEffect(() => {
        getAllGrades();
        console.log(assignedExercises);
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
                />
            ))}
        </div>
    )

    return (
        <div className="student-home student-exercises">
            <Headers title={workUnitName} groupId={id} data={assignedExercises} onSearch={handleSearch} fieldName="studentName" />
            <div className='container-scloll'>

                <Tag name="Ejercicios" className="tags" />
                {showAssignedExercises()}

            </div>
        </div>
    );
}

export default TeacherGradesPage;