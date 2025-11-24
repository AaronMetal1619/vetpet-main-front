import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import PanelSuscripciones from './components/PanelSuscripciones';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Perfil from './components/Perfil';
import AgendarCita from './components/AgendarCita';
import Dashboard from './components/Dashboard';
import Servicios from './components/Servicios';
import ChatbotWidget from './components/ChatbotWidget';

// SocialLoginHandler.jsx
// <Route path="/social-login-success" element={<SocialLoginHandler />} />
// import SocialLoginHandler from './components/SocialLoginHandler';
// Aquí se podría importar el modal de Stripe en caso de usarse

function App() {
  console.log("🧠 Chatbot URL:", import.meta.env.VITE_CHATBOT_URL);

  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showAgendar, setShowAgendar] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showServicios, setShowServicios] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token recuperado: ", token);

    if (token && token === 'fake-token') {
      const localUser = JSON.parse(localStorage.getItem('userLocal'));
      if (localUser) setUser(localUser);
    } else if (token) {
      axios.get('https://vetpet-sandbox-vkt2.onrender.com/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUser(response.data))
      .catch(() => {
        console.log("Error al obtener usuario");
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.reload();  
  };

  const handleLogin = (userData) => {
    console.log("Datos del usuario al hacer login: ", userData);
    setUser(userData);
  };

  const handleAgendarCita = (vet) => {
    setSelectedVet(vet);
    setShowAgendar(true);
  };

  const handleReload = () => {
    console.log("Recargando la página...");
    window.location.reload(); 
  };

  return (    
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={
            !user ? (
              showRegister ? (
                <Register onRegister={handleLogin} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            ) : (
              <div>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top shadow-lg"
                  style={{ background: 'linear-gradient(90deg, #6CA0DC, #89BFF1)' }}>
                  <div className="container-fluid">
                    <h2 className="navbar-item text-white">AgendaVET</h2>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                      <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                          <Link className="nav-link text-white" to="/" onClick={handleReload}>Inicio</Link>
                        </li>
                        {user && user.role === 'admin' && (
                          <li className="nav-item">
                            <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
                          </li>
                        )}
                        <li className="nav-item">
                          <a className="nav-link text-white" href="#" onClick={() => setShowServicios(!showServicios)}>
                            {showServicios ? 'Ocultar Servicios' : 'Ver Servicios'}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a 
                            className="nav-link text-white" 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); setShowContactModal(true); }}
                          >
                            Contáctanos
                          </a>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link text-white" to="/suscripciones">
                            Suscribirse
                          </Link>
                        </li> 
                      </ul>
                      <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                          <img src="https://st2.depositphotos.com/3895623/5589/v/450/depositphotos_55896913-stock-illustration-usershirt.jpg"
                            width="40" height="40" alt="Foto de perfil" className="rounded-circle" />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="dropdownMenuButton">
                          <button className="dropdown-item" onClick={() => setShowPerfil(true)}>
                            Ver perfil
                          </button>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesión</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </nav>

                {!showAgendar && !showPerfil && !showServicios ? (
                  <Home handleLogout={handleLogout} onAgendarCita={handleAgendarCita} />
                ) : (
                  showPerfil ? <Perfil /> : <Servicios />
                )}

                {/* Chatbot solo si el usuario está autenticado */}
                {user && user.subscription_active === true && (
                  <ChatbotWidget />
                )}

              </div>
            )
          } />
          
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/agendar" element={<AgendarCita vet={selectedVet} />} />
          <Route path="/dashboard" element={<ProtectedRoute user={user} role="admin, veterinaria"><Dashboard /></ProtectedRoute>
  }
/>

          <Route path="/suscripciones" element={<PanelSuscripciones />} />
        </Routes>

        {/* Modal de contacto */}
        {showContactModal && (
          <div 
            className="modal fade show" 
            tabIndex="-1" 
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Contáctanos</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowContactModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    ¡Gracias por confiar en <b>AgendaVET</b>! <br />
                    Puedes escribirnos a <b>soporte@agendavet.com</b> o llamarnos al <b>+52 123 456 7890</b>.
                  </p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowContactModal(false)}
                  >
                    Cerrar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => alert('¡Pronto nos pondremos en contacto!')}
                  >
                    Enviar mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Pago */}
        {showPagoModal && (
          <div 
            className="modal fade show" 
            tabIndex="-1" 
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Suscríbete a AgendaVET</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowPagoModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    ¡Mejora tu experiencia con <b>AgendaVET Premium</b>! <br />
                    Obtén acceso exclusivo a características avanzadas y prioridad en soporte.
                  </p>
                  <div className="text-center mt-4">
                    <h6>Plan Premium: $99 MXN/mes</h6>
                    <small className="text-muted">Cancelación en cualquier momento</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPagoModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => window.open("https://buy.stripe.com/test_9B6bJ0agP5vraEkf4keIw00", "_blank")}
                  >
                    Suscribirse ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="text-center mt-4">
            <button className="btn btn-link w-100" onClick={() => setShowRegister(!showRegister)}>
              {showRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
