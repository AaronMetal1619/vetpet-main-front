import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const AgendarCita = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Estado del Wizard (Pasos: 1 = Médico, 2 = Fecha/Hora, 3 = Confirmar)
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Datos traídos de la BD
    const [medicos, setMedicos] = useState([]);
    const [slots, setSlots] = useState([]);

    // Datos del formulario
    const [formData, setFormData] = useState({
        medico_id: '',
        medico_nombre: '',
        fecha: '',
        hora: '',
        motivo: ''
    });

    // 1. CARGAR MÉDICOS AL INICIAR
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        const fetchMedicos = async () => {
            try {
                // Ruta de Laravel que creamos antes
                const res = await axios.get('http://127.0.0.1:8000/api/medicos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMedicos(res.data);
            } catch (error) {
                console.error("Error cargando médicos", error);
            }
        };
        fetchMedicos();
    }, [token, navigate]);

    // 2. CARGAR HORARIOS CUANDO CAMBIA LA FECHA O EL MÉDICO
    useEffect(() => {
        if (formData.fecha && formData.medico_id) {
            fetchSlots();
        }
    }, [formData.fecha, formData.medico_id]);

    const fetchSlots = async () => {
        setLoading(true);
        setFormData(prev => ({ ...prev, hora: '' })); // Limpiar hora anterior
        
        try {
            // Ruta del motor de citas
            const res = await axios.get('http://127.0.0.1:8000/api/horarios-disponibles', {
                params: { id_medico: formData.medico_id, fecha: formData.fecha },
                headers: { Authorization: `Bearer ${token}` }
            });
            setSlots(res.data);
        } catch (error) {
            console.error("Error cargando horarios", error);
        } finally {
            setLoading(false);
        }
    };

    // 3. ENVIAR CITA A LA BASE DE DATOS
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Obtenemos el ID del paciente logueado
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const idPaciente = storedUser?.id_usuario || storedUser?.ID_USUARIO;

        try {
            // FASE 1 TERMINADA: Falta crear este POST en Laravel (Lo haremos en el siguiente paso)
            await axios.post('http://127.0.0.1:8000/api/citas', {
                ID_PACIENTE: idPaciente,
                ID_MEDICO: formData.medico_id,
                ID_USUARIO_REGISTRO: idPaciente,
                FECHA: formData.fecha,
                HORA: formData.hora,
                MOTIVO: formData.motivo
            }, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            alert(`¡Cita agendada exitosamente con ${formData.medico_nombre}!`);
            navigate('/perfil');
            
        } catch (error) {
            alert("Error al agendar la cita. Inténtalo de nuevo.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="card shadow-lg border-0 mx-auto rounded-4 overflow-hidden" style={{maxWidth: '700px'}}>
                
                {/* ENCABEZADO */}
                <div className="bg-primary text-white p-4 text-center">
                    <h3 className="fw-bold mb-0">Agendar Cita</h3>
                    <p className="mb-0 opacity-75">Sigue los pasos para programar tu visita</p>
                </div>

                {/* INDICADOR DE PASOS */}
                <div className="d-flex justify-content-center bg-light py-3 border-bottom">
                    <div className={`text-center px-3 ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                        <FaUserMd size={24} /><br/><small>Especialista</small>
                    </div>
                    <div className={`text-center px-3 ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                        <FaCalendarAlt size={24} /><br/><small>Fecha y Hora</small>
                    </div>
                    <div className={`text-center px-3 ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                        <FaCheckCircle size={24} /><br/><small>Confirmar</small>
                    </div>
                </div>

                <div className="card-body p-4 p-md-5">
                    
                    {/* --- PASO 1: ELEGIR MÉDICO --- */}
                    {step === 1 && (
                        <div className="animation-fade-in">
                            <h5 className="fw-bold mb-4 text-center">Selecciona a tu especialista</h5>
                            <div className="row g-3">
                                {medicos.length > 0 ? medicos.map(medico => (
                                    <div className="col-md-6" key={medico.id_medico}>
                                        <div 
                                            className="card h-100 border p-3 text-center cursor-pointer hover-shadow transition-all"
                                            style={{ cursor: 'pointer', borderColor: formData.medico_id === medico.id_medico ? '#0d6efd' : '#dee2e6' }}
                                            onClick={() => {
                                                setFormData({...formData, medico_id: medico.id_medico, medico_nombre: medico.nombre});
                                                setStep(2); // Avanzar automático
                                            }}
                                        >
                                            <img 
                                                src={medico.foto || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                                                alt={medico.nombre}
                                                className="rounded-circle mx-auto mb-2"
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                            <h6 className="fw-bold mb-1">{medico.nombre}</h6>
                                            <p className="text-muted small mb-0">{medico.especialidad}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center w-100 py-4"><div className="spinner-border text-primary"></div></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- PASO 2: FECHA Y HORA --- */}
                    {step === 2 && (
                        <div className="animation-fade-in">
                            <button className="btn btn-sm btn-link text-muted mb-3 px-0" onClick={() => setStep(1)}>
                                <FaArrowLeft /> Volver a especialistas
                            </button>
                            
                            <div className="mb-4">
                                <label className="form-label fw-bold">1. Selecciona el día</label>
                                <input 
                                    type="date" 
                                    className="form-control form-control-lg bg-light"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.fecha}
                                    onChange={e => setFormData({...formData, fecha: e.target.value})}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold">2. Horarios disponibles con {formData.medico_nombre}</label>
                                
                                {!formData.fecha && <div className="alert alert-secondary small">Por favor, selecciona una fecha en el calendario.</div>}
                                
                                {loading && <div className="text-center py-3"><div className="spinner-border text-primary spinner-border-sm"></div> Buscando disponibilidad...</div>}
                                
                                {formData.fecha && !loading && (
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {slots.length > 0 ? slots.map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                className={`btn ${formData.hora === time ? 'btn-primary shadow' : 'btn-outline-primary'}`}
                                                onClick={() => setFormData({...formData, hora: time})}
                                                style={{ width: '85px', borderRadius: '10px' }}
                                            >
                                                {time.slice(0,5)}
                                            </button>
                                        )) : (
                                            <div className="alert alert-warning w-100 small">
                                                El especialista no tiene disponibilidad en esta fecha. Intenta con otro día.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="text-end mt-4">
                                <button 
                                    className="btn btn-primary px-4 rounded-pill" 
                                    disabled={!formData.hora}
                                    onClick={() => setStep(3)}
                                >
                                    Siguiente Paso
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- PASO 3: CONFIRMAR --- */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="animation-fade-in">
                            <button type="button" className="btn btn-sm btn-link text-muted mb-3 px-0" onClick={() => setStep(2)}>
                                <FaArrowLeft /> Volver al calendario
                            </button>

                            <div className="bg-light p-4 rounded-3 mb-4 text-center border">
                                <h5 className="fw-bold text-primary mb-3">Resumen de tu cita</h5>
                                <p className="mb-1"><strong>Especialista:</strong> {formData.medico_nombre}</p>
                                <p className="mb-1"><strong>Fecha:</strong> {formData.fecha}</p>
                                <p className="mb-0"><strong>Hora:</strong> {formData.hora} hrs</p>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold">¿Cuál es el motivo de tu visita? (Opcional)</label>
                                <textarea 
                                    className="form-control bg-light" 
                                    rows="3" 
                                    placeholder="Ej: Revisión anual, dolor pélvico, seguimiento de embarazo..."
                                    value={formData.motivo} 
                                    onChange={e => setFormData({...formData, motivo: e.target.value})}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold fs-5" disabled={loading}>
                                {loading ? "Procesando..." : "Confirmar Cita"}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AgendarCita;