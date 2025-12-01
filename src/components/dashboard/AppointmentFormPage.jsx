import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppointmentFormPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        fecha: '',
        hora: '',
        motivo: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Combinamos fecha y hora para enviar al backend (o lo mandamos como string simple)
        const fechaFinal = `${formData.fecha} ${formData.hora}`;

        try {
            await axios.post('https://vetpet-back.onrender.com/api/citas', {
                nombre: formData.nombre,
                fecha: fechaFinal,
                motivo: formData.motivo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Cita agendada con éxito");
            navigate('/dashboard'); // Volver al dashboard
        } catch (error) {
            console.error(error);
            alert("Error al agendar la cita");
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0">Nueva Cita</h4>
                    <button className="btn btn-light btn-sm" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-arrow-left"></i> Volver
                    </button>
                </div>
                <div className="card-body p-5">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Nombre del Cliente / Mascota</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg" 
                                name="nombre" 
                                value={formData.nombre} 
                                onChange={handleChange} 
                                placeholder="Ej: Juan Pérez - Firulais"
                                required 
                            />
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Fecha</label>
                                <input 
                                    type="date" 
                                    className="form-control form-control-lg" 
                                    name="fecha" 
                                    value={formData.fecha} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Hora</label>
                                <input 
                                    type="time" 
                                    className="form-control form-control-lg" 
                                    name="hora" 
                                    value={formData.hora} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Motivo de la consulta</label>
                            <textarea 
                                className="form-control" 
                                name="motivo" 
                                rows="3"
                                value={formData.motivo} 
                                onChange={handleChange} 
                                placeholder="Ej: Vacunación anual, revisión de oídos..."
                                required 
                            ></textarea>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-lg">
                                Agendar Cita
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentFormPage;