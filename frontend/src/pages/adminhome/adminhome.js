import React, { useState, useEffect } from 'react';
import Menu from '../../components/menu/menu';
import Rightmenu from '../../components/rightmenu/rightmenu';
import Square from '../../components/square/square';
import Tag from '../../components/tag/tag';
import { useLocation } from 'react-router-dom';
import users from '../../imgs/users.svg';
import schools from '../../imgs/schools.svg';
import './adminhome.css';


function AdminHome() {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const location = useLocation(); 

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='container'>
            <div className='container-left'>
                <Menu />
                <Tag name="Bienvenido Admin"/>
                <div className='squares'>
                    <Square icon={users} label="Usuarios" route="/admin/users" />
                    <Square icon={schools} label="Escuelas" route="/admin/schools" />
                </div>
            </div>
            {!isSmallScreen && <div className='container-right'>
                <Rightmenu currentRoute={location.pathname}/>
            </div>}
        </div>
    );
}

export default AdminHome;