import React from 'react';
import './menu2.css';
import logo from '../../imgs/Icon.png';
import { Link, useLocation } from 'react-router-dom';

function Menu2() {
    const location = useLocation();

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

    return (
        <div className="menu">
            <nav>
                <ul className="menuItems">
                    <img src={logo} alt="logotype" className="logotype" />
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
        </div>
    );
}

export default Menu2;

