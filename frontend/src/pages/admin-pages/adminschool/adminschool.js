import React from 'react';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import Square from '../../../components/square/square';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import FloatingMenu from '../../../components/FloatingMenu/FloatingMenu';
import './adminschool.css';

function AdminSchool() {
  const location = useLocation();

  return (
    <div className='container adminschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name={localStorage.getItem('schoolName')} />
        <div className='squares'>
          <Square icon='/assets/imgs/students2.svg' label="Estudiantes" route="/admin/students" />
          <Square icon='/assets/imgs/teachers.svg' label="Profesores" route="/admin/teachers" />
          <Square icon='/assets/imgs/schools.svg' label="Grupos" route="/admin/groups" />
          <Square icon='/assets/imgs/courses.svg' label="Cursos" route="/admin/courses" />
        </div>
        <FloatingMenu />
      </div>
      <div className='container-right'>
        <Rightmenu currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default AdminSchool;