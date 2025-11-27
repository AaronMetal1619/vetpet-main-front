import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards';

// Simulamos componentes de tablas para no hacer el código gigante
const UsersTableFake = () => <div className="card p-4 shadow"><h3>Gestión de Usuarios</h3><p>Aquí iría la tabla de usuarios...</p></div>;
const VetsTableFake = () => <div className="card p-4 shadow"><h3>Gestión de Veterinarias</h3><p>Aquí iría la tabla de veterinarias...</p></div>;
const AppointmentsTableFake = () => <div className="card p-4 shadow"><h3>Historial de Citas</h3><p>Aquí iría la tabla de todas las citas...</p></div>;

const AdminDashboard = ({ user }) => {
    // Estado para saber qué pestaña estamos viendo
    const [activeTab, setActiveTab] = useState('overview');

    // Función para renderizar el contenido dinámico
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <StatsCards />
                        <div className="row">
                            <div className="col-md-8">
                                <div className="card shadow-sm">
                                    <div className="card-header bg-white">
                                        <h5 className="mb-0">Actividad Reciente</h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">Juan Pérez se registró como usuario.</li>
                                            <li className="list-group-item">Nueva veterinaria "VetCity" pendiente de aprobación.</li>
                                            <li className="list-group-item">Pago recibido de suscripción #4401.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'users':
                return <UsersTableFake />;
            case 'vets':
                return <VetsTableFake />;
            case 'appointments':
                return <AppointmentsTableFake />;
            default:
                return <StatsCards />;
        }
    };

    return (
        <div className="d-flex">
            {/* 1. Sidebar Fijo a la izquierda */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userRole={user?.role || 'admin'} 
            />

            {/* 2. Contenido Principal a la derecha */}
            <div className="flex-grow-1 p-4 bg-light" style={{ height: '100vh', overflowY: 'auto' }}>
                <div className="container-fluid">
                    <header className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark">
                            {activeTab === 'overview' ? 'Panel de Control' : 
                             activeTab === 'users' ? 'Usuarios' :
                             activeTab === 'vets' ? 'Veterinarias' : 'Citas'}
                        </h2>
                        <div className="d-flex align-items-center">
                            <span className="me-3">Hola, <strong>{user?.name || 'Admin'}</strong></span>
                            <img src="https://ui-avatars.com/api/?name=Admin+User" className="rounded-circle" width="40" alt="avatar" />
                        </div>
                    </header>

                    {/* Aquí se inyecta el contenido dinámico */}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;