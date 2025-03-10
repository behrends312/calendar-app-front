import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { ptBR } from "date-fns/locale";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles/Calendar.css";
import './styles/EventList.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });


const CalendarPage = () => {
    const { logout } = useAuth();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        description: "",
        start: "",
        end: "",
        reminder: "none"
    });
    const [view, setView] = useState(Views.MONTH);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navigate = useNavigate();

    const handleUserMenuClick = (path) => {
        navigate(path);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("authToken");
            console.log("Token no localStorage:", token);

            if (!token) {
                console.error("Token não encontrado!");
                return;
            }

            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", decodedToken);

            const response = await axios.get("http://localhost:5000/api/events", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const formattedEvents = response.data.map(event => ({
                ...event,
                start: new Date(event.startTime),
                end: new Date(event.endTime),
                title: event.description
            }));

            setEvents(formattedEvents);
        } catch (err) {
            console.error("Erro ao carregar eventos:", err);
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        const formattedStart = formatDateTimeForInput(start);
        const formattedEnd = formatDateTimeForInput(end);

        setNewEvent({
            description: "",
            start: formattedStart,
            end: formattedEnd
        });

        setSelectedEvent(null);
        setShowEventForm(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setNewEvent({
            description: event.description,
            start: formatDateTimeForInput(event.start),
            end: formatDateTimeForInput(event.end)
        });
        setShowEventForm(true);
    };

    const formatDateTimeForInput = (date) => {
        const dt = new Date(date);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        const hours = String(dt.getHours()).padStart(2, "0");
        const minutes = String(dt.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSaveEvent = async () => {
        if (!newEvent.description || !newEvent.start || !newEvent.end) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        const start = new Date(newEvent.start);
        const end = new Date(newEvent.end);

        const isOverlapping = events.some(event => {
            if (selectedEvent && event._id === selectedEvent._id) {
                return false;
            }

            const existingStart = new Date(event.start);
            const existingEnd = new Date(event.end);

            return (
                (start >= existingStart && start < existingEnd) ||
                (end > existingStart && end <= existingEnd) ||
                (start <= existingStart && end >= existingEnd)
            );
        });

        if (isOverlapping) {
            alert("Conflito de horários! Já existe um evento nesse período.");
            return;
        }

        let reminderDate = null;

        if (newEvent.reminder && newEvent.reminder !== "none") {
            const reminderMinutes = parseInt(newEvent.reminder, 10);
            if (!isNaN(reminderMinutes)) {
                reminderDate = new Date(start.getTime() - reminderMinutes * 60000);
            }
        }

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("Token não encontrado!");
                return;
            }

            const eventData = {
                description: newEvent.description,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                reminderTime: reminderDate ? reminderDate.toISOString() : null
            };

            let response;

            if (selectedEvent) {
                response = await axios.put(
                    `http://localhost:5000/api/events/${selectedEvent._id}`,
                    eventData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updatedEvent = {
                    ...response.data,
                    start: new Date(response.data.startTime),
                    end: new Date(response.data.endTime),
                    title: response.data.description
                };

                setEvents(events.map(evt => (evt._id === selectedEvent._id ? updatedEvent : evt)));
                alert("Evento atualizado com sucesso!");
            } else {
                response = await axios.post(
                    "http://localhost:5000/api/events/add",
                    eventData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const createdEvent = {
                    ...response.data,
                    start: new Date(response.data.startTime),
                    end: new Date(response.data.endTime),
                    title: response.data.description
                };

                setEvents([...events, createdEvent]);
                alert("Evento criado com sucesso!");
            }

            setShowEventForm(false);
            setSelectedEvent(null);
        } catch (err) {
            console.error("Erro ao salvar evento:", err);
            alert("Erro ao salvar evento!");
        }
    };



    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`http://localhost:5000/api/events/${selectedEvent._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEvents(events.filter(evt => evt._id !== selectedEvent._id));
            alert("Evento excluído com sucesso!");
            setShowEventForm(false);
            setSelectedEvent(null);
        } catch (err) {
            console.error("Erro ao excluir evento:", err);
            alert("Erro ao excluir evento!");
        }
    };

    return (
        <div className="calendar-container">
            <div className="user-container">
                <div className="user-icon" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <FaUserCircle size={35} />
                </div>

                {showUserMenu && (
                    <div className="user-menu">
                        <button onClick={() => handleUserMenuClick("/register")}>
                            Registrar Novo Usuário
                        </button>
                        <button onClick={() => handleUserMenuClick("/users")}>
                            Lista de Usuários
                        </button>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            </div>

            <div className="view-buttons">
                <button onClick={() => setView(Views.MONTH)}>Mês</button>
                <button onClick={() => setView(Views.WEEK)}>Semana</button>
                <button onClick={() => setView(Views.DAY)}>Dia</button>
            </div>

            <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable
                    view={view}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    onView={setView}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    step={30}
                    timeslots={2}
                />
            </div>

            {showEventForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{selectedEvent ? "Editar Evento" : "Novo Evento"}</h3>
                        <input
                            type="text"
                            placeholder="Descrição"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                        <label>Hora de Início:</label>
                        <input
                            type="datetime-local"
                            value={newEvent.start}
                            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                        />
                        <label>Hora de Término:</label>
                        <input
                            type="datetime-local"
                            value={newEvent.end}
                            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                        />
                        <label>Notificação</label>
                        <label>Receber lembrete:</label>
                        <select
                            value={newEvent.reminder}
                            onChange={(e) => setNewEvent({ ...newEvent, reminder: e.target.value })}
                        >
                            <option value="none">Sem lembrete</option>
                            <option value="30min">30 minutos antes</option>
                            <option value="1h">1 hora antes</option>
                            <option value="2h">2 horas antes</option>
                            <option value="1d">1 dia antes</option>
                        </select>
                        <div className="modal-buttons">
                            <button className="save" onClick={handleSaveEvent}>
                                {selectedEvent ? "Salvar Alterações" : "Criar Evento"}
                            </button>
                            {selectedEvent && (
                                <button className="delete" onClick={handleDeleteEvent}>
                                    Excluir
                                </button>
                            )}
                            <button className="cancel" onClick={() => setShowEventForm(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;