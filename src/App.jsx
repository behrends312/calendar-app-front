import './styles.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Register from './pages/Register';
import UserList from './pages/UserList';

function ProtectedRoute({ element }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/calendar" element={<ProtectedRoute element={<Calendar />} />} />
                <Route path="/register" element={<ProtectedRoute element={<Register />} />} />
                <Route path="/users" element={<ProtectedRoute element={<UserList />} />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;