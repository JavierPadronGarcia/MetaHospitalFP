import React, { useEffect, useState } from 'react';
import Card from '../../../components/card/card';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';
import exercisesService from '../../../services/exercises.service';
import dayjs from 'dayjs';
import { message } from 'antd';

const StudentExercises = () => {
  const [workUnit, setWorkUnit] = useState(JSON.parse(localStorage.getItem('actualWorkUnit')));
  const [studentGroup, setStudentGroup] = useState(JSON.parse(localStorage.getItem('studentGroup')));
  const [assignedExercises, setAssignedExercises] = useState([]);
  const [unAssignedExercises, setUnAssignedExercises] = useState([]);
  const [title, setTitle] = useState(workUnit.name);

  const getAllExercises = async () => {
    try {
      const allExercises = await exercisesService.getAllExercisesAssignedToStudent(workUnit.id, studentGroup.id);
      console.log(allExercises)
      setAssignedExercises(allExercises.filter((e) => e.assigned === 1));
      setUnAssignedExercises(allExercises.filter((e) => e.assigned === 0));
      console.log(allExercises.filter((e) => e.assigned === 0))
    } catch (err) {
      message.error('Error al obtener ejercicios');
    }
  }

  useEffect(() => {
    getAllExercises();
  }, []);

  const showAssignedExercises = () => (
    <>
      {assignedExercises.map(exercise => (
        <Card title={exercise.caseName} content={dayjs(exercise.finishDate).format('DD-MM-YYYY')} />
      ))}
    </>
  )

  const showUnAssignedExercises = () => (
    <>
      {unAssignedExercises.map(exercise => (
        <Card title={exercise.caseName} content={''} />
      ))}
    </>
  )

  return (
    <div className="student-home">
      <Headers title={title} groupId={studentGroup.id} />
      <div className='container-scloll'>

        <Tag name="Ejercicios" className="tags" />
        {showAssignedExercises()}

        <Tag name="Ejercicios no evaluados" className="tags" />
        {showUnAssignedExercises()}
      </div>
    </div>
  );
}

export default StudentExercises;