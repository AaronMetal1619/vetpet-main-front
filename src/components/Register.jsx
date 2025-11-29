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
      console.log("Enviando datos de registro: ", formData);
      // NUEVA URL
      const response = await axios.post(
        'https://vetpet-back.onrender.com/api/register',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false, 
        }
      );

      console.log("Respuesta del servidor: ", response.data);

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        if (onRegister) {
          onRegister(response.data.user);
        }
      } else {
        setError('No se recibió un token válido del servidor.');
      }
    } catch (error) {
      console.error("Error durante el registro: ", error);
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
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
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

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4 py-2">
                    <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
                    <div>{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-semibold">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      Nombre Completo
                    </label>
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

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      Correo Electrónico
                    </label>
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

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="bi bi-key-fill text-primary me-2"></i>
                      Contraseña
                    </label>
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