import React, { useState } from 'react';
import axios from 'axios';
import { FaNotesMedical, FaCheckCircle, FaHistory } from 'react-icons/fa';

const VetAttentionModal = ({ cita, onClose, onRefresh }) => {
    const [showForm, setShowForm] = useState(false); // Controla si se ve el formulario derecho
    const [showHistory, setShowHistory] = useState(false); // Controla si vemos el historial
    const [formData, setFormData] = useState({ diagnosis: '', treatment: '' });
    const [saving, setSaving] = useState(false);

    const mascota = cita.pet;

    // Manejar el envío del formulario (PASO 3: FINALIZAR)
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
            onRefresh(); // Recarga la lista de citas atrás
            onClose();   // Cierra el modal
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
                
                {/* === COLUMNA IZQUIERDA: CARDEX DE LA MASCOTA === */}
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

                    {/* Botones de Acción */}
                    <div className="d-grid gap-2">
                        {/* Botón Historial: Podrías reutilizar tu lógica de historial aquí */}
                        <button className="btn btn-outline-info" onClick={() => alert("Aquí abrirías el historial como en el perfil")}>
                            <FaHistory className="me-2"/> Ver Historial Pasado
                        </button>

                        {!showForm && (
                            <button 
                                className="btn btn-primary btn-lg mt-2"
                                onClick={() => setShowForm(true)}
                            >
                                Atender Paciente <FaNotesMedical className="ms-2"/>
                            </button>
                        )}
                    </div>
                </div>

                {/* === COLUMNA DERECHA: FORMULARIO DE ATENCIÓN (Aparece al dar click en Atender) === */}
                {showForm && (
                    <div className="p-4 bg-light d-flex flex-column" style={{ flex: 1.2, animation: 'fadeIn 0.3s' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold text-primary mb-0">Receta o Procedimiento</h4>
                            <button className="btn-close" onClick={() => setShowForm(false)}></button>
                        </div>
                        
                        <form onSubmit={handleFinalizar} className="d-flex flex-column flex-grow-1">
                            <div className="mb-3">
                                <label className="form-label fw-bold">Diagnóstico / Observaciones</label>
                                <textarea 
                                    className="form-control" 
                                    rows="3" 
                                    placeholder="¿Qué tiene el paciente?"
                                    value={formData.diagnosis}
                                    onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3 flex-grow-1 d-flex flex-column">
                                <label className="form-label fw-bold">Tratamiento / Receta</label>
                                <textarea 
                                    className="form-control flex-grow-1" 
                                    placeholder="Medicamentos, dosis y recomendaciones..."
                                    style={{ resize: 'none' }}
                                    value={formData.treatment}
                                    onChange={e => setFormData({...formData, treatment: e.target.value})}
                                    required
                                ></textarea>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                                <button type="submit" className="btn btn-success px-4" disabled={saving}>
                                    {saving ? 'Guardando...' : (
                                        <>Finalizar Consulta <FaCheckCircle className="ms-2"/></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Si NO estamos atendiendo, mostrar un placeholder o cerrar */}
                {!showForm && (
                    <div className="d-none d-md-flex align-items-center justify-content-center bg-white" style={{ flex: 1.2 }}>
                        <div className="text-center text-muted p-5">
                            <FaNotesMedical size={50} className="mb-3 text-secondary opacity-50"/>
                            <h5>Listo para consultar</h5>
                            <p>Revisa los datos del paciente a la izquierda y presiona <strong>"Atender"</strong> para comenzar el registro clínico.</p>
                            <button className="btn btn-secondary mt-3" onClick={onClose}>Cerrar Ventana</button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Estilo simple para la animación */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default VetAttentionModal;