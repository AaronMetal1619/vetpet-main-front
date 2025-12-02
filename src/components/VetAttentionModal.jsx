import React, { useState } from 'react';
import axios from 'axios';
import { FaNotesMedical, FaCheckCircle, FaHistory, FaTimes } from 'react-icons/fa';

const VetAttentionModal = ({ cita, onClose, onRefresh }) => {
    const [showForm, setShowForm] = useState(false); 
    const [showHistory, setShowHistory] = useState(false); // ESTADO NUEVO
    const [formData, setFormData] = useState({ diagnosis: '', treatment: '' });
    const [saving, setSaving] = useState(false);

    const mascota = cita.pet;
    // Accedemos al historial que nos manda el backend (o array vacío si no hay)
    const historial = mascota.medical_history || [];

    // Funciones para alternar vistas
    const openForm = () => { setShowForm(true); setShowHistory(false); };
    const openHistory = () => { setShowHistory(true); setShowForm(false); };

    const handleFinalizar = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `https://vetpet-back.onrender.com/api/appointments/${cita.id}/complete`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("¡Cita finalizada y guardada en historial!");
            onRefresh();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Error al finalizar la cita.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050, display: 'flex', 
            justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)'
        }}>
            <div className="bg-white rounded shadow-lg d-flex overflow-hidden" 
                 style={{ width: '90%', maxWidth: '1000px', maxHeight: '85vh' }}>
                
                {/* === COLUMNA IZQUIERDA: CARDEX === */}
                <div className="p-4 overflow-auto" style={{ flex: 1, borderRight: '1px solid #eee' }}>
                    <div className="text-center mb-3">
                        <img 
                            src={mascota.photo_url || "https://via.placeholder.com/150?text=Pet"} 
                            alt={mascota.name} 
                            className="rounded shadow-sm"
                            style={{ width: '100%', maxWidth: '250px', height: '200px', objectFit: 'cover' }}
                        />
                        <h2 className="fw-bold mt-2 mb-0">{mascota.name}</h2>
                        <span className="badge bg-secondary">{mascota.breed} - {mascota.age} años</span>
                    </div>

                    <div className="card bg-light border-0 mb-3">
                        <div className="card-body small">
                            <p className="mb-1"><strong>Dueño:</strong> {mascota.user?.name}</p>
                            <p className="mb-1 text-danger"><strong>Alergias:</strong> {mascota.allergies || 'Ninguna'}</p>
                            <p className="mb-1 text-warning"><strong>Enf. Crónicas:</strong> {mascota.chronic_diseases || 'Ninguna'}</p>
                            <p className="mb-0"><strong>Cirugías:</strong> {mascota.surgeries || 'Ninguna'}</p>
                        </div>
                    </div>

                    <div className="d-grid gap-2">
                        {/* Botón Historial ACTIVO */}
                        <button 
                            className={`btn ${showHistory ? 'btn-info text-white' : 'btn-outline-info'}`} 
                            onClick={openHistory}
                        >
                            <FaHistory className="me-2"/> Ver Historial Pasado
                        </button>

                        <button 
                            className={`btn ${showForm ? 'btn-primary' : 'btn-outline-primary'} mt-2`}
                            onClick={openForm}
                        >
                            Atender Paciente <FaNotesMedical className="ms-2"/>
                        </button>
                    </div>
                </div>

                {/* === COLUMNA DERECHA: CONTENIDO DINÁMICO === */}
                
                {/* 1. VISTA DE FORMULARIO (ATENDER) */}
                {showForm && (
                    <div className="p-4 bg-light d-flex flex-column" style={{ flex: 1.2, animation: 'fadeIn 0.3s' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold text-primary mb-0">Nueva Consulta</h4>
                            <button className="btn-close" onClick={() => setShowForm(false)}></button>
                        </div>
                        <form onSubmit={handleFinalizar} className="d-flex flex-column flex-grow-1">
                            {/* ... (Tus inputs de diagnóstico y tratamiento siguen igual) ... */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Diagnóstico</label>
                                <textarea className="form-control" rows="3" required
                                    value={formData.diagnosis}
                                    onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="mb-3 flex-grow-1 d-flex flex-column">
                                <label className="form-label fw-bold">Tratamiento</label>
                                <textarea className="form-control flex-grow-1" style={{ resize: 'none' }} required
                                    value={formData.treatment}
                                    onChange={e => setFormData({...formData, treatment: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn btn-success px-4" disabled={saving}>
                                    {saving ? 'Guardando...' : <>Finalizar <FaCheckCircle className="ms-2"/></>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* 2. VISTA DE HISTORIAL (VER PASADO) */}
                {showHistory && (
                    <div className="p-4 bg-white d-flex flex-column" style={{ flex: 1.2, animation: 'fadeIn 0.3s', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                            <h4 className="fw-bold text-info mb-0">Historial Médico</h4>
                            <button className="btn-close" onClick={() => setShowHistory(false)}></button>
                        </div>

                        {historial.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {historial.map((record) => (
                                    <div key={record.id} className="card border-0 shadow-sm bg-light">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between text-muted small mb-2">
                                                <span><i className="bi bi-calendar me-1"></i> {record.visit_date}</span>
                                                <span className="fw-bold">{record.clinic_name}</span>
                                            </div>
                                            <h6 className="fw-bold text-primary mb-1">Diagnóstico:</h6>
                                            <p className="mb-2">{record.diagnosis}</p>
                                            
                                            {record.treatment && (
                                                <>
                                                    <h6 className="fw-bold text-success mb-1">Tratamiento:</h6>
                                                    <p className="mb-0 small text-muted fst-italic">{record.treatment}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted mt-5">
                                <FaHistory size={40} className="mb-3 opacity-25"/>
                                <p>No hay registros médicos anteriores.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. VISTA VACÍA (PLACEHOLDER) */}
                {!showForm && !showHistory && (
                    <div className="d-none d-md-flex align-items-center justify-content-center bg-white" style={{ flex: 1.2 }}>
                        <div className="text-center text-muted p-5">
                            <FaNotesMedical size={50} className="mb-3 text-secondary opacity-50"/>
                            <h5>Selecciona una opción</h5>
                            <p>Puedes ver el <strong>Historial</strong> o comenzar a <strong>Atender</strong> al paciente.</p>
                            <button className="btn btn-secondary mt-3" onClick={onClose}>Cerrar Ventana</button>
                        </div>
                    </div>
                )}
            </div>
             <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </div>
    );
};

export default VetAttentionModal;