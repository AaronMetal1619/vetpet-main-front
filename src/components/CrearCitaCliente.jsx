import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CrearCitaCliente = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const vet = state?.vet; 

    const [pets, setPets] = useState([]);
    const [slots, setSlots] = useState([]); // AQUI GUARDAMOS LAS HORAS DISPONIBLES
    const [loadingSlots, setLoadingSlots] = useState(false);

    const [formData, setFormData] = useState({
        pet_id: '',
        fecha: '',
        hora: '', // Esto ya no lo escribe el usuario, lo selecciona
        motivo: ''
    });

    // 1. Cargar Mascotas (Igual que antes)
    useEffect(() => {
        const fetchPets = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await axios.get('https://vetpet-back.onrender.com/api/pets', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPets(res.data);
                if (res.data.length > 0) setFormData(prev => ({ ...prev, pet_id: res.data[0].id }));
            } catch (error) { console.error(error); }
        };
        fetchPets();
    }, []);

    // 2. Cargar Horarios cuando cambia la FECHA
    useEffect(() => {
        if (formData.fecha && vet) {
            fetchSlots();
        }
    }, [formData.fecha]);

    const fetchSlots = async () => {
        setLoadingSlots(true);
        setFormData(prev => ({ ...prev, hora: '' })); // Reiniciar hora si cambia fecha
        try {
            // Asumiendo que creaste la ruta en api.php
            const res = await axios.get(`https://vetpet-back.onrender.com/api/available-slots`, {
                params: { vet_id: vet.id, date: formData.fecha }
            });
            setSlots(res.data); // ['09:00:00', '10:00:00', ...]
        } catch (error) {
            console.error("Error cargando horarios", error);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.hora) return alert("Selecciona un horario");

        const token = localStorage.getItem('token');
        try {
            await axios.post('https://vetpet-back.onrender.com/api/appointments', {
                pet_id: formData.pet_id,
                vet_id: vet.id, // IMPORTANTE: ENVIAR EL ID DEL VETERINARIO
                date: formData.fecha,
                time: formData.hora,
                reason: formData.motivo,
                status: 'pending'
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert(`¡Cita agendada!`);
            navigate('/perfil');
        } catch (error) {
            alert("Error al agendar");
        }
    };

    if (!vet) return <div>Cargando...</div>;

    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0 mx-auto" style={{maxWidth: '600px'}}>
                <div className="card-header bg-success text-white">
                    <h4 className="mb-0">Agendar con {vet.name}</h4>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        
                        {/* SELECCIÓN DE MASCOTA (Igual que antes) */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Mascota</label>
                            <select className="form-select" value={formData.pet_id} onChange={e => setFormData({...formData, pet_id: e.target.value})}>
                                {pets.map(pet => <option key={pet.id} value={pet.id}>{pet.name}</option>)}
                            </select>
                        </div>

                        {/* SELECCIÓN DE FECHA */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Fecha de la Cita</label>
                            <input 
                                type="date" 
                                className="form-control"
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.fecha}
                                onChange={e => setFormData({...formData, fecha: e.target.value})}
                                required
                            />
                        </div>

                        {/* GRID DE HORARIOS (LA MAGIA TIPO INE) */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Horarios Disponibles</label>
                            
                            {!formData.fecha && <div className="text-muted small">Selecciona una fecha primero.</div>}
                            
                            {loadingSlots && <div className="spinner-border spinner-border-sm text-success ms-2"></div>}
                            
                            {formData.fecha && !loadingSlots && (
                                <div className="d-flex flex-wrap gap-2">
                                    {slots.length > 0 ? slots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            className={`btn ${formData.hora === time ? 'btn-success' : 'btn-outline-success'}`}
                                            onClick={() => setFormData({...formData, hora: time})}
                                            style={{ width: '80px' }}
                                        >
                                            {time.slice(0,5)} {/* Muestra 09:00 en vez de 09:00:00 */}
                                        </button>
                                    )) : (
                                        <div className="alert alert-warning w-100">No hay horarios disponibles para este día.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MOTIVO */}
                        <div className="mb-4">
                            <label className="form-label fw-bold">Motivo</label>
                            <textarea className="form-control" rows="2" required
                                value={formData.motivo} onChange={e => setFormData({...formData, motivo: e.target.value})}
                            ></textarea>
                        </div>

                        <button type="submit" className="btn btn-dark w-100 py-2">Confirmar Cita</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearCitaCliente;