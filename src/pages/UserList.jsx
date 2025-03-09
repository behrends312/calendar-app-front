import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/UserList.css';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/users');
                const data = await response.json();
                console.log('Usuários recebidos:', data);
                setUsers(data);
            } catch (error) {
                console.error('Erro ao buscar os usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="userlist-container">
            <h2>Lista de Usuários</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="3">Nenhum usuário encontrado.</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <button onClick={() => navigate('/calendar')} className="back-button">
                Voltar para o calendário
            </button>
        </div>
    );
};

export default UserList;