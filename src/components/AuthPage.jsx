import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "../Estilos/AuthPage.css";

// IMAGEN DE FONDO (Puedes cambiarla por una url de médicos real)
const BG_IMAGE = "url('https://img.freepik.com/foto-gratis/equipo-medico-exitoso_329181-3837.jpg')";

const AuthPage = ({ onLogin }) => {
  // Estado para controlar la animación (false = Login, true = Registro)
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // --- LÓGICA DE REGISTRO ---
  const [regData, setRegData] = useState({ name: '', email: '', password: '' });
  const [regError, setRegError] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  const handleRegChange = (e) => setRegData({ ...regData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError(null);
    setRegLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', regData);
      
      if (response.data?.user) {
        // Si el registro es exitoso, logueamos automáticamente o pedimos login
        // Opción A: Auto-login
        localStorage.setItem('token', response.data.token || 'demo-token');
        const formattedUser = { ...response.data.user, canAccessDashboard: true };
        localStorage.setItem("user", JSON.stringify(formattedUser));
        onLogin(formattedUser);
      }
    } catch (error) {
      if (error.response?.status === 422) {
          setRegError("El correo ya está registrado.");
      } else {
          setRegError("Error al registrar usuario.");
      }
    } finally {
      setRegLoading(false);
    }
  };

  // --- LÓGICA DE LOGIN ---
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState(null);

  // LA FUNCIÓN QUE FALTABA
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoginError(null);
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", loginData);
      const { token, user } = response.data;
      
      // --- TRUCO VIP ---
      let userRole = 'user'; 
      if (user.correo === 'admin@vitafem.com' || user.CORREO === 'admin@vitafem.com') {
          userRole = 'admin';
      } else if (user.correo === 'doctor@vitafem.com' || user.CORREO === 'doctor@vitafem.com') {
          userRole = 'medico'; 
      }

      const formattedUser = {
          ...user,
          role: userRole,
          canAccessDashboard: true,
          canUseChatbot: true
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(formattedUser));
      
      onLogin(formattedUser); 
      
    } catch (error) {
      setLoginError("Credenciales incorrectas.");
    }
  };

  return (
    <div className="auth-body">
      <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        
        {/* --- FORMULARIO DE REGISTRO (Lado Izquierdo, oculto al inicio) --- */}
        <div className="form-container sign-up-container">
          <form className="auth-form" onSubmit={handleRegister}>
            <h1 className="fw-bold mb-2">Crear Cuenta</h1>
            <div className="social-container">
              <a href="#" className="social"><FaFacebookF /></a>
              <a href="#" className="social"><FaGoogle /></a>
              <a href="#" className="social"><FaLinkedinIn /></a>
            </div>
            <span className="small text-muted mb-3">o usa tu correo para registrarte</span>
            
            <input type="text" name="name" placeholder="Nombre Completo" className="auth-input" value={regData.name} onChange={handleRegChange} required />
            <input type="email" name="email" placeholder="Correo Electrónico" className="auth-input" value={regData.email} onChange={handleRegChange} required />
            <input type="password" name="password" placeholder="Contraseña" className="auth-input" value={regData.password} onChange={handleRegChange} required />
            
            {regError && <div className="text-danger small mt-2">{regError}</div>}
            
            <button className="auth-btn mt-3" disabled={regLoading}>
                {regLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>

        {/* --- FORMULARIO DE LOGIN (Lado Derecho, visible al inicio) --- */}
        <div className="form-container sign-in-container">
          <form className="auth-form" onSubmit={handleLogin}>
            <h1 className="fw-bold mb-2">Iniciar Sesión</h1>
            <div className="social-container">
              <a href="#" className="social"><FaFacebookF /></a>
              <a href="#" className="social"><FaGoogle /></a>
              <a href="#" className="social"><FaLinkedinIn /></a>
            </div>
            <span className="small text-muted mb-3">o usa tu cuenta existente</span>
            
            <input type="email" name="email" placeholder="Correo" className="auth-input" value={loginData.email} onChange={handleLoginChange} required />
            <input type="password" name="password" placeholder="Contraseña" className="auth-input" value={loginData.password} onChange={handleLoginChange} required />
            
            <a href="#" className="small text-muted mt-2 text-decoration-none">¿Olvidaste tu contraseña?</a>
            
            {loginError && <div className="text-danger small mt-2">{loginError}</div>}

            <button className="auth-btn mt-3">Ingresar</button>
          </form>
        </div>

        {/* --- PANEL DESLIZANTE (OVERLAY) --- */}
        <div className="overlay-container">
          <div className="overlay" style={{backgroundImage: BG_IMAGE}}>
            
            {/* Panel Izquierdo (Se ve cuando estás en Registro) */}
            <div className="overlay-panel overlay-left">
              <h1 className="fw-bold">¡Bienvenido de nuevo!</h1>
              <p className="mb-4">Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal</p>
              <button className="auth-btn ghost" onClick={() => setIsRightPanelActive(false)}>
                Inicia Sesión
              </button>
            </div>

            {/* Panel Derecho (Se ve cuando estás en Login) */}
            <div className="overlay-panel overlay-right">
              <h1 className="fw-bold">Hola, Amiga</h1>
              <p className="mb-4">Ingresa tus datos personales y comienza tu viaje de salud con VitaFem</p>
              <button className="auth-btn ghost" onClick={() => setIsRightPanelActive(true)}>
                Registrarse
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;