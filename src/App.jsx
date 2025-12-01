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
import VetFormPage from './components/dashboard/VetFormPage'; 

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const location = useLocation();
  
  // Usamos esto SOLO para saber si usamos ancho completo (fluid) o con márgenes (container)
  // YA NO LO USAMOS PARA OCULTAR EL NAVBAR
  const isFullWidthPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/create-vet');

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const token = localStorage.getItem('token');
    if (token) {
      if(token === 'fake-token'){
         const localUser = JSON.parse(localStorage.getItem('userLocal'));
         if(localUser) setUser(localUser);
      } else {
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
    // Si es una página tipo dashboard, usamos todo el ancho. Si es normal, usamos container centrado.
    <div className={isFullWidthPage ? "container-fluid p-0" : "container mt-4"}>
      
      {!user ? (
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
        <>
          {/* ✅ NAVBAR SIEMPRE VISIBLE */}
          <Navbar 
            user={user}
            handleLogout={handleLogout}
            setShowContactModal={setShowContactModal}
          />

          {/* ✅ CONTENIDO CON MARGEN SUPERIOR SIEMPRE */}
          {/* El navbar es fixed-top (aprox 76px), empujamos el contenido para que no se tape */}
          <div style={{ marginTop: '76px', minHeight: 'calc(100vh - 76px)' }}>
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
                    {/* Ajustamos altura para que el sidebar llene lo que sobra de pantalla */}
                    <div style={{ height: 'calc(100vh - 76px)', overflow: 'hidden' }}>
                       <AdminDashboard user={user} />
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* RUTA FORMULARIO VETERINARIAS */}
              <Route 
                path="/create-vet" 
                element={
                  <ProtectedRoute user={user} role="admin, partner">
                     {/* Un contenedor interno para dar aire al formulario */}
                     <div className="container py-4">
                        <VetFormPage />
                     </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <ChatbotWidget />
        </>
      )}

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