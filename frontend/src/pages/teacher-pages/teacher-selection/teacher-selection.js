import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Headers from '../../../components/headers/headers';
import Square from '../../../components/square/square';
import './teacher-selectionn.css';
import { useTranslation } from 'react-i18next';

const TeacherSelection = () => {

    const [t] = useTranslation('global');

    const currentPath = window.location.pathname;

    const { name, id } = useParams();

    const initialData = [
        { teacherSearch: t('student_p'), route: currentPath + '/students', icon: '/assets/imgs/users.svg' },
        { teacherSearch: t('unit_p'), route: currentPath + '/units', icon: '/assets/imgs/schools.svg' }
    ];

    const [searchResult, setSearchResult] = useState(initialData);

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
                data={initialData}
                onSearch={handleSearch}
                fieldName={'teacherSearch'}
            />
            {renderSquares()}
        </div>
    );
}

export default TeacherSelection;
