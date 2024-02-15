import React from 'react';
import './menu.css';
import logo from '../../imgs/Icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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

    return (
        <div className="menu">
            <nav>
                <ul className="menuItems">
                    <img src={logo} alt="logotype" className="logotype" onClick={() => navigate('/admin/control-panel')} />
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
        </div>
    );
}

export default Menu;
