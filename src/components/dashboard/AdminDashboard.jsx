import React, { useState } from 'react';
import Sidebar from './Sidebar';
import VetsManagement from './VetsManagement'; // Gestión de Vets (Solo Admin)
import AppointmentsIndex from './AppointmentsIndex'; // ✅ Gestión de Citas (Nuevo)

// Componente Placeholder para Usuarios (Aún no implementado)
const UsersTableFake = () => (
  <div className="card p-5 shadow-sm border-0 text-center">
    <div className="mb-3"><i className="bi bi-people text-primary" style={{ fontSize: '3rem' }}></i></div>
    <h3>Gestión de Usuarios</h3>
    <p className="text-muted">Aquí podrás administrar a los usuarios registrados en la plataforma.</p>
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
                            <h2 className="fw-bold text-primary mb-3">¡Bienvenido, {user?.name || 'Usuario'}!</h2>
                            <p className="lead text-muted">
                                Selecciona una opción del menú lateral para comenzar.
                            </p>
                            <div className="row mt-5">
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-center">
                                        <i className="bi bi-people fs-1 text-secondary mb-2"></i>
                                        <h5>Usuarios</h5>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-center">
                                        <i className="bi bi-hospital fs-1 text-success mb-2"></i>
                                        <h5>Veterinarias</h5>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded bg-light h-100 d-flex flex-column justify-content-center">
                                        <i className="bi bi-calendar-check fs-1 text-primary mb-2"></i>
                                        <h5>Citas Activas</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'users': return <UsersTableFake />;
            
            // ✅ GESTIÓN DE VETERINARIAS (Solo visible si el sidebar lo permite)
            case 'vets': return <VetsManagement />; 
            
            // ✅ GESTIÓN DE CITAS (Nuevo componente)
            case 'appointments': return <AppointmentsIndex />;
            
            default: return <div>Seleccione una opción</div>;
        }
    };

    return (
        // Estilo para ocupar el espacio restante bajo el Navbar
        <div className="d-flex" style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
            
            {/* Sidebar */}
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userRole={user?.role || 'user'} 
            />

            {/* Contenido Principal */}
            <div className="flex-grow-1 bg-light p-4" style={{ height: '100%', overflowY: 'auto' }}>
                <header className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                    <h2 className="fw-bold text-dark m-0">
                        {activeTab === 'overview' ? 'Resumen' : 
                         activeTab === 'vets' ? 'VETERINARIAS' : 
                         activeTab === 'users' ? 'USUARIOS' : 'AGENDA DE CITAS'}
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