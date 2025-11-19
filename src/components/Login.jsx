import React, { useState } from 'react';
import axios from 'axios';
import { fakeUsers } from '../fakeUsers'; // 👈 importamos los usuarios locales
import SocialLogin from './SocialLogin';


// Importa las imágenes de ojo
import eyeOpen from "../assets/eyeOpen.jpg";
import eyeClose from "../assets/eyeClose.jpg";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para manejar la visibilidad de la contraseña

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

     // ✅ 1. Intentar login local
    const localUser = fakeUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (localUser) {
      localStorage.setItem('token', 'fake-token'); // Token falso
      localStorage.setItem('userLocal', JSON.stringify(localUser)); // 👈 Aquí guardamos el usuario local
      onLogin(localUser);
      return;
    }

    try {
      const response = await axios.post('https://vetpet-sandbox-vkt2.onrender.com/api/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      onLogin(user); // Callback para actualizar el estado global
    } catch (error) {
      setError('Credenciales incorrectas');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alterna la visibilidad de la contraseña
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-5 col-md-8">
        {/* Tarjeta de Login */}
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          {/* Encabezado con imagen */}
          <div className="bg-primary py-4 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
              alt="Logo Veterinaria"
              className="img-fluid"
              style={{ height: '80px' }}
            />
            <h2 className="text-white mt-3 mb-0">Iniciar Sesión</h2>
          </div>
          {/* Cuerpo del formulario */}
          <div className="card-body p-4 p-md-5">
            {error && (
              <div className="alert alert-danger text-center mb-4 py-2">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Campo Email */}
              <div className="mb-4">
                <label htmlFor="email" className="form-label fw-semibold">
                  <i className="bi bi-envelope-fill text-primary me-2"></i>
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="mb-4 position-relative">
                <label htmlFor="password" className="form-label fw-semibold">
                  <i className="bi bi-lock-fill text-primary me-2"></i>
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}  // Cambia el tipo según la visibilidad
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light"
                    onClick={togglePasswordVisibility} // Alterna la visibilidad
                  >
                    {/* Cambia entre imagen de ojo cerrado y abierto */}
                    <img
                      src={showPassword ? eyeOpen : eyeClose}
                      alt="Eye Icon"
                      style={{ width: '20px', height: '20px' }} // Ajusta el tamaño de la imagen
                    />
                  </button>
                </div>
              </div>

              {/* Recordar contraseña */}
              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label className="form-check-label small" htmlFor="rememberMe">
                  Recordar mi sesión
                </label>
              </div>
<div>
  <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar sesión
              </button>
</div>
                      {/* Social Login */}
<div className="d-flex align-items-center my-4">
  <hr className="flex-grow-1" />
  <span className="px-2 text-muted small">o continuar con</span>
  <hr className="flex-grow-1" />
</div>
{/* Reemplaza los <a href=...> por: */}
<SocialLogin onLogin={onLogin} />

              {/* Botón de Login */}
              
            </form>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-4 small text-muted">
          <p className="mb-0">© {new Date().getFullYear()} Veterinaria App. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
