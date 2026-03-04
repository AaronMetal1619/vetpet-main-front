import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserInjured, FaNotesMedical, FaCheckSquare, FaClock, FaCalendarAlt, FaSave, FaPlus, FaTrash, FaPills, FaHeartbeat, FaHistory, FaFolderOpen } from 'react-icons/fa';

const MedicoDashboard = () => {
    const [activeTab, setActiveTab] = useState('citas'); 
    
    // --- ESTADOS PARA CITAS ---
    const [citas, setCitas] = useState([]);
    const [loadingCitas, setLoadingCitas] = useState(true);
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
    
    // --- ESTADOS PARA EL MODAL DE CONSULTA (NUEVO) ---
    const [showModal, setShowModal] = useState(false);
    const [citaActual, setCitaActual] = useState(null);
    const [guardandoConsulta, setGuardandoConsulta] = useState(false);
    
    // Formulario de Consulta (Signos y Diagnóstico)
    const [formConsulta, setFormConsulta] = useState({
        peso: '', altura: '', temperatura: '', presion_arterial: '',
        sintomas: '', exploracion: '', diagnostico: '', indicaciones: ''
    });

    // Formulario de Receta (Lista dinámica de medicamentos)
    const [medicamentos, setMedicamentos] = useState([]);
    // --- ESTADOS PARA EL HISTORIAL DEL PACIENTE ---
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const [historialPaciente, setHistorialPaciente] = useState([]);
    const [nombrePacienteHistorial, setNombrePacienteHistorial] = useState('');
    const [loadingHistorial, setLoadingHistorial] = useState(false);

    // --- ESTADOS PARA HORARIOS ---
    const [horarios, setHorarios] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [guardandoHorarios, setGuardandoHorarios] = useState(false);

    const token = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user');
    const user = storedUserStr && storedUserStr !== 'undefined' ? JSON.parse(storedUserStr) : null;
    const userId = user?.id_usuario || user?.ID_USUARIO;

    // ==========================================
    // LÓGICA DE CITAS Y CONSULTAS
    // ==========================================
    const fetchCitas = async () => {
        if (!userId) return;
        setLoadingCitas(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/medico/${userId}/citas`, {
                params: { fecha: fechaFiltro },
                headers: { Authorization: `Bearer ${token}` }
            });
            setCitas(res.data);
        } catch (error) { console.error("Error", error); } 
        finally { setLoadingCitas(false); }
    };

    useEffect(() => {
        if (activeTab === 'citas') fetchCitas();
    }, [userId, token, fechaFiltro, activeTab]);

    // ABRIR EL MODAL Y LIMPIAR DATOS
    const abrirModalConsulta = (cita) => {
        setCitaActual(cita);
        setFormConsulta({
            peso: '', altura: '', temperatura: '', presion_arterial: '',
            sintomas: '', exploracion: '', diagnostico: '', indicaciones: ''
        });
        setMedicamentos([]); // Empezamos sin medicamentos
        setShowModal(true);
    };
    const abrirHistorial = async (idPaciente, nombrePaciente) => {
        if (!idPaciente) return alert("Error: No se encontró el ID del paciente.");
        setNombrePacienteHistorial(nombrePaciente);
        setShowHistorialModal(true);
        setLoadingHistorial(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/medico/paciente/${idPaciente}/historial`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistorialPaciente(res.data);
        } catch (error) {
            console.error(error);
            alert("Error al cargar el historial del paciente.");
        } finally {
            setLoadingHistorial(false);
        }
    };

    // MANEJAR MEDICAMENTOS DINÁMICOS
    const agregarMedicamento = () => {
        setMedicamentos([...medicamentos, { medicamento: '', dosis: '', frecuencia: '', duracion: '' }]);
    };

    const quitarMedicamento = (index) => {
        const nuevosMed = [...medicamentos];
        nuevosMed.splice(index, 1);
        setMedicamentos(nuevosMed);
    };

    const handleMedChange = (index, field, value) => {
        const nuevosMed = [...medicamentos];
        nuevosMed[index][field] = value;
        setMedicamentos(nuevosMed);
    };

    // ENVIAR TODO AL BACKEND
    const handleFinalizarConsulta = async (e) => {
        e.preventDefault();
        if (!formConsulta.diagnostico.trim()) return alert("El diagnóstico es obligatorio.");

        setGuardandoConsulta(true);
        try {
            const payload = {
                ...formConsulta,
                medicamentos: medicamentos
            };

            await axios.put(`http://127.0.0.1:8000/api/medico/citas/${citaActual.id_cita}/atender`, 
                payload, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert("¡Expediente guardado y cita finalizada con éxito!");
            setShowModal(false);
            fetchCitas();
        } catch (error) { 
            alert("Error al guardar el expediente."); 
            console.error(error);
        } finally {
            setGuardandoConsulta(false);
        }
    };

    // ==========================================
    // LÓGICA DE HORARIOS (Queda igual)
    // ==========================================
    const fetchHorarios = async () => {
        if (!userId) return;
        setLoadingHorarios(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/medico/${userId}/horarios`, { headers: { Authorization: `Bearer ${token}` } });
            setHorarios(res.data);
        } catch (error) { console.error("Error", error); }
        finally { setLoadingHorarios(false); }
    };

    useEffect(() => { if (activeTab === 'horarios') fetchHorarios(); }, [activeTab]);

    const handleHorarioChange = (index, field, value) => {
        const nuevos = [...horarios];
        nuevos[index][field] = value;
        setHorarios(nuevos);
    };

    const guardarHorarios = async () => {
        setGuardandoHorarios(true);
        try {
            await axios.put(`http://127.0.0.1:8000/api/medico/${userId}/horarios`, horarios, { headers: { Authorization: `Bearer ${token}` } });
            alert("¡Horario actualizado!");
        } catch (error) { alert("Error al guardar tu horario."); } 
        finally { setGuardandoHorarios(false); }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-primary mb-0"><FaUserInjured className="me-2"/> Mi Consultorio</h2>
                    <p className="text-muted">Dr. {user?.NOMBRE || user?.nombre || 'Especialista'}</p>
                </div>
            </div>

            <ul className="nav nav-tabs mb-4 border-bottom-0">
                <li className="nav-item">
                    <button className={`nav-link fw-bold ${activeTab === 'citas' ? 'active bg-white border-bottom-0 text-primary' : 'text-muted'}`} onClick={() => setActiveTab('citas')}>
                        <FaCalendarAlt className="me-2"/> Mis Consultas
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link fw-bold ${activeTab === 'horarios' ? 'active bg-white border-bottom-0 text-primary' : 'text-muted'}`} onClick={() => setActiveTab('horarios')}>
                        <FaClock className="me-2"/> Configurar Horario
                    </button>
                </li>
            </ul>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden rounded-top-0 bg-white">
                <div className="card-body p-4">
                    
                    {/* TAB 1: CITAS */}
                    {activeTab === 'citas' && (
                        <>
                            <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                                <label className="fw-bold text-primary me-3">Buscar por fecha:</label>
                                <input type="date" className="form-control form-control-sm w-auto shadow-sm" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
                                <button className="btn btn-sm btn-outline-primary ms-auto" onClick={fetchCitas}>Actualizar</button>
                            </div>

                            {loadingCitas ? ( <div className="text-center py-5"><div className="spinner-border text-primary"></div></div> ) : (
                                <div className="row g-4">
                                    {citas.length > 0 ? citas.map(cita => (
                                        <div className="col-md-6" key={cita.id_cita}>
                                            <div className={`card h-100 shadow-sm border-0 bg-light rounded-4 ${cita.estado === 'FINALIZADA' ? 'opacity-75' : ''}`}>
                                                <div className="card-body p-4 border-start border-4 border-primary rounded-start">
                                                    <span className={`badge ${cita.estado === 'FINALIZADA' ? 'bg-secondary' : 'bg-success'} mb-2`}>{cita.estado}</span>
                                                    <h5 className="fw-bold mb-1">{cita.paciente}</h5>
                                                    <p className="text-muted small mb-3"><FaCheckSquare className="me-1"/> {cita.fecha_formateada} - {cita.hora} hrs</p>
                                                    <div className="bg-white border rounded p-3 mb-3 small">
                                                        <strong>Motivo del paciente:</strong> <br/>
                                                        <span className="text-muted fst-italic">{cita.motivo || 'No especificado'}</span>
                                                    </div>
                                                    
                                                    {cita.estado === 'FINALIZADA' ? (
                                                        <div className="alert alert-secondary small mb-0"><strong><FaNotesMedical className="me-1"/> Resumen:</strong> <br/>{cita.notas_medicas}</div>
                                                    ) : (
                                                        <div className="d-flex gap-2 mt-3">
                                                            <button className="btn btn-outline-info flex-grow-1 fw-bold" onClick={() => abrirHistorial(cita.id_paciente, cita.paciente)}>
                                                                <FaHistory className="me-2"/> Historial
                                                            </button>
                                                            <button className="btn btn-primary flex-grow-1 fw-bold" onClick={() => abrirModalConsulta(cita)}>
                                                                <FaHeartbeat className="me-2"/> Consulta
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )) : ( <div className="col-12 text-center py-5 text-muted">No tienes citas programadas para este día.</div> )}
                                </div>
                            )}
                        </>
                    )}

                    {/* TAB 2: HORARIOS */}
                    {activeTab === 'horarios' && (
                        /* ... TU CÓDIGO DE HORARIOS SE QUEDA EXACTAMENTE IGUAL ... */
                        <div className="table-responsive mt-4">
                            {loadingHorarios ? ( <div className="text-center py-5"><div className="spinner-border text-primary"></div></div> ) : (
                                <table className="table table-hover align-middle">
                                    <thead className="table-light text-muted small text-uppercase">
                                        <tr><th>Día</th><th>¿Trabajas?</th><th>Hora Inicio</th><th>Hora Fin</th><th>Duración Consulta</th></tr>
                                    </thead>
                                    <tbody>
                                        {horarios.map((dia, index) => (
                                            <tr key={dia.dia_semana} className={!dia.activo ? 'opacity-50 bg-light' : ''}>
                                                <td className="fw-bold text-primary">{dia.nombre_dia}</td>
                                                <td><div className="form-check form-switch fs-5"><input className="form-check-input" type="checkbox" checked={dia.activo} onChange={(e) => handleHorarioChange(index, 'activo', e.target.checked)} /></div></td>
                                                <td><input type="time" className="form-control form-control-sm" disabled={!dia.activo} value={dia.hora_inicio} onChange={(e) => handleHorarioChange(index, 'hora_inicio', e.target.value)} /></td>
                                                <td><input type="time" className="form-control form-control-sm" disabled={!dia.activo} value={dia.hora_fin} onChange={(e) => handleHorarioChange(index, 'hora_fin', e.target.value)} /></td>
                                                <td>
                                                    <select className="form-select form-select-sm" disabled={!dia.activo} value={dia.duracion_cita} onChange={(e) => handleHorarioChange(index, 'duracion_cita', Number(e.target.value))}>
                                                        <option value={30}>30 Minutos</option>
                                                        <option value={45}>45 Minutos</option>
                                                        <option value={60}>1 Hora</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <div className="text-end mt-4 pt-3 border-top"><button className="btn btn-primary px-5 py-2 fw-bold shadow-sm" onClick={guardarHorarios} disabled={guardandoHorarios}>{guardandoHorarios ? 'Guardando...' : <><FaSave className="me-2"/> Guardar Configuración</>}</button></div>
                        </div>
                    )}
                </div>
            </div>

            {/* ========================================================= */}
            {/* MODAL GIGANTE DE CONSULTA Y RECETA                        */}
            {/* ========================================================= */}
            {showModal && citaActual && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content shadow-lg border-0">
                            
                            {/* CABECERA DEL MODAL */}
                            <div className="modal-header bg-primary text-white">
                                <div>
                                    <h5 className="modal-title fw-bold"><FaNotesMedical className="me-2"/> Expediente Clínico</h5>
                                    <small className="opacity-75">Paciente: {citaActual.paciente} | Fecha: {citaActual.fecha_formateada}</small>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body p-4 bg-light">
                                <form id="consultaForm" onSubmit={handleFinalizarConsulta}>
                                    
                                    {/* SECCIÓN 1: SIGNOS VITALES */}
                                    <h6 className="fw-bold text-primary border-bottom pb-2 mb-3"><FaHeartbeat className="me-2"/> Signos Vitales (Opcional)</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-3">
                                            <label className="small fw-bold text-muted">Peso (kg)</label>
                                            <input type="number" step="0.1" className="form-control" value={formConsulta.peso} onChange={e => setFormConsulta({...formConsulta, peso: e.target.value})} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="small fw-bold text-muted">Altura (cm)</label>
                                            <input type="number" step="1" className="form-control" value={formConsulta.altura} onChange={e => setFormConsulta({...formConsulta, altura: e.target.value})} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="small fw-bold text-muted">Temp. (°C)</label>
                                            <input type="number" step="0.1" className="form-control" value={formConsulta.temperatura} onChange={e => setFormConsulta({...formConsulta, temperatura: e.target.value})} />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="small fw-bold text-muted">Presión (Ej: 120/80)</label>
                                            <input type="text" className="form-control" value={formConsulta.presion_arterial} onChange={e => setFormConsulta({...formConsulta, presion_arterial: e.target.value})} />
                                        </div>
                                    </div>

                                    {/* SECCIÓN 2: NOTAS SOAP */}
                                    <h6 className="fw-bold text-primary border-bottom pb-2 mb-3 mt-4"><FaNotesMedical className="me-2"/> Evaluación Médica</h6>
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="small fw-bold text-muted">Síntomas del paciente</label>
                                            <textarea className="form-control" rows="2" value={formConsulta.sintomas} onChange={e => setFormConsulta({...formConsulta, sintomas: e.target.value})}></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small fw-bold text-muted">Exploración Física</label>
                                            <textarea className="form-control" rows="2" value={formConsulta.exploracion} onChange={e => setFormConsulta({...formConsulta, exploracion: e.target.value})}></textarea>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="small fw-bold text-danger">Diagnóstico Definitivo *</label>
                                            <textarea className="form-control border-danger" rows="2" required value={formConsulta.diagnostico} onChange={e => setFormConsulta({...formConsulta, diagnostico: e.target.value})} placeholder="Escribe el diagnóstico médico aquí..."></textarea>
                                        </div>
                                        <div className="col-md-12">
                                            <label className="small fw-bold text-muted">Indicaciones Generales y Cuidados</label>
                                            <textarea className="form-control" rows="2" value={formConsulta.indicaciones} onChange={e => setFormConsulta({...formConsulta, indicaciones: e.target.value})} placeholder="Reposo, dieta, etc..."></textarea>
                                        </div>
                                    </div>

                                    {/* SECCIÓN 3: RECETA MÚLTIPLE */}
                                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 mt-4">
                                        <h6 className="fw-bold text-success mb-0"><FaPills className="me-2"/> Receta Médica</h6>
                                        <button type="button" className="btn btn-sm btn-outline-success fw-bold" onClick={agregarMedicamento}>
                                            <FaPlus className="me-1"/> Añadir Medicamento
                                        </button>
                                    </div>
                                    
                                    {medicamentos.length === 0 ? (
                                        <div className="alert alert-secondary text-center small">No se han recetado medicamentos. Haz clic en "Añadir Medicamento" si es necesario.</div>
                                    ) : (
                                        <div className="table-responsive bg-white rounded shadow-sm border mb-4">
                                            <table className="table table-borderless align-middle mb-0">
                                                <thead className="table-light small text-muted">
                                                    <tr>
                                                        <th>Medicamento / Sustancia</th>
                                                        <th>Dosis</th>
                                                        <th>Frecuencia (Hrs)</th>
                                                        <th>Duración</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {medicamentos.map((med, index) => (
                                                        <tr key={index} className="border-bottom">
                                                            <td><input type="text" className="form-control form-control-sm" required placeholder="Ej. Paracetamol" value={med.medicamento} onChange={e => handleMedChange(index, 'medicamento', e.target.value)} /></td>
                                                            <td><input type="text" className="form-control form-control-sm" required placeholder="Ej. 500 mg" value={med.dosis} onChange={e => handleMedChange(index, 'dosis', e.target.value)} /></td>
                                                            <td>
                                                                <div className="input-group input-group-sm">
                                                                    <span className="input-group-text">Cada</span>
                                                                    <input type="number" className="form-control" required placeholder="8" value={med.frecuencia} onChange={e => handleMedChange(index, 'frecuencia', e.target.value)} />
                                                                    <span className="input-group-text">h</span>
                                                                </div>
                                                            </td>
                                                            <td><input type="text" className="form-control form-control-sm" required placeholder="Ej. 5 días" value={med.duracion} onChange={e => handleMedChange(index, 'duracion', e.target.value)} /></td>
                                                            <td className="text-end">
                                                                <button type="button" className="btn btn-sm btn-danger rounded-circle" onClick={() => quitarMedicamento(index)}><FaTrash/></button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* FOOTER DEL MODAL */}
                            <div className="modal-footer bg-light">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" form="consultaForm" className="btn btn-primary px-4 fw-bold" disabled={guardandoConsulta}>
                                    {guardandoConsulta ? 'Guardando expediente...' : <><FaSave className="me-2"/> Guardar y Finalizar Cita</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
{/* ========================================================= */}
            {/* MODAL DEL HISTORIAL CLÍNICO                               */}
            {/* ========================================================= */}
            {showHistorialModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content shadow-lg border-0">
                            <div className="modal-header bg-info text-dark">
                                <div>
                                    <h5 className="modal-title fw-bold"><FaFolderOpen className="me-2"/> Historial Clínico</h5>
                                    <small>Paciente: <strong>{nombrePacienteHistorial}</strong></small>
                                </div>
                                <button type="button" className="btn-close" onClick={() => setShowHistorialModal(false)}></button>
                            </div>
                            
                            <div className="modal-body p-4 bg-light">
                                {loadingHistorial ? (
                                    <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
                                ) : historialPaciente.length > 0 ? (
                                    <div className="accordion shadow-sm" id="accordionHistorial">
                                        {historialPaciente.map((item, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header">
                                                    <button className={`accordion-button fw-bold ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                                        {item.fecha_formateada} - Atendido por {item.medico}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#accordionHistorial">
                                                    <div className="accordion-body bg-white small">
                                                        <p className="mb-2"><strong>Motivo original:</strong> {item.motivo}</p>
                                                        
                                                        {item.consulta_medica ? (
                                                            <>
                                                                <div className="bg-light p-2 rounded mb-3 border-start border-4 border-info">
                                                                    <strong>Diagnóstico:</strong> <br/> {item.consulta_medica.diagnostico}
                                                                </div>
                                                                
                                                                <h6 className="fw-bold text-success mt-3 mb-2"><FaPills className="me-2"/> Tratamiento Recetado:</h6>
                                                                {item.consulta_medica.medicamentos && item.consulta_medica.medicamentos.length > 0 ? (
                                                                    <ul className="list-group list-group-flush mb-0">
                                                                        {item.consulta_medica.medicamentos.map((med, i) => (
                                                                            <li className="list-group-item px-0 py-1 border-0 text-muted" key={i}>
                                                                                • <strong>{med.medicamento}</strong> ({med.dosis}) - Cada {med.frecuencia} hrs por {med.duracion}.
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <span className="fst-italic text-muted">Sin medicamentos recetados.</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="alert alert-warning py-2 mb-0 mt-2">No hay expediente detallado de esta cita.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <FaFolderOpen className="fs-1 mb-3 opacity-50"/>
                                        <h5>Este paciente no tiene consultas previas finalizadas.</h5>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-white">
                                <button className="btn btn-outline-secondary" onClick={() => setShowHistorialModal(false)}>Cerrar Historial</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicoDashboard;