import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Headers from '../../../components/headers/headers';
import Square from '../../../components/square/square';

const TeacherSelection = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const { name } = useParams();

    useEffect(() => {
        setCurrentPath(window.location.pathname);
    }, []);

    return (
        <div>
            <Headers title={name} Page={'selected'}/>
            <div>
                <Square label={'Students'} route={currentPath+'/students'}/>
                <Square label={'Units'} route={currentPath+'/units'}/>
            </div>
        </div>
    );
}

export default TeacherSelection;
