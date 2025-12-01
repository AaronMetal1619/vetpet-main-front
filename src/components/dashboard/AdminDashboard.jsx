import React, { useState } from 'react';
import Sidebar from './Sidebar';
import VetsManagement from './VetsManagement'; // ✅ Componente Real de Veterinarias

// Componentes Placeholder (Para las secciones que aún no programas)
const UsersTableFake = () => (
  <div className="card p-5 shadow-sm border-0 text-center">
    <div className="mb-3"><i className="bi bi-people text-primary" style={{ fontSize: '3rem' }}></i></div>
    <h3>Gestión de Usuarios</h3>
    <p className="text-muted">Aquí podrás administrar a los usuarios registrados en la plataforma.</p>
  </div>
);

const AppointmentsTableFake = () => (
  <div className="card p-5 shadow-sm border-0 text-center">
    <div className="mb-3"><i className="bi bi-calendar-event text-primary" style={{ fontSize: '3rem' }}></i></div>
    <h3>Historial de Citas</h3>
    <p className="text-muted">Aquí aparecerá el listado completo de todas las citas médicas.</p>
  </div>
);

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-5 text-center">
                            <h2 className="fw-bold text-primary mb-3">¡Bienvenido al Panel, {user?.name || 'Admin'}!</h2>
                            <p className="lead text-muted">
                                Selecciona una opción del menú lateral para comenzar a administrar la plataforma.
                            </p>
                            <div className="row mt-5">
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-light">
                                        <h5>Usuarios</h5>
                                        <h2 className="fw-bold">45</h2>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-light">
                                        <h5>Veterinarias</h5>
                                        <h2 className="fw-bold">12</h2>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-light">
                                        <h5>Citas Hoy</h5>
                                        <h2 className="fw-bold">5</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'users': return <UsersTableFake />;
            
            // ✅ AQUÍ SE CARGA TU COMPONENTE DE VETERINARIAS
            case 'vets': return <VetsManagement />; 
            
            case 'appointments': return <AppointmentsTableFake />;
            default: return <div>Seleccione una opción</div>;
        }
    };

    return (
        // ✅ Estilo crítico: Ocupa el 100% del espacio disponible debajo del Navbar
        <div className="d-flex" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            
            {/* Sidebar a la izquierda */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userRole={user?.role || 'admin'} 
            />

            {/* Contenido principal a la derecha con scroll independiente */}
            <div className="flex-grow-1 bg-light p-4" style={{ height: '100%', overflowY: 'auto' }}>
                <header className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h2 className="fw-bold text-dark m-0">
                        {activeTab === 'overview' ? 'Resumen' : 
                         activeTab === 'vets' ? 'VETERINARIAS' : 
                         activeTab === 'users' ? 'USUARIOS' : 'CITAS'}
                    </h2>
                    <span className="badge bg-primary rounded-pill px-3 py-2">
                        {user?.role === 'partner' ? 'Modo Veterinaria' : 'Modo Admin'}
                    </span>
                </header>

                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;