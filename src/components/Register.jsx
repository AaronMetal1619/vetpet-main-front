import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Enviando datos de registro: ", formData); // Log para ver los datos que se envían
      const response = await axios.post(
      'https://vetpet-sandbox-vkt2.onrender.com/api/register',
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false, // 🔥 Importante si supports_credentials = true en Laravel
      }
    );


      console.log("Respuesta del servidor: ", response.data); // Log para ver la respuesta del servidor

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        console.log("Token guardado en localStorage: ", response.data.token); // Log para verificar el token guardado

        if (onRegister) {
          onRegister(response.data.user);
        }
      } else {
        setError('No se recibió un token válido del servidor.');
      }
    } catch (error) {
      console.error("Error durante el registro: ", error); // Log para ver el error
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        setError(`Errores: ${errorMessages}`);
      } else {
        setError(error.response?.data?.message || 'Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            {/* Tarjeta de Registro */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              {/* Encabezado con imagen */}
              <div className="bg-primary py-4 text-center text-white">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
                  alt="Logo Veterinaria"
                  className="img-fluid mb-3"
                  style={{ height: '70px' }}
                />
                <h2 className="mb-0">Crear Cuenta</h2>
                <p className="mb-0 opacity-75">Únete a nuestra comunidad</p>
              </div>

              {/* Cuerpo del formulario */}
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4 py-2">
                    <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Campo Nombre */}
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      Nombre Completo
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Escribe tu nombre"
                        required
                      />
                    </div>
                  </div>

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
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Correo electrónico"
                        required
                      />
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-key-fill text-primary me-2"></i>
                      Contraseña
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Crea una contraseña"
                        required
                      />
                    </div>
                  </div>

                  {/* Botón de Registro */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary py-3"
                      disabled={loading}
                    >
                      {loading ? 'Cargando...' : 'Registrarse'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
