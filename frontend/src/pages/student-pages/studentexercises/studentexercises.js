import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import Card from '../../../components/card/card';
import ExerciseCard from '../../../components/exerciseCard/ExerciseCard';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';
import exercisesService from '../../../services/exercises.service';
import './StudentExercises.css';

const StudentExercises = () => {
  const workUnit = JSON.parse(localStorage.getItem('actualWorkUnit'));
  const studentGroup = JSON.parse(localStorage.getItem('studentGroup'));
  const title = workUnit.name;

  const [exercises, setExercises] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // const [assignedExercises, setAssignedExercises] = useState([]);
  // const [unAssignedExercises, setUnAssignedExercises] = useState([]);

  const getAllExercises = async () => {
    try {
      const allExercises = await exercisesService.getAllExercisesAssignedToStudent(studentGroup.id, workUnit.id);
      setExercises(allExercises);
      setFilteredData(allExercises);
    } catch (err) {
      message.error('Error al obtener ejercicios');
    }
  }

  useEffect(() => {
    getAllExercises();
  }, []);

  const showAssignedExercises = () => (
    <div className='student-exercises-assigned-exercises'>
      {filteredData.map((exercise, index) => (
        <ExerciseCard
          key={index}
          title={exercise.caseName}
          participationGrades={{ finalGrade: exercise.finalGrade, itemGrades: exercise?.grades }}
          date={exercise.submittedAt}
        />
      ))}
    </div>
  )

  // const showUnAssignedExercises = () => (
  //   <>
  //     {filteredData.filter((e) => e.assigned === 0).map((exercise, index) => (
  //       <Card key={index} title={exercise.caseName} content={''} />
  //     ))}
  //   </>
  // )

  const handleSearch = (filteredData) => {
    setFilteredData(filteredData);
  };

  return (
    <div className="student-home student-exercises">
      <Headers
        title={title}
        groupId={studentGroup.id}
        data={exercises}
        onSearch={handleSearch}
        fieldName="caseName"
      />
      <div className='container-scloll'>

        <Tag name="Ejercicios" className="tags" />
        {showAssignedExercises()}

        {/* <Tag name="Ejercicios no evaluados" className="tags" />
        {showUnAssignedExercises()} */}
      </div>
    </div>
  );
}

export default StudentExercises;

// <ExerciseCard key={index} title={exercise.caseName} content={dayjs(exercise.finishDate).format('DD-MM-YYYY')} />