import React from 'react';
import Menu2 from '../../../components/menu2/menu2';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import Square from '../../../components/square/square';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './adminschool.css';
import { useTranslation } from 'react-i18next';

function AdminSchool() {
  const [t] = useTranslation('global');
  const location = useLocation();

  return (
    <div className='container adminschool-page'>
      <div className='container-left'>
        <Menu2 />
        <Tag name={localStorage.getItem('schoolName')} />
        <div className='squares'>
          <Square icon='/assets/imgs/students2.svg' label={t("student_p")} route="/admin/students" />
          <Square icon='/assets/imgs/teachers.svg' label={t("teacher_p")} route="/admin/teachers" />
          <Square icon='/assets/imgs/schools.svg' label={t("group_p")} route="/admin/groups" />
          <Square icon='/assets/imgs/courses.svg' label={t("course_p")} route="/admin/courses" />
        </div>
      </div>
      <div className='container-right'>
        <Rightmenu currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default AdminSchool;