import React from 'react';
import Menu from '../../../components/menu/menu';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import Square from '../../../components/square/square';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './adminhome.css';
import { useTranslation } from 'react-i18next';

function AdminHome() {
  const [t] = useTranslation('global');
  const location = useLocation();

  return (
    <div className='container adminhome-page'>
      <div className='container-left'>
        <Menu />
        <Tag name={t('admin_welcome')} />
        <div className='squares'>
          <Square icon='/assets/imgs/users.svg' label={t('user_p')} route="/admin/users" />
          <Square icon='/assets/imgs/schools.svg' label={t('school_p')} route="/admin/schools" />
        </div>
      </div>
      <div className='container-right'>
        <Rightmenu currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default AdminHome;