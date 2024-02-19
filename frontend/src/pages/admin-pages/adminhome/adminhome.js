import React from 'react';
import Menu from '../../../components/menu/menu';
import Rightmenu from '../../../components/rightmenu/rightmenu';
import Square from '../../../components/square/square';
import Tag from '../../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import './adminhome.css';

function AdminHome() {
  const location = useLocation();

  return (
    <div className='container adminhome-page'>
      <div className='container-left'>
        <Menu />
        <Tag name="Bienvenido Admin" />
        <div className='squares'>
          <Square icon='/assets/imgs/users.svg' label="Usuarios" route="/admin/users" />
          <Square icon='/assets/imgs/schools.svg' label="Escuelas" route="/admin/schools" />
        </div>
      </div>
      <div className='container-right'>
        <Rightmenu currentRoute={location.pathname} />
      </div>
    </div>
  );
}

export default AdminHome;