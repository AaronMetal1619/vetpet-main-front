import React, { useState } from 'react';
import Sidebar from './Sidebar';
import VetsManagement from './VetsManagement'; // <--- Importamos el componente

// Componentes Placeholder
const UsersTableFake = () => <div className="card p-4 shadow"><h3>Gestión de Usuarios</h3><p>Tabla de usuarios...</p></div>;
const AppointmentsTableFake = () => <div className="card p-4 shadow"><h3>Historial de Citas</h3><p>Tabla de citas...</p></div>;

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3>Bienvenido, {user.name}</h3>
                            <p>Selecciona una opción del menú lateral.</p>
                        </div>
                    </div>
                );
            case 'users': return <UsersTableFake />;
            
            // Aquí mostramos el componente real
            case 'vets': return <VetsManagement />;
            
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
                        {activeTab === 'overview' ? 'Panel de Control' : 
                         activeTab === 'vets' ? 'VETERINARIAS' : activeTab.toUpperCase()}
                    </h2>
                </header>

                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;