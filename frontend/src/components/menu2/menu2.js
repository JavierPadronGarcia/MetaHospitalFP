import React from 'react';
import './menu2.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DownOutlined, LogoutOutlined, MenuOutlined, SettingFilled, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button } from 'antd';
import authService from '../../services/auth.service';

function Menu2() {
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuActiveItem = () => {
    const { pathname } = location;

    if (pathname === '/admin/school') {
      return 'Inicio';
    } else if (pathname === '/admin/students') {
      return 'Estudiantes';
    } else if (pathname === '/admin/teachers') {
      return 'Profesores';
    } else if (pathname === '/admin/groups' || pathname === '/admin/group') {
      return 'Grupos';
    } else if (pathname === '/admin/courses') {
      return 'Cursos';
    }

    return 'Inicio';
  };

  const handleMoreOptionsClick = (e) => {
    switch (e.key) {
      case 'profile':
        navigate('/myUser');
        break;
      case 'logout':
        authService.logout();
        navigate('/');
        break;
      case 'students':
        navigate('/admin/students');
        break;
      case 'teachers':
        navigate('/admin/teachers');
        break;
      case 'groups':
        navigate('/admin/groups');
        break;
      case 'courses':
        navigate('/admin/courses');
        break;
      default:
        navigate('/admin/school');
        break;
    }
  }

  const dropdownItems = [
    {
      label: <div>Mi perfil</div>,
      icon: <UserOutlined />,
      key: 'profile',
    },
    {
      type: 'divider',
    },
    {
      label: <div>Cerrar sesión</div>,
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const smallDropdownItems = [
    {
      label: <div>Inicio</div>,
      key: 'home',
    },
    {
      type: 'divider',
    },
    {
      label: <div>Estudiantes</div>,
      key: 'students',
    },
    {
      label: <div>Profesores</div>,
      key: 'teachers',
    },
    {
      label: <div>Grupos</div>,
      key: 'groups',
    },
    {
      label: <div>Cursos</div>,
      key: 'courses',
    },
    {
      type: 'divider',
    },
    {
      label: <div>Mi perfil</div>,
      icon: <UserOutlined />,
      key: 'profile',
    },
    {
      type: 'divider',
    },
    {
      label: <div>Cerrar sesión</div>,
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const isSchoolAdmin = localStorage.getItem('isSchoolAdmin');

  return (
    <div className="menu2">
      <nav>
        <div className='logotype-container'>
          <img src='/assets/imgs/Icon.png' alt="logotype" className="logotype" style={{ cursor: (!isSchoolAdmin || isSchoolAdmin !== 'true') ? 'pointer' : '' }}
            onClick={() => {
              if (!isSchoolAdmin || isSchoolAdmin !== 'true') {
                navigate('/admin/control-panel');
              }
            }}
          />
        </div>
        <ul className="menuItems">
          <li>
            <Link
              to="/admin/school"
              data-item="Inicio"
              className={getMenuActiveItem() === 'Inicio' ? 'active' : ''}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/admin/students"
              data-item="Estudiantes"
              className={getMenuActiveItem() === 'Estudiantes' ? 'active' : ''}
            >
              Estudiantes
            </Link>
          </li>
          <li>
            <Link
              to="/admin/teachers"
              data-item="Profesores"
              className={getMenuActiveItem() === 'Profesores' ? 'active' : ''}
            >
              Profesores
            </Link>
          </li>
          <li>
            <Link
              to="/admin/groups"
              data-item="Grupos"
              className={getMenuActiveItem() === 'Grupos' ? 'active' : ''}
            >
              Grupos
            </Link>
          </li>
          <li>
            <Link
              to="/admin/courses"
              data-item="Cursos"
              className={getMenuActiveItem() === 'Cursos' ? 'active' : ''}
            >
              Cursos
            </Link>
          </li>
        </ul>
      </nav>
      <div className='more-options-container'>
        <Dropdown
          className='more-options-dropdown'
          menu={{
            items: dropdownItems,
            onClick: handleMoreOptionsClick
          }}
          trigger={['click']}
        >
          <div onClick={(e) => e.preventDefault()} shape='circle' className='more-options-content'>
            <Button shape='circle' className='setting-icon'>
              <SettingFilled />
            </Button>
          </div>
        </Dropdown>

        <Dropdown
          className='more-options-dropdown-small-screen'
          menu={{
            items: smallDropdownItems,
            onClick: handleMoreOptionsClick
          }}
          trigger={['click']}
        >
          <div onClick={(e) => e.preventDefault()} className='more-options-content'>
            <MenuOutlined className='setting-icon' />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}

export default Menu2;

