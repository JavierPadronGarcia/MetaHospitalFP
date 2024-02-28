import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Headers from '../../../components/headers/headers';
import Square from '../../../components/square/square';
import './teacher-selectionn.css';

const TeacherSelection = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const { name } = useParams();

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    return (
        <div className='teacher-selection-container'>
            <Headers title={name} Page={'selected'}/>
            <div className='Squares'>
                <Square label={'Students'} route={currentPath+'/students'} icon='/assets/imgs/users.svg'/>
                <Square label={'Units'} route={currentPath+'/units'} icon='/assets/imgs/schools.svg'/>
            </div>
        </div>
    );
}

export default TeacherSelection;
