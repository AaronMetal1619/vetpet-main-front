import React, { useState } from 'react';
import Sidebar from './Sidebar';

// ✅ IMPORTACIONES REALES (Asegúrate de que los archivos estén en la misma carpeta)
import VetsManagement from './VetsManagement';
import AppointmentsIndex from './AppointmentsIndex';
//import SupersetDashboard from './SupersetDashboard';

// Componente Placeholder para Usuarios (Este se queda así porque aún no tienes el real)
const UsersTableFake = () => (
    <div className="card p-5 shadow-sm border-0 text-center">
        <div className="mb-3"><i className="bi bi-people text-primary" style={{ fontSize: '3rem' }}></i></div>
        <h3>Gestión de Usuarios</h3>
        <p className="text-muted">Aquí podrás administrar a los usuarios registrados en la plataforma.</p>
    </div>
);

const AdminDashboard = ({ user }) => {
    // Estado inicial: 'overview'
    const [activeTab, setActiveTab] = useState('overview');

    // Función para decidir qué contenido mostrar según la pestaña activa
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

                            {/* Grid de Tarjetas de Acceso Rápido */}
                            <div className="row mt-5 g-3">

                                {/* 1. Tarjeta Usuarios */}
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="p-4 border rounded bg-light h-100 d-flex flex-column justify-content-center hover-shadow">
                                        <i className="bi bi-people fs-1 text-secondary mb-2"></i>
                                        <h5>Usuarios</h5>
                                        <button className="btn btn-sm btn-outline-secondary mt-2" onClick={() => setActiveTab('users')}>Gestionar</button>
                                    </div>
                                </div>

                                {/* 2. Tarjeta Veterinarias */}
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="p-4 border rounded bg-light h-100 d-flex flex-column justify-content-center hover-shadow">
                                        <i className="bi bi-hospital fs-1 text-success mb-2"></i>
                                        <h5>Veterinarias</h5>
                                        <button className="btn btn-sm btn-outline-success mt-2" onClick={() => setActiveTab('vets')}>Gestionar</button>
                                    </div>
                                </div>

                                {/* 3. Tarjeta Citas */}
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="p-4 border rounded bg-light h-100 d-flex flex-column justify-content-center hover-shadow">
                                        <i className="bi bi-calendar-check fs-1 text-primary mb-2"></i>
                                        <h5>Citas Activas</h5>
                                        <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => setActiveTab('appointments')}>Ver Agenda</button>
                                    </div>
                                </div>

                                {/* 4. ✅ TARJETA NUEVA: Métricas Superset */}
                                <div className="col-12 col-md-6 col-lg-3">
                                    <div className="p-4 border rounded bg-white shadow-sm h-100 d-flex flex-column justify-content-center border-primary">
                                        <i className="bi bi-graph-up-arrow fs-1 text-info mb-2"></i>
                                        <h5 className="fw-bold text-dark">Métricas</h5>
                                        <button
                                            className="btn btn-sm btn-primary mt-2"
                                            onClick={() => setActiveTab('superset')}
                                        >
                                            Ver Dashboard
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                );

            case 'users': return <UsersTableFake />;

            case 'vets': return <VetsManagement />;

            case 'appointments': return <AppointmentsIndex />;

            // ✅ CASO REAL: Superset Dashboard
            case 'superset':
                return (
                    <div style={{ height: '100%', minHeight: '650px', position: 'relative' }}>
                        <SupersetDashboard />
                    </div>
                );

            default: return <div>Seleccione una opción</div>;
        }
    };

    return (
        <div className="d-flex" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>

            {/* Sidebar Lateral */}
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userRole={user?.role || 'user'}
            />

            {/* Área Principal (Derecha) */}
            <div className="flex-grow-1 bg-light d-flex flex-column" style={{ height: '100%', overflow: 'hidden' }}>

                {/* Header Superior */}
                <header className="d-flex justify-content-between align-items-center p-4 bg-white border-bottom shadow-sm" style={{ height: '80px', flexShrink: 0 }}>
                    <h2 className="fw-bold text-dark m-0">
                        {/* Título dinámico según la pestaña activa */}
                        {activeTab === 'overview' ? 'Resumen' :
                            activeTab === 'vets' ? 'VETERINARIAS' :
                                activeTab === 'users' ? 'USUARIOS' :
                                    activeTab === 'appointments' ? 'AGENDA DE CITAS' :
                                        activeTab === 'superset' ? 'MÉTRICAS FINANCIERAS' : 'PANEL'}
                    </h2>
                    <span className="badge bg-primary rounded-pill px-3 py-2">
                        {user?.role === 'partner' ? 'Modo Veterinaria' : 'Modo Admin'}
                    </span>
                </header>

                {/* Contenido Scrollable */}
                <div className="p-4" style={{ flexGrow: 1, overflowY: 'auto' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;