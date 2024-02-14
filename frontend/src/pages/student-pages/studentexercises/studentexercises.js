import React, { useEffect, useState } from 'react';
import Card from '../../../components/card/card';
import Headers from '../../../components/headers/headers';
import Tag from '../../../components/tag/tag';
import exercisesService from '../../../services/exercises.service';

const StudentExercises = () => {
    const [workUnit, setWorkUnit] = useState(JSON.parse(localStorage.getItem('actualWorkUnit')));
    const [studentGroup, setStudentGroup] = useState(JSON.parse(localStorage.getItem('studentGroup')));
    const [title, setTitle] = useState(workUnit.name);

    const getAllExercises = async () => {
        const allExercises = await exercisesService.getAllExercisesAssignedToStudent(workUnit.id, studentGroup.id);
        console.log(allExercises);
    }

    useEffect(() => {
        getAllExercises();
    }, []);

    return (
        <div className="student-home">
            <Headers title={title} />
            <div className='container-scloll'>
                <Tag name="Ejercicios" className="tags" />
                <Card title={'ejercicio 1'} content={'10-02-2024'} />
                <Card title={'ejercicio 2'} content={'10-02-2024'} />
                <Card title={'ejercicio 3'} content={'10-02-2024'} />
                <Tag name="Ejercicios no evaluados" className="tags" />
                <Card title={'ejercicio 1'} content={''} />
                <Card title={'ejercicio 2'} content={''} />
            </div>
        </div>
    );
}

export default StudentExercises;