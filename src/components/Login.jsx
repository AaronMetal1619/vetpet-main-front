import React, { useState } from 'react';
import axios from 'axios';
import { fakeUsers } from '../fakeUsers';
import SocialLogin from './SocialLogin';

import eyeOpen from "../assets/eyeOpen.jpg";
import eyeClose from "../assets/eyeClose.jpg";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // VALIDAR MEMBRESÍA PARA CHATBOT
  // -----------------------------
  const canUseChatbot = (membership) => {
    if (!membership) return false;

    const valid = ["basica", "premium_plus", "premium_plus_anual"];
    return valid.includes(membership);
  };

  // -----------------------------
  // VALIDAR PERMISOS POR ROL
  // -----------------------------
  const formatUserAccess = (user) => {
    return {
      ...user,
      canAccessDashboard: user.role === "admin" || user.role === "veterinario",
      canUseChatbot: user.role !== "usuario"
        ? true
        : canUseChatbot(user.membership),
    };
  };

  // -----------------------------
  // SUBMIT LOGIN
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // ---------------------------------------------------------
    // 1️⃣ LOGIN LOCAL (fakeUsers)
    // ---------------------------------------------------------
    const localUser = fakeUsers.find(
      (u) =>
        u.email === credentials.email &&
        u.password === credentials.password
    );

    if (localUser) {
      const formattedUser = formatUserAccess(localUser);

      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify(formattedUser));

      onLogin(formattedUser);
      return;
    }

    // ---------------------------------------------------------
    // 2️⃣ LOGIN REAL (API Laravel)
    // ---------------------------------------------------------
    try {
      const response = await axios.post(
        "https://vetpet-sandbox-1.onrender.com/api/login",
        credentials
      );

      const { token, user } = response.data;

      const formattedUser = formatUserAccess(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(formattedUser));

      onLogin(formattedUser);
    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="row justify-content-center">
      <div className="col-lg-5 col-md-8">
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          <div className="bg-primary py-4 text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
              alt="Logo Veterinaria"
              className="img-fluid"
              style={{ height: "80px" }}
            />
            <h2 className="text-white mt-3 mb-0">Iniciar Sesión</h2>
          </div>

          <div className="card-body p-4 p-md-5">
            {error && (
              <div className="alert alert-danger text-center mb-4 py-2">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
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

              {/* CONTRASEÑA */}
              <div className="mb-4 position-relative">
                <label className="form-label fw-semibold">
                  <i className="bi bi-lock-fill text-primary me-2"></i>
                  Contraseña
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-lock text-muted"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />

                  <button
                    type="button"
                    className="input-group-text bg-light"
                    onClick={togglePasswordVisibility}
                  >
                    <img
                      src={showPassword ? eyeOpen : eyeClose}
                      alt="Eye Icon"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </button>
                </div>
              </div>

              {/* RECORDAR */}
              <div className="mb-4 form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label small" htmlFor="rememberMe">
                  Recordar mi sesión
                </label>
              </div>

              {/* BOTÓN */}
              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar sesión
              </button>

              {/* SOCIAL LOGIN */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted small">o continuar con</span>
                <hr className="flex-grow-1" />
              </div>

              <SocialLogin onLogin={onLogin} />
            </form>
          </div>
        </div>

        <div className="text-center mt-4 small text-muted">
          © {new Date().getFullYear()} Veterinaria App.
        </div>
      </div>
    </div>
  );
};

export default Login;
