import React from 'react';
import './menu.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined, LogoutOutlined, MenuOutlined, SettingFilled, UserOutlined } from '@ant-design/icons';
import authService from '../../services/auth.service';

function Menu() {

  const location = useLocation();
  const navigate = useNavigate();

  const getMenuActiveItem = () => {
    const { pathname } = location;

    if (pathname === '/admin/control-panel') {
      localStorage.removeItem('schoolId');
      return 'Inicio';
    } else if (pathname === '/admin/users') {
      return 'Usuarios';
    } else if (pathname === '/admin/schools') {
      return 'Escuelas';
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
      case 'users':
        navigate('/admin/users');
        break;
      case 'schools':
        navigate('/admin/schools');
        break;
      default:
        navigate('/admin/control-panel');
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
      label: <div>Usuarios</div>,
      key: 'users',
    },
    {
      label: <div>Escuelas</div>,
      key: 'schools',
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

  return (
    <div className="menu1">
      <nav>
        <div className='logo'>
          <img src='/assets/imgs/Icon.png' alt="logotype" className="logotype" onClick={() => navigate('/admin/control-panel')} />
        </div>
        <ul className="menuItems">
          <li>
            <Link
              to="/admin/control-panel"
              data-item="Inicio"
              className={getMenuActiveItem() === 'Inicio' ? 'active' : ''}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              data-item="Usuarios"
              className={getMenuActiveItem() === 'Usuarios' ? 'active' : ''}
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              to="/admin/schools"
              data-item="Escuelas"
              className={getMenuActiveItem() === 'Escuelas' ? 'active' : ''}
            >
              Escuelas
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
            <div className='setting-display'>
              <Space>
                Más opciones
                <DownOutlined />
              </Space>
            </div>
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

export default Menu;
