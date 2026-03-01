import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Componentes Generales
import Navbar from './components/Navbar'; 
import ProtectedRoute from './components/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';

// Páginas Públicas y Autenticación
import AuthPage from './components/AuthPage'; // <--- EL NUEVO COMPONENTE ÚNICO
import Home from './components/Home';
import Perfil from './components/Perfil';
import Servicios from './components/Servicios';
import PanelSuscripciones from './components/PanelSuscripciones';
import AgendarCita from './components/AgendarCita'; 
import CrearCitaCliente from './components/CrearCitaCliente';

// Páginas del Dashboard (Privadas)
import AdminDashboard from './components/dashboard/AdminDashboard'; 
import VetFormPage from './components/dashboard/VetFormPage'; 
import AppointmentFormPage from './components/dashboard/AppointmentFormPage';
import MedicoDashboard from './components/dashboard/MedicoDashboard'; // Ajusta la ruta de la carpeta si es necesario

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Ya no necesitamos 'showRegister' porque AuthPage lo maneja solito

  const location = useLocation();
  
  // Lógica para el ancho de página
  const isFullWidthPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/create-vet') ||
                          location.pathname.startsWith('/create-appointment');

 useEffect(() => {
    // Cargar iconos
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Validar sesión al cargar confiando 100% en el LocalStorage
    const token = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user');

    if (token && storedUserStr && storedUserStr !== 'undefined') {
        const localUser = JSON.parse(storedUserStr);
        
        // REFUERZO DE ROL PARA ASEGURAR QUE NO LO PIERDA AL RECARGAR
        if (localUser.correo === 'admin@vitafem.com' || localUser.CORREO === 'admin@vitafem.com') {
            localUser.role = 'admin';
        }

        setUser(localUser); 
        
        // TODO: Reactivar esto cuando Sanctum genere tokens válidos en Laravel
        /*
        axios.get('http://127.0.0.1:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        });
        */
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = "/";
  };

  const handleLogin = (userData) => {
      setUser(userData);
  };

  // --- RENDERIZADO PRINCIPAL ---
  
  // 1. SI EL USUARIO NO ESTÁ LOGUEADO: Mostramos solo el AuthPage
  if (!user) {
      return <AuthPage onLogin={handleLogin} />;
  }

  // 2. SI EL USUARIO SÍ ESTÁ LOGUEADO: Mostramos la App completa
  return (
    <div className={isFullWidthPage ? "container-fluid p-0" : "container mt-4"}>
      
        {/* Navbar visible siempre */}
        <Navbar 
          user={user}
          handleLogout={handleLogout}
          setShowContactModal={setShowContactModal}
        />

        {/* Contenedor Principal */}
        <div style={{ marginTop: '76px', minHeight: 'calc(100vh - 76px)' }}>
          <Routes>
            {/* Rutas Públicas (para usuario logueado) */}
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/suscripciones" element={<PanelSuscripciones />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/agendar" element={<AgendarCita />} />
            <Route path="/crear-cita-cliente" element={<CrearCitaCliente />} />

            {/* 🛡️ RUTAS PROTEGIDAS (ADMIN / PARTNER) */}
            
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
            {/* 👇 PEGA LA NUEVA RUTA AQUÍ, JUNTO A LAS DEMÁS 👇 */}
          <Route path="/panel-medico" element={
              <ProtectedRoute user={user}>
                  <MedicoDashboard />
              </ProtectedRoute>
          } />

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
            
            {/* Cualquier otra ruta redirige al Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Widget Chatbot */}
        <ChatbotWidget />

      {/* Modales Globales (Emergencia) */}
      {showContactModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-shield-fill-exclamation me-2"></i>
                  Zona de Emergencias
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowContactModal(false)}></button>
              </div>

              <div className="modal-body text-center p-4">
                <div className="mb-3">
                   <i className="bi bi-android2 text-success" style={{fontSize: '4.5rem'}}></i>
                </div>
                
                <h4 className="fw-bold mb-2">Descarga nuestra App Móvil</h4>
                <p className="text-muted mb-4">
                  Instala nuestra aplicación oficial para acceder al <strong>Botón de Pánico Veterinario</strong> y geolocalización en tiempo real.
                </p>

                <div className="d-grid gap-2">
                  <a 
                    href="/vetpet-app.apk" 
                    download="VetPet_Emergencia.apk"
                    className="btn btn-dark btn-lg"
                  >
                    <i className="bi bi-cloud-arrow-down-fill me-2"></i> 
                    Descargar APK
                  </a>
                </div>

                <small className="d-block mt-3 text-muted" style={{fontSize: '0.75rem'}}>
                  * Requiere habilitar "Instalar de fuentes desconocidas" en tu Android.
                </small>
              </div>

              <div className="modal-footer bg-light">
                <button className="btn btn-outline-secondary w-100" onClick={() => setShowContactModal(false)}>Cerrar</button>
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