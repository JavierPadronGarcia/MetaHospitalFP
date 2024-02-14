import React, {  useContext } from 'react';
import { Menu, Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { RolesContext } from '../../context/roles';
import authService from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import './headers.css';


const Headers = ({ title, color, groupId }) => {
    const RoleContext = useContext(RolesContext);
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        if (e.key === 'profile') {
            navigate('/myUser');
            console.log('Redireccionar a la página de perfil');
        } else if (e.key === 'logout') {
            RoleContext.setRole('');
            authService.logout().then(() => {
                navigate('/');
            });
        } else if (e.key === 'chat') {
            navigate('/chat/'+ groupId);
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="profile">Perfil</Menu.Item>
            <Menu.Item key="logout">Cerrar Sesión</Menu.Item>
            <Menu.Item key="chat">Chat de grupo</Menu.Item>
        </Menu>
    );

    return (
        <div className='headers' style={{ backgroundColor: color }}>
            <h1>{title}</h1>
            <Dropdown className='dropdown' overlay={menu} placement="bottomRight">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <MenuOutlined style={{ fontSize: '24px'}} />
                </a>
            </Dropdown>
        </div>
    );
}

export default Headers;

