import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar'; 
import ProtectedRoute from './components/ProtectedRoute';
import PanelSuscripciones from './components/PanelSuscripciones';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Perfil from './components/Perfil';
import AgendarCita from './components/AgendarCita';
import Servicios from './components/Servicios';
import ChatbotWidget from './components/ChatbotWidget';
import AdminDashboard from './components/dashboard/AdminDashboard'; 

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const location = useLocation();
  // Detectar si estamos en el dashboard para ajustar el layout
  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    // Cargar iconos
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Verificar sesión existente
    const token = localStorage.getItem('token');
    if (token) {
      if(token === 'fake-token'){
         const localUser = JSON.parse(localStorage.getItem('userLocal'));
         if(localUser) setUser(localUser);
      } else {
        // 🔥 CORRECCIÓN AQUÍ: Usar la URL del nuevo backend
        axios.get('https://vetpet-back.onrender.com/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setUser(response.data))
        .catch(() => {
          // Si el token no es válido o el servidor falla, cerramos sesión
          localStorage.removeItem('token');
          setUser(null);
        });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userLocal');
    setUser(null);
    window.location.href = "/";
  };

  const handleLogin = (userData) => setUser(userData);

  return (
    <div className={isDashboard ? "container-fluid p-0" : "container mt-4"}>
      {!user ? (
        // --- VISTA NO LOGUEADO ---
        <div className="container mt-5">
          {showRegister ? (
             <Register onRegister={handleLogin} />
          ) : (
             <>
               <Login onLogin={handleLogin} />
               <div className="text-center mt-3">
                 <button className="btn btn-link" onClick={() => setShowRegister(true)}>
                   ¿No tienes cuenta? Regístrate aquí
                 </button>
               </div>
             </>
          )}
        </div>
      ) : (
        // --- VISTA LOGUEADO ---
        <>
          {/* Navbar solo si NO estamos en dashboard */}
          {!isDashboard && (
            <Navbar 
              user={user}
              handleLogout={handleLogout}
              setShowContactModal={setShowContactModal}
            />
          )}

          {/* Margen superior para el contenido si hay Navbar */}
          <div style={{ marginTop: !isDashboard ? '80px' : '0' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/suscripciones" element={<PanelSuscripciones />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/agendar" element={<AgendarCita />} />

              {/* RUTA PROTEGIDA DASHBOARD */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute user={user} role="admin, partner">
                    <div style={{ height: 'calc(100vh - 76px)', overflow: 'hidden' }}>
                       <AdminDashboard user={user} />
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Chatbot (Solo si tiene suscripción activa) */}
          {user.subscription_active && (
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
              <ChatbotWidget />
            </div>
          )}
        </>
      )}

      {/* MODAL CONTACTO */}
      {showContactModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contáctanos</h5>
                <button type="button" className="btn-close" onClick={() => setShowContactModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>📧 Email: contacto@agendavet.com</p>
                <p>📞 Tel: +52 555 123 4567</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowContactModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;