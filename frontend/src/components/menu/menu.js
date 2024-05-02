import React from 'react';
import './menu.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined, LogoutOutlined, MenuOutlined, SettingFilled, UserOutlined } from '@ant-design/icons';
import authService from '../../services/auth.service';
import { useTranslation } from 'react-i18next';

function Menu() {

  const [t] = useTranslation('global');
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
      label: <div>{t('my_profile')}</div>,
      icon: <UserOutlined />,
      key: 'profile',
    },
    {
      type: 'divider',
    },
    {
      label: <div>{t('logout')}</div>,
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const smallDropdownItems = [
    {
      label: <div>{t('home')}</div>,
      key: 'home',
    },
    {
      label: <div>{t('user_p')}</div>,
      key: 'users',
    },
    {
      label: <div>{t('school_p')}</div>,
      key: 'schools',
    },
    {
      type: 'divider',
    },
    {
      label: <div>{t('my_profile')}</div>,
      icon: <UserOutlined />,
      key: 'profile',
    },
    {
      type: 'divider',
    },
    {
      label: <div>{t('logout')}</div>,
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
              data-item={t('home')}
              className={getMenuActiveItem() === 'Inicio' ? 'active' : ''}
            >
              {t('home')}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              data-item={t('user_p')}
              className={getMenuActiveItem() === 'Usuarios' ? 'active' : ''}
            >
              {t('user_p')}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/schools"
              data-item={t('school_p')}
              className={getMenuActiveItem() === 'Escuelas' ? 'active' : ''}
            >
              {t('school_p')}
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
                {t('more_options')}
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
