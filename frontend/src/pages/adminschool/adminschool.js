import React, { useState, useEffect } from 'react';
import Menu2 from '../../components/menu2/menu2';
import Rightmenu from '../../components/rightmenu/rightmenu';
import Square from '../../components/square/square';
import Tag from '../../components/tag/tag';
import { useLocation } from 'react-router-dom';

function AdminSchool() {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='container'>
            <div className='container-left'>
                <Menu2 />
                <Tag name={localStorage.getItem('schoolName')} />
                <div className='squares'>
                    <Square icon='/assets/imgs/students2.svg' label="Estudiantes" route="/admin/students" />
                    <Square icon='/assets/imgs/teachers.svg' label="Profesores" route="/admin/teachers" />
                    <Square icon='/assets/imgs/schools.svg' label="Grupos" route="/admin/groups" />
                    <Square icon='/assets/imgs/courses.svg' label="Cursos" route="/admin/courses" />
                </div>
            </div>
            {!isSmallScreen && <div className='container-right'>
                <Rightmenu currentRoute={location.pathname} />
            </div>}
        </div>
    );
}

export default AdminSchool;