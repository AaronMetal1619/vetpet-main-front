import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" 
         style={{ width: '250px', height: '100%', overflowY: 'auto' }}>
      
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-5 fw-bold">Panel de Control</span>
      </div>
      <hr />
      
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-1">
          <button 
            className={`nav-link text-white w-100 text-start ${activeTab === 'overview' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-2"></i> Resumen
          </button>
        </li>
        <li className="nav-item mb-1">
          <button 
            className={`nav-link text-white w-100 text-start ${activeTab === 'users' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-2"></i> Usuarios
          </button>
        </li>
        <li className="nav-item mb-1">
          <button 
            className={`nav-link text-white w-100 text-start ${activeTab === 'vets' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('vets')}
          >
            <i className="bi bi-hospital me-2"></i> Veterinarias
          </button>
        </li>
        <li className="nav-item mb-1">
          <button 
            className={`nav-link text-white w-100 text-start ${activeTab === 'appointments' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="bi bi-calendar-check me-2"></i> Citas
          </button>
        </li>
      </ul>
      
      <hr />
      <div className="text-small text-muted text-center">
        {/* Agregamos el ? para evitar error si userRole es null al inicio */}
        Rol: {userRole?.toUpperCase() || 'USUARIO'}
      </div>
    </div>
  );
};

export default Sidebar;