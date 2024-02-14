import React, { useEffect, useState } from 'react';
import Card from '../../../components/card/card';
import Headers from '../../../components/headers/headers';
import groupsService from '../../../services/groups.service';
import Tag from '../../../components/tag/tag';
import { jwtDecode } from 'jwt-decode';
import './studenthome.css'


const StudentExercises = () => {
    const  [title, setTitle] = useState('');

    

    useEffect(()=>{
       getGroup();
       console.log('se obtuvo');
    }, []);

    return (
        <div  className="student-home">
            <Headers title={title} />
            <div className='container-scloll'>
                <Tag name="Ejercicios" className="tags"/>
                <Card title={'ejercicio 1'} content={'10-02-2024'} />
                <Card title={'ejercicio 2'} content={'10-02-2024'} />
                <Card title={'ejercicio 3'} content={'10-02-2024'} />
                <Tag name="Ejercicios no evaluados" className="tags"/>
                <Card title={'ejercicio 1'} content={''} />
                <Card title={'ejercicio 2'} content={''} />
            </div>
        </div>
    );
}

export default StudentExercises;