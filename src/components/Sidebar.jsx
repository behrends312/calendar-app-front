import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/add-event">Adicionar Eventos</Link>
                </li>
                <li>
                    <Link to="/events">Eventos</Link>
                </li>
                <li>
                    <Link to="/calendar">Calendário</Link>
                </li>
                <li>
                    <Link to="/register">Registrar Usuários</Link>
                </li>
                <li>
                    <Link to="/users">Usuários</Link>
                </li>
            </ul>


        </div>
    );
};

export default Sidebar;