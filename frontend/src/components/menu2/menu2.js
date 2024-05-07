import React from 'react';
import './menu2.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DownOutlined, LogoutOutlined, MenuOutlined, SettingFilled, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button } from 'antd';
import authService from '../../services/auth.service';
import { useTranslation } from 'react-i18next';

function Menu2() {
  const [t] = useTranslation('global');
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
      type: 'divider',
    },
    {
      label: <div>{t('student_p')}</div>,
      key: 'students',
    },
    {
      label: <div>{t('teacher_p')}</div>,
      key: 'teachers',
    },
    {
      label: <div>{t('group_p')}</div>,
      key: 'groups',
    },
    {
      label: <div>{t('course_p')}</div>,
      key: 'courses',
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
              data-item={t('home')}
              className={getMenuActiveItem() === 'Inicio' ? 'active' : ''}
            >
              {t('home')}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/students"
              data-item={t('student_p')}
              className={getMenuActiveItem() === 'Estudiantes' ? 'active' : ''}
            >
              {t('student_p')}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/teachers"
              data-item={t('teacher_p')}
              className={getMenuActiveItem() === 'Profesores' ? 'active' : ''}
            >
              {t('teacher_p')}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/groups"
              data-item={t('group_p')}
              className={getMenuActiveItem() === 'Grupos' ? 'active' : ''}
            >
              {t('group_p')}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/courses"
              data-item={t('course_p')}
              className={getMenuActiveItem() === 'Cursos' ? 'active' : ''}
            >
              {t('course_p')}
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

