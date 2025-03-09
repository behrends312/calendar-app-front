import React, { useState } from 'react';
import './styles/AddEvent.css';
import axios from 'axios';

function AddEvent() {
    const [eventData, setEventData] = useState({
        description: '',
        startTime: '',
        endTime: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://localhost:5000/api/events/add', eventData, {
                headers: { Authorization: token }
            });

            alert('Evento adicionado com sucesso');
            setEventData({ description: '', startTime: '', endTime: '' });
        } catch (err) {
            console.error('Erro ao adicionar evento:', err);
        }
    };

    return (
        <div className="add-event-container">
            <h2>📌 Criar Novo Evento</h2>
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label htmlFor="description">Descrição:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        required
                        placeholder="Digite a descrição do evento"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="startTime">Hora de Início:</label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        value={eventData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="endTime">Hora de Término:</label>
                    <input
                        type="datetime-local"
                        id="endTime"
                        name="endTime"
                        value={eventData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">➕ Adicionar Evento</button>
            </form>
        </div>
    );
}

export default AddEvent;