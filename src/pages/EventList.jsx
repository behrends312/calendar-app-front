import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faHourglassHalf, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './styles/EventList.css';

function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 10;

    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedStartTime, setUpdatedStartTime] = useState('');
    const [updatedEndTime, setUpdatedEndTime] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:5000/api/events', {
                    headers: { Authorization: token }
                });

                setEvents(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar os eventos');
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleRemoveEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`);
            setEvents(events.filter(event => event._id !== id));
        } catch (err) {
            console.log('Erro ao excluir evento:', err);
        }
    };

    const handleEditEvent = (event) => {
        setCurrentEvent(event);
        setUpdatedDescription(event.description);
        setUpdatedStartTime(new Date(event.startTime).toLocaleString());
        setUpdatedEndTime(new Date(event.endTime).toLocaleString());
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedEvent = {
                ...currentEvent,
                description: updatedDescription,
                startTime: new Date(updatedStartTime).toISOString(),
                endTime: new Date(updatedEndTime).toISOString(),
            };
            const response = await axios.put(`http://localhost:5000/api/events/${currentEvent._id}`, updatedEvent);
            setEvents(events.map(event => event._id === currentEvent._id ? response.data : event));
            setIsEditing(false);
        } catch (err) {
            console.log('Erro ao atualizar evento:', err);
        }
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <p>Carregando eventos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const totalPages = Math.ceil(events.length / eventsPerPage);

    return (
        <>
            <h2 className='event-h2'>
                <FontAwesomeIcon icon={faCalendarAlt} /> Lista de Eventos
            </h2>
            <div className="event-list-container">
                {currentEvents.length > 0 ? (
                    <ul className="event-list">
                        {currentEvents.map((event) => (
                            <li key={event._id} className="event-card">
                                <h3 title={event.description}>{event.description}</h3>
                                <p><strong><FontAwesomeIcon icon={faClock} /> Início:</strong> {new Date(event.startTime).toLocaleString()}</p>
                                <p><strong><FontAwesomeIcon icon={faHourglassHalf} /> Fim:</strong> {new Date(event.endTime).toLocaleString()}</p>

                                <div className="event-actions">
                                    <button className="edit-btn" onClick={() => handleEditEvent(event)}>
                                        <FontAwesomeIcon icon={faEdit} /> Editar
                                    </button>
                                    <button className="remove-btn" onClick={() => handleRemoveEvent(event._id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-events">Nenhum evento disponível.</p>
                )}
            </div>

            <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Próxima
                </button>
            </div>

            {isEditing && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Editar Evento</h3>

                        <label>
                            Descrição:
                            <input
                                type="text"
                                value={updatedDescription}
                                onChange={(e) => setUpdatedDescription(e.target.value)}
                                placeholder="Digite a descrição do evento"
                            />
                        </label>

                        <label>
                            Início:
                            <input
                                type="datetime-local"
                                value={new Date(updatedStartTime).toISOString().slice(0, 16)}
                                onChange={(e) => setUpdatedStartTime(e.target.value)}
                            />
                        </label>

                        <label>
                            Fim:
                            <input
                                type="datetime-local"
                                value={new Date(updatedEndTime).toISOString().slice(0, 16)}
                                onChange={(e) => setUpdatedEndTime(e.target.value)}
                            />
                        </label>

                        <div className="modal-actions">
                            <button onClick={handleSaveEdit} className="save-btn">Salvar</button>
                            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EventList;