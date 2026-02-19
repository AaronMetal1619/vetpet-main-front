import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, handleLogout, setShowContactModal }) => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark fixed-top shadow-lg"
      style={{ background: 'linear-gradient(90deg, #c36eeae9, #f189f15b)', zIndex: 1030 }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold" to="/">AgendaVET</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Inicio</Link>
            </li>

            {/* --- LÓGICA DE ROLES ACTUALIZADA --- */}
            {/* Visible para Admin y Partner (Veterinaria) */}
            {user && (user.role === 'admin' || user.role === 'partner') && (
              <li className="nav-item">
                <Link className="nav-link text-white fw-bold bg-white bg-opacity-25 rounded px-2 mx-2" to="/dashboard">
                   <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link className="nav-link text-white" to="/servicios">Ver Servicios</Link>
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
          
          <div className="dropdown">
            <button className="btn btn-light dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
              <img src={`https://ui-avatars.com/api/?background=random&name=${user.name || 'User'}`}
                   width="30" height="30" alt="Avatar" className="rounded-circle" />
              <span className="small fw-bold">{user.name || 'Usuario'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg">
              <li><Link className="dropdown-item" to="/perfil">Ver perfil</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;