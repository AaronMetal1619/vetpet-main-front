import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards'; // Asegúrate de tener este archivo o comenta la línea

// Componentes Placeholder (Fake)
const UsersTableFake = () => <div className="card p-4 shadow"><h3>Gestión de Usuarios</h3><p>Tabla de usuarios...</p></div>;
const VetsTableFake = () => <div className="card p-4 shadow"><h3>Gestión de Veterinarias</h3><p>Tabla de veterinarias...</p></div>;
const AppointmentsTableFake = () => <div className="card p-4 shadow"><h3>Historial de Citas</h3><p>Tabla de citas...</p></div>;

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        {/* Si tienes StatsCards úsalo, si no, comenta esto */}
                        <StatsCards /> 
                        
                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="card shadow-sm">
                                    <div className="card-header bg-white">
                                        <h5 className="mb-0">Actividad Reciente</h5>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">Nuevo usuario registrado.</li>
                                            <li className="list-group-item">Cita #1234 completada.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            case 'users': return <UsersTableFake />;
            case 'vets': return <VetsTableFake />;
            case 'appointments': return <AppointmentsTableFake />;
            default: return <div>Seleccione una opción</div>;
        }
    };

    return (
        <div className="d-flex" style={{ height: '100%', width: '100%' }}>
            {/* Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userRole={user?.role || 'admin'} 
            />

            {/* Contenido Principal */}
            <div className="flex-grow-1 bg-light p-4" style={{ overflowY: 'auto' }}>
                <header className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark m-0">
                        {activeTab === 'overview' ? 'Panel de Control' : activeTab.toUpperCase()}
                    </h2>
                </header>

                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;