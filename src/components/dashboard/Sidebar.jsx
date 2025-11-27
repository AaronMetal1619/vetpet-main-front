import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', minHeight: '100vh' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Admin Panel</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <button 
            className={`nav-link text-white ${activeTab === 'overview' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Resumen
          </button>
        </li>
        <li>
          <button 
            className={`nav-link text-white ${activeTab === 'users' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-2"></i>
            Usuarios
          </button>
        </li>
        <li>
          <button 
            className={`nav-link text-white ${activeTab === 'vets' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('vets')}
          >
            <i className="bi bi-hospital me-2"></i>
            Veterinarias
          </button>
        </li>
        <li>
          <button 
            className={`nav-link text-white ${activeTab === 'appointments' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="bi bi-calendar-check me-2"></i>
            Citas Globales
          </button>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <span className="text-small text-muted">Modo: {userRole}</span>
      </div>
    </div>
  );
};

export default Sidebar;