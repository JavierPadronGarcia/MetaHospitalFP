import React, { useContext, useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { RolesContext } from '../../context/roles';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import './headers.css';
import SearchComponent from '../search/search';

const Headers = ({ title, color, groupId, Page, groupData, data, onSearch, fieldName }) => {
  const RoleContext = useContext(RolesContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const handleMenuClick = (e) => {
    switch (e.key) {
      case 'profile':
        navigate('/myUser');
        break;
      case 'logout':
        RoleContext.setRole('');
        authService.logout().then(() => {
          navigate('/');
        });
        break;
      case 'chat':
        navigate('/chat/' + groupId);
        break;
      case 'home':
        if (RoleContext.role === 'teacher') navigate('/teacher/main');
        if (RoleContext.role === 'student') navigate('/student/home');
        break;
      case 'units':
        if (RoleContext.role === 'teacher')
          navigate(`/teacher/main/group/${groupData.groupName}/${groupData.groupId}/units`);
        break;
      case 'students':
        if (RoleContext.role === 'teacher')
          navigate(`/teacher/main/group/${groupData.groupName}/${groupData.groupId}/students`);
        break;
      default:
        break;
    }
  };

  const ItemsByRole = () => {
    const teacherItems = [
      {
        label: 'Inicio',
        key: 'home',
      },
      {
        label: 'Perfil',
        key: 'profile',
      },
    ];

    const studentItems = [
      {
        label: 'Inicio',
        key: 'home',
      },
      {
        label: 'Perfil',
        key: 'profile',
      },
      {
        label: 'Chat de grupo',
        key: 'chat',
      },
    ];

    let updatedItems = [...items];

    if (RoleContext.role === 'teacher') {
      updatedItems = [...updatedItems, ...teacherItems];
    }

    if (RoleContext.role === 'student') {
      updatedItems = [...updatedItems, ...studentItems];
    }

    if (Page === 'selected') {
      updatedItems.push({
        label: 'Mis alumnos',
        key: 'students',
      }, {
        label: 'Unidades',
        key: 'units',
      });
    }

    updatedItems.push(
      {
        type: 'divider'
      },
      {
        label: 'Cerrar Sesión',
        key: 'logout',
      });

    setItems(updatedItems);
  };

  const showMenuList = () => (
    items.map((item, index) => (
      <li
        key={index}
        onClick={() => handleMenuClick({ key: item.key })}
      >
        {item.label}
      </li>
    ))
  );

  useEffect(() => {
    ItemsByRole();
  }, []);

  return (
    <div className='headers' style={{ backgroundColor: color }}>
      <div  className="header-content">
        <h1>{title}</h1>
        <ul className='menu-list'>
          {showMenuList()}
        </ul>
        <Dropdown
          className='dropdown'
          menu={{ items, onClick: handleMenuClick }}
          placement="bottom"
        >
          <div className="ant-dropdown-link">
            <MenuOutlined style={{ fontSize: '24px' }} />
          </div>
        </Dropdown>
      </div>
      <SearchComponent data={data} onSearch={onSearch} fieldName={fieldName}/>
    </div>
  );
}

export default Headers;
