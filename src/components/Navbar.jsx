import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ 
  user, 
  handleLogout, 
  handleReload, 
  showServicios, 
  setShowServicios, 
  setShowContactModal, 
  setShowPerfil 
}) => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top shadow-lg"
      style={{ background: 'linear-gradient(90deg, #6CA0DC, #89BFF1)' }}>
      <div className="container-fluid">
        <h2 className="navbar-item text-white mb-0">AgendaVET</h2>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/" onClick={handleReload}>Inicio</Link>
            </li>
            {/* Botón Dashboard solo para admins */}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-bold bg-white bg-opacity-25 rounded px-2" to="/dashboard">
                   <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link text-white" href="#" onClick={() => setShowServicios(!showServicios)}>
                {showServicios ? 'Ocultar Servicios' : 'Ver Servicios'}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#" onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}>
                Contáctanos
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/suscripciones">Suscribirse</Link>
            </li> 
          </ul>
          
          {/* Dropdown de Usuario */}
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
              <img src="https://ui-avatars.com/api/?background=random&name=User" 
                   width="30" height="30" alt="Avatar" className="rounded-circle" />
              <span className="small">{user.name || 'Usuario'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg">
              <li><button className="dropdown-item" onClick={() => setShowPerfil(true)}>Ver perfil</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;