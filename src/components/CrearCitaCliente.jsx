import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CrearCitaCliente = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const vet = state?.vet; 

    const [pets, setPets] = useState([]); // Lista de mascotas del usuario
    const [formData, setFormData] = useState({
        mascota: '',
        fecha: '',
        hora: '',
        motivo: ''
    });

    // Cargar mascotas al iniciar
    useEffect(() => {
        const fetchPets = async () => {
            const token = localStorage.getItem('token');
            // Si no hay token, no podemos cargar sus mascotas (quizás redirigir a login)
            if (!token) return;

            try {
                const res = await axios.get('https://vetpet-back.onrender.com/api/pets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPets(res.data);
                // Si tiene mascotas, pre-seleccionar la primera
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, mascota: res.data[0].name }));
                }
            } catch (error) {
                console.error("Error cargando mascotas:", error);
            }
        };
        fetchPets();
    }, []);

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
            await axios.post('https://vetpet-back.onrender.com/api/citas', {
                // Guardamos el nombre de la mascota seleccionada
                nombre: `Cliente Web - Mascota: ${formData.mascota}`, 
                fecha: `${formData.fecha} ${formData.hora}`,
                motivo: `Cita con ${vet.name}: ${formData.motivo}`
            });
            
            alert(`¡Listo! Cita para ${formData.mascota} registrada.`);
            navigate('/'); 
        } catch (error) {
            console.error(error);
            alert("Hubo un error al agendar.");
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
                                
                                {/* SELECCIÓN DE MASCOTA */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Selecciona tu Mascota</label>
                                    {pets.length > 0 ? (
                                        <select 
                                            className="form-select"
                                            value={formData.mascota}
                                            onChange={e => setFormData({...formData, mascota: e.target.value})}
                                            required
                                        >
                                            <option value="" disabled>Elige una mascota...</option>
                                            {pets.map(pet => (
                                                <option key={pet.id} value={pet.name}>
                                                    {pet.name} ({pet.breed})
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="alert alert-warning p-2 small">
                                            No tienes mascotas registradas. 
                                            <button type="button" className="btn btn-link p-0 ms-1 align-baseline" onClick={() => navigate('/perfil')}>Registrar una aquí</button>.
                                        </div>
                                    )}
                                    {/* Campo de texto libre por si quiere escribir otra cosa */}
                                    {pets.length === 0 && (
                                        <input 
                                            type="text" 
                                            className="form-control mt-2" 
                                            placeholder="Escribe el nombre de tu mascota"
                                            value={formData.mascota}
                                            onChange={e => setFormData({...formData, mascota: e.target.value})}
                                            required
                                        />
                                    )}
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
                                        placeholder="Ej: Vacuna anual, revisión..."
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