import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Headers from '../../../components/headers/headers';
import Square from '../../../components/square/square';
import './teacher-selectionn.css';

const TeacherSelection = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const { name, id } = useParams();
    const initialData = [
        { teacherSearch: 'Estudiantes', route: currentPath + '/students', icon: '/assets/imgs/users.svg' },
        { teacherSearch: 'Unidades', route: currentPath + '/units', icon: '/assets/imgs/schools.svg' }
    ];
    const [data, setData] = useState(initialData);
    const [searchResult, setSearchResult] = useState(data);

    const handleSearch = (filteredData) => {
        setSearchResult(filteredData);
    };

    useEffect(() => {
    }, [searchResult]);

    const renderSquares = () => {
        return (
            <div className='Squares'>
                {searchResult.map((item, index) => (
                    <Square icon={item.icon} label={item.teacherSearch} route={item.route} />
                ))}
            </div>
        );
    }

    return (
        <div className='teacher-selection-container'>
            <Headers
                title={name}
                Page={'selected'}
                groupData={{ groupId: id, groupName: name }}
                data={data}
                onSearch={handleSearch}
                fieldName={'teacherSearch'}
            />
            {renderSquares()}
        </div>
    );
}

export default TeacherSelection;
