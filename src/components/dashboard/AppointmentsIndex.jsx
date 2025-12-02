import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Importamos componentes de Bootstrap o iconos si los usas
import { FaCalendarAlt, FaClock, FaEye, FaPaw } from 'react-icons/fa';

const AppointmentsIndex = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // ESTADO PARA EL PASO 2 (VISUALIZAR/ATENDER)
    // Cuando el usuario haga click en "Visualizar", guardaremos la cita aquí para abrir el modal
    const [selectedCita, setSelectedCita] = useState(null); 

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Usamos el NUEVO endpoint
            const response = await axios.get('https://vetpet-back.onrender.com/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCitas(response.data);
        } catch (error) {
            console.error("Error cargando agenda:", error);
        } finally {
            setLoading(false);
        }
    };

    // Función para formatear la fecha a algo más legible (ej: Lunes 20 de marzo)
    const formatearFecha = (fechaStr) => {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
    };

    // Esta función activa el PASO 2 (Abrir Modal)
    const handleVisualizar = (cita) => {
        console.log("Abriendo cita para:", cita.pet.name);
        setSelectedCita(cita); 
        // Aquí luego pondremos la lógica para abrir tu Modal de Atender
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="fw-bold mb-4 text-secondary">AGENDA DE CITAS</h2>

            {/* BARRA DE ESTADO (OPCIONAL) */}
            <div className="alert alert-info py-2 mb-4 d-flex align-items-center">
                <i className="bi bi-info-circle me-2"></i>
                <span>Tienes <strong>{citas.length}</strong> citas programadas para atender.</span>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                    <p className="mt-2 text-muted">Cargando agenda...</p>
                </div>
            ) : citas.length === 0 ? (
                <div className="text-center p-5 bg-light rounded shadow-sm">
                    <h4>No hay citas programadas</h4>
                    <p className="text-muted">Tu agenda está libre por ahora.</p>
                </div>
            ) : (
                <div className="row g-4">
                    {citas.map((cita) => (
                        <div key={cita.id} className="col-md-6 col-xl-4">
                            {/* --- TARJETA DISEÑO NUEVO --- */}
                            <div className="card shadow border-0 overflow-hidden h-100">
                                
                                {/* HEADER AZUL: CLIENTE */}
                                <div className="card-header bg-primary text-white py-3">
                                    <h5 className="mb-0 fw-bold text-truncate">
                                        Cita cliente {cita.pet?.user?.name || "Desconocido"}
                                    </h5>
                                </div>

                                <div className="card-body bg-light">
                                    {/* FECHA Y HORA DESTACADAS */}
                                    <div className="mb-3">
                                        <h5 className="fw-bold text-dark mb-1 text-capitalize">
                                            {formatearFecha(cita.date)}
                                        </h5>
                                        <h5 className="text-secondary">
                                            a las {cita.time} hrs
                                        </h5>
                                    </div>

                                    {/* INFO MASCOTA */}
                                    <div className="d-flex align-items-center mb-3 bg-white p-2 rounded border">
                                        <div className="me-3">
                                            {/* Foto miniatura si existe */}
                                            {cita.pet?.photo_url ? (
                                                <img src={cita.pet.photo_url} alt="Pet" className="rounded-circle" style={{width: '50px', height: '50px', objectFit: 'cover'}} />
                                            ) : (
                                                <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center" style={{width: '50px', height: '50px'}}>
                                                    <FaPaw />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-primary">{cita.pet?.name}</h6>
                                            <small className="text-muted">{cita.pet?.breed} - {cita.pet?.age} años</small>
                                        </div>
                                    </div>

                                    {/* MOTIVO */}
                                    <p className="text-muted small mb-0">
                                        <strong>Motivo:</strong> {cita.reason}
                                    </p>
                                </div>

                                {/* FOOTER: BOTÓN VISUALIZAR */}
                                <div className="card-footer bg-light border-0 pb-3 pt-0">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="text-muted small">¿Visualizar?</span>
                                        <button 
                                            className="btn btn-dark px-4"
                                            onClick={() => handleVisualizar(cita)}
                                        >
                                            Visualizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE ATENCIÓN VETERINARIA */}
                {selectedCita && (
                <VetAttentionModal 
                    cita={selectedCita} 
                    onClose={() => setSelectedCita(null)} 
                    onRefresh={fetchCitas} // Esto recarga la lista cuando finalizas una cita
                />
                )}
        </div>
    );
};

export default AppointmentsIndex;