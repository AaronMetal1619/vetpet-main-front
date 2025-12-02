import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CrearCitaCliente = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const vet = state?.vet; // Veterinaria seleccionada en el mapa

    const [formData, setFormData] = useState({
        mascota: '',
        fecha: '',
        hora: '',
        motivo: ''
    });

    // Si intenta entrar directo sin seleccionar vet
    if (!vet) {
        return (
            <div className="container my-5 text-center">
                <h3>⚠️ Debes seleccionar una veterinaria primero.</h3>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/agendar')}>Ir al Mapa</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aquí usamos la ruta pública o protegida según tu lógica.
            // Si es pública, cualquiera puede agendar.
            await axios.post('https://vetpet-back.onrender.com/api/citas', {
                nombre: `Cliente Web - Mascota: ${formData.mascota}`, // Formato simple
                fecha: `${formData.fecha} ${formData.hora}`,
                motivo: `Cita con ${vet.name}: ${formData.motivo}`
            });
            
            alert(`¡Listo! Tu cita con ${vet.name} ha sido registrada.`);
            navigate('/'); // Volver al inicio
        } catch (error) {
            console.error(error);
            alert("Hubo un error al agendar. Intenta nuevamente.");
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-success text-white py-3">
                            <h4 className="mb-0">Agendar con {vet.name}</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="alert alert-info mb-4">
                                <i className="bi bi-geo-alt-fill me-2"></i>
                                <strong>Ubicación:</strong> {vet.address || 'Sin dirección'}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de tu Mascota</label>
                                    <input 
                                        type="text" className="form-control" 
                                        value={formData.mascota}
                                        onChange={e => setFormData({...formData, mascota: e.target.value})}
                                        required 
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label">Fecha</label>
                                        <input 
                                            type="date" className="form-control" 
                                            min={new Date().toISOString().split('T')[0]}
                                            value={formData.fecha}
                                            onChange={e => setFormData({...formData, fecha: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label">Hora</label>
                                        <input 
                                            type="time" className="form-control" 
                                            value={formData.hora}
                                            onChange={e => setFormData({...formData, hora: e.target.value})}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Motivo de la visita</label>
                                    <textarea 
                                        className="form-control" rows="3"
                                        placeholder="Ej: Vacuna anual, dolor de estómago..."
                                        value={formData.motivo}
                                        onChange={e => setFormData({...formData, motivo: e.target.value})}
                                        required
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-success btn-lg">Confirmar Cita</button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/agendar')}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearCitaCliente;