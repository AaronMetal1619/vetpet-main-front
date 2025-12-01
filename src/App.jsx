import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Componentes Generales
import Navbar from './components/Navbar'; 
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';

// Páginas Públicas
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Perfil from './components/Perfil';
import Servicios from './components/Servicios';
import PanelSuscripciones from './components/PanelSuscripciones';
import AgendarCita from './components/AgendarCita'; // Agendar del lado del cliente (Mapa)

// Páginas del Dashboard (Privadas)
import AdminDashboard from './components/dashboard/AdminDashboard'; 
import VetFormPage from './components/dashboard/VetFormPage'; 
import AppointmentFormPage from './components/dashboard/AppointmentFormPage'; // ✅ NUEVO IMPORT

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const location = useLocation();
  
  // Lógica para saber cuándo usar "container-fluid" (ancho completo) vs "container" (centrado)
  // Usamos ancho completo en el Dashboard y en los Formularios de Gestión
  const isFullWidthPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/create-vet') ||
                          location.pathname.startsWith('/create-appointment');

  useEffect(() => {
    // Cargar iconos
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Validar sesión
    const token = localStorage.getItem('token');
    if (token) {
      if(token === 'fake-token'){
         const localUser = JSON.parse(localStorage.getItem('userLocal'));
         if(localUser) setUser(localUser);
      } else {
        // ✅ URL DEL BACKEND NUEVO
        axios.get('https://vetpet-back.onrender.com/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setUser(response.data))
        .catch(() => {
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
    <div className={isFullWidthPage ? "container-fluid p-0" : "container mt-4"}>
      
      {!user ? (
        // === USUARIO NO LOGUEADO ===
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
        // === USUARIO LOGUEADO ===
        <>
          {/* Navbar visible siempre */}
          <Navbar 
            user={user}
            handleLogout={handleLogout}
            setShowContactModal={setShowContactModal}
          />

          {/* Margen para evitar que el contenido quede bajo el Navbar */}
          <div style={{ marginTop: '76px', minHeight: 'calc(100vh - 76px)' }}>
            <Routes>
              {/* Rutas Públicas (para usuario logueado) */}
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/suscripciones" element={<PanelSuscripciones />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/agendar" element={<AgendarCita />} />

              {/* 🛡️ RUTAS PROTEGIDAS (ADMIN / PARTNER) */}
              
              {/* 1. Dashboard Principal */}
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

              {/* 2. Formulario Crear/Editar Veterinaria */}
              <Route 
                path="/create-vet" 
                element={
                  <ProtectedRoute user={user} role="admin, partner">
                     <div className="container py-4">
                        <VetFormPage />
                     </div>
                  </ProtectedRoute>
                } 
              />

              {/* 3. Formulario Crear Cita (✅ NUEVO) */}
              <Route 
                path="/create-appointment" 
                element={
                  <ProtectedRoute user={user} role="admin, partner">
                     <div className="container py-4">
                        <AppointmentFormPage />
                     </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Widget Chatbot */}
          <ChatbotWidget />
        </>
      )}

      {/* Modales Globales */}
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