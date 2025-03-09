import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setLoading(true);

        const user = {
            name,
            email,
            password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Erro ao registrar usuário');
            }
        } catch (error) {
            console.log('Erro ao registrar usuário:', error);
            setError('Erro de rede ou servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Registrar</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="name">Nome: </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha: </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>
            <button onClick={() => navigate('/calendar')} className="back-button">
                Voltar para o calendário
            </button>
        </div>
    );
};

export default Register;