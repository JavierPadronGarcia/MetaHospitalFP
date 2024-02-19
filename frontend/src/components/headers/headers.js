import React, { useContext } from 'react';
import { Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { RolesContext } from '../../context/roles';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import './headers.css';

const Headers = ({ title, color, groupId }) => {
  const RoleContext = useContext(RolesContext);
  const navigate = useNavigate();

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
        navigate('/student/home');
        break;
    }
  };

  const items = [
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
    {
      label: 'Cerrar Sesión',
      key: 'logout',
    },
  ];

  const showMenuList = () => (
    items.map((item, index) => (
      <li
        key={index}
        onClick={() => handleMenuClick({ key: item.key })}
      >
        {item.label}
      </li>
    ))
  )

  return (
    <div className='headers' style={{ backgroundColor: color }}>
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
  );
}

export default Headers;