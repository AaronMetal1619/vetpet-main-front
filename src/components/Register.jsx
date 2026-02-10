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
      console.log("Enviando datos de registro a Oracle...", formData);
      
      // CAMBIO IMPORTANTE: URL LOCAL
      const response = await axios.post(
        'http://127.0.0.1:8000/api/register',
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log("Respuesta del servidor: ", response.data);

      if (response.data?.user) {
        // Guardamos un token temporal (luego configuraremos Sanctum bien)
        localStorage.setItem('token', response.data.token || 'demo-token');
        if (onRegister) {
          onRegister(response.data.user);
        }
      }
    } catch (error) {
      console.error("Error durante el registro: ", error);
      if (error.response?.data?.message) {
         setError(error.response.data.message);
      } else {
         setError('Error al conectar con el servidor Laravel/Oracle');
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
                 <h2 className="mb-0">Crear Cuenta VitaFem</h2>
                 <p className="mb-0 opacity-75">Registro de usuarios</p>
              </div>
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4 py-2">
                    <div>{error}</div>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Nombre Completo</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Correo Electrónico</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary py-3" disabled={loading}>
                      {loading ? 'Guardando en Oracle...' : 'Registrarse'}
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