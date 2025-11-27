import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- Importación de Componentes ---
import Navbar from './components/Navbar'; // ✅ Aquí importamos el Navbar separado
import ProtectedRoute from './components/ProtectedRoute';
import PanelSuscripciones from './components/PanelSuscripciones';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Perfil from './components/Perfil';
import AgendarCita from './components/AgendarCita';
import Servicios from './components/Servicios';
import ChatbotWidget from './components/ChatbotWidget';

// Importación del Dashboard Modular
import AdminDashboard from './components/dashboard/AdminDashboard'; 

// --- Componente de Contenido (Lógica Principal) ---
const AppContent = () => {
  console.log("🧠 Chatbot URL:", import.meta.env.VITE_CHATBOT_URL);

  // --- Estados ---
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showAgendar, setShowAgendar] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [showPerfil, setShowPerfil] = useState(false);
  const [showServicios, setShowServicios] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);

  // --- Hooks de Router ---
  const location = useLocation();
  // Si la ruta empieza con "/dashboard", activamos el modo pantalla completa (sin navbar azul)
  const isDashboard = location.pathname.startsWith('/dashboard');

  // --- Efectos ---
  useEffect(() => {
    // Cargar iconos de Bootstrap
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Recuperar sesión
    const token = localStorage.getItem('token');
    
    if (token && token === 'fake-token') {
      const localUser = JSON.parse(localStorage.getItem('userLocal'));
      if (localUser) setUser(localUser);
    } else if (token) {
      axios.get('https://vetpet-sandbox-vkt2.onrender.com/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  // --- Manejadores ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = "/"; 
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleAgendarCita = (vet) => {
    setSelectedVet(vet);
    setShowAgendar(true);
  };

  const handleReload = () => {
    if (!isDashboard) window.scrollTo(0, 0);
  };

  // --- Renderizado ---
  return (
    // Si estamos en dashboard, quitamos el contenedor para usar todo el ancho
    <div className={isDashboard ? "container-fluid p-0" : "container mt-4"}>
      
      {!user ? (
        // === VISTA NO AUTENTICADA ===
        showRegister ? (
          <Register onRegister={handleLogin} />
        ) : (
          <div>
             <Login onLogin={handleLogin} />
             <div className="text-center mt-4">
                <button className="btn btn-link w-100" onClick={() => setShowRegister(true)}>
                  ¿No tienes cuenta? Regístrate
                </button>
             </div>
          </div>
        )
      ) : (
        // === VISTA AUTENTICADA ===
        <div>
          {/* Mostramos el Navbar solo si NO estamos en el Dashboard */}
          {!isDashboard && (
            <Navbar 
              user={user}
              handleLogout={handleLogout}
              handleReload={handleReload}
              showServicios={showServicios}
              setShowServicios={setShowServicios}
              setShowContactModal={setShowContactModal}
              setShowPerfil={setShowPerfil}
            />
          )}

          {/* Ajuste de margen para no quedar debajo del Navbar fijo */}
          <div style={{ marginTop: !isDashboard ? '80px' : '0' }}>
            <Routes>
              <Route path="/" element={
                 !showAgendar && !showPerfil && !showServicios ? (
                    <Home handleLogout={handleLogout} onAgendarCita={handleAgendarCita} />
                  ) : (
                    showPerfil ? <Perfil /> : <Servicios />
                  )
              } />
              
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/agendar" element={<AgendarCita vet={selectedVet} />} />
              
              {/* RUTA PROTEGIDA DEL DASHBOARD (Admite Admin y Veterinaria) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute user={user} role="admin, veterinaria">
                    <AdminDashboard user={user} />
                  </ProtectedRoute>
                } 
              />

              <Route path="/suscripciones" element={<PanelSuscripciones />} />
            </Routes>
          </div>

          {/* Chatbot Flotante (incluso en dashboard) */}
          {user && user.subscription_active === true && (
            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
              <ChatbotWidget />
            </div>
          )}
        </div>
      )}

      {/* --- MODALES --- */}
      
      {/* Modal Contacto */}
      {showContactModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contáctanos</h5>
                <button type="button" className="btn-close" onClick={() => setShowContactModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Escríbenos a <b>soporte@agendavet.com</b></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowContactModal(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pago */}
      {showPagoModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Suscríbete</h5>
                <button type="button" className="btn-close" onClick={() => setShowPagoModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Plan Premium por $99 MXN/mes.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPagoModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={() => window.open("https://buy.stripe.com/test_...", "_blank")}>Pagar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Componente Principal (Wrapper) ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;