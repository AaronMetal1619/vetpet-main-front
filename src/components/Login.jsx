import React, { useState } from 'react';
import axios from 'axios';

// Importa tus imagenes si las tienes en src/assets, si no comenta estas lineas
// import eyeOpen from "../assets/eyeOpen.jpg";
// import eyeClose from "../assets/eyeClose.jpg";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // LOGIN REAL (ORACLE / LARAVEL)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        credentials
      );

      const { token, user } = response.data;
      
      // Adaptamos el usuario que viene de Oracle para que React lo entienda
      // Oracle devuelve mayúsculas, React suele esperar minúsculas en la lógica vieja
      const formattedUser = {
          ...user,
          // Aquí puedes mapear roles si ya tuvieras la tabla de roles llena
          canAccessDashboard: true, // Temporal para que te deje entrar
          canUseChatbot: true
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(formattedUser));

      onLogin(formattedUser);
    } catch (error) {
      console.error(error);
      setError("Credenciales incorrectas o error de servidor");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-5 col-md-8">
        <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
          <div className="bg-primary py-4 text-center">
            <h2 className="text-white mt-3 mb-0">Iniciar Sesión</h2>
          </div>

          <div className="card-body p-4 p-md-5">
            {error && (
              <div className="alert alert-danger text-center mb-4 py-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Correo Electrónico</label>
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

              <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;