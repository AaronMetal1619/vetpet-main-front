import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserInjured, FaNotesMedical, FaCheckSquare, FaClock, FaCalendarAlt, FaSave } from 'react-icons/fa';

const MedicoDashboard = () => {
    const [activeTab, setActiveTab] = useState('citas'); // Pestañas: 'citas' o 'horarios'
    
    // --- ESTADOS PARA CITAS ---
    const [citas, setCitas] = useState([]);
    const [loadingCitas, setLoadingCitas] = useState(true);
    const [citaAtendiendo, setCitaAtendiendo] = useState(null);
    const [notas, setNotas] = useState('');
    const [fechaFiltro, setFechaFiltro] = useState(new Date().toISOString().split('T')[0]);
    
    // --- ESTADOS PARA HORARIOS ---
    const [horarios, setHorarios] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [guardandoHorarios, setGuardandoHorarios] = useState(false);

    const token = localStorage.getItem('token');
    const storedUserStr = localStorage.getItem('user');
    const user = storedUserStr && storedUserStr !== 'undefined' ? JSON.parse(storedUserStr) : null;
    const userId = user?.id_usuario || user?.ID_USUARIO;

    // ==========================================
    // LÓGICA DE CITAS
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

    const handleFinalizarCita = async (e, idCita) => {
        e.preventDefault();
        if (!notas.trim()) return alert("Debes escribir las notas médicas.");
        try {
            await axios.put(`http://127.0.0.1:8000/api/medico/citas/${idCita}/atender`, 
                { notas_medicas: notas }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("¡Cita finalizada con éxito!");
            setCitaAtendiendo(null);
            setNotas('');
            fetchCitas();
        } catch (error) { alert("Error al guardar las notas."); }
    };

    // ==========================================
    // LÓGICA DE HORARIOS
    // ==========================================
    const fetchHorarios = async () => {
        if (!userId) return;
        setLoadingHorarios(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/medico/${userId}/horarios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHorarios(res.data);
        } catch (error) { console.error("Error", error); }
        finally { setLoadingHorarios(false); }
    };

    useEffect(() => {
        if (activeTab === 'horarios') fetchHorarios();
    }, [activeTab]);

    // Actualiza un día en específico
    const handleHorarioChange = (index, field, value) => {
        const nuevosHorarios = [...horarios];
        nuevosHorarios[index][field] = value;
        setHorarios(nuevosHorarios);
    };

    const guardarHorarios = async () => {
        setGuardandoHorarios(true);
        try {
            await axios.put(`http://127.0.0.1:8000/api/medico/${userId}/horarios`, horarios, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("¡Horario actualizado! Tus pacientes ahora verán esta disponibilidad.");
        } catch (error) {
            alert("Hubo un error al guardar tu horario.");
        } finally {
            setGuardandoHorarios(false);
        }
    };

    return (
        <div className="container py-4">
            {/* ENCABEZADO */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-primary mb-0"><FaUserInjured className="me-2"/> Mi Consultorio</h2>
                    <p className="text-muted">Dr. {user?.NOMBRE || user?.nombre || 'Especialista'}</p>
                </div>
            </div>

            {/* PESTAÑAS */}
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

            {/* CONTENIDO DE LAS PESTAÑAS */}
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
                                            {/* ... CÓDIGO DE LAS TARJETAS (Idéntico al que ya tenías) ... */}
                                            <div className={`card h-100 shadow-sm border-0 bg-light rounded-4 ${cita.estado === 'FINALIZADA' ? 'opacity-75' : ''}`}>
                                                <div className="card-body p-4 border-start border-4 border-primary rounded-start">
                                                    <span className={`badge ${cita.estado === 'FINALIZADA' ? 'bg-secondary' : 'bg-success'} mb-2`}>{cita.estado}</span>
                                                    <h5 className="fw-bold mb-1">{cita.paciente}</h5>
                                                    <p className="text-muted small mb-3"><FaCheckSquare className="me-1"/> {cita.fecha_formateada} - {cita.hora} hrs</p>
                                                    <div className="bg-white border rounded p-3 mb-3 small">
                                                        <strong>Motivo de consulta:</strong> <br/>
                                                        <span className="text-muted fst-italic">{cita.motivo || 'No especificado'}</span>
                                                    </div>
                                                    {cita.estado === 'FINALIZADA' ? (
                                                        <div className="alert alert-secondary small mb-0"><strong><FaNotesMedical className="me-1"/> Notas Médicas:</strong> <br/>{cita.notas_medicas}</div>
                                                    ) : (
                                                        citaAtendiendo === cita.id_cita ? (
                                                            <form onSubmit={(e) => handleFinalizarCita(e, cita.id_cita)}>
                                                                <label className="fw-bold small text-primary mb-2"><FaNotesMedical /> Redactar Diagnóstico</label>
                                                                <textarea className="form-control mb-3" rows="3" required autoFocus value={notas} onChange={(e) => setNotas(e.target.value)}></textarea>
                                                                <div className="d-flex gap-2">
                                                                    <button type="submit" className="btn btn-primary btn-sm flex-grow-1">Guardar y Finalizar</button>
                                                                    <button type="button" className="btn btn-light btn-sm" onClick={() => {setCitaAtendiendo(null); setNotas('');}}>Cancelar</button>
                                                                </div>
                                                            </form>
                                                        ) : ( <button className="btn btn-primary w-100" onClick={() => { setCitaAtendiendo(cita.id_cita); setNotas(''); }}>Atender Paciente</button> )
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
                        loadingHorarios ? ( <div className="text-center py-5"><div className="spinner-border text-primary"></div></div> ) : (
                            <div className="animation-fade-in">
                                <div className="alert alert-primary border-0 bg-primary bg-opacity-10 d-flex align-items-center">
                                    <FaClock className="fs-3 text-primary me-3"/>
                                    <div>
                                        <h6 className="fw-bold mb-1 text-primary">Define tu jornada laboral</h6>
                                        <p className="small mb-0 text-muted">Los pacientes solo podrán agendar en los días que marques como activos y dentro de los bloques de tiempo que establezcas aquí.</p>
                                    </div>
                                </div>

                                <div className="table-responsive mt-4">
                                    <table className="table table-hover align-middle">
                                        <thead className="table-light text-muted small text-uppercase">
                                            <tr>
                                                <th>Día</th>
                                                <th>¿Trabajas?</th>
                                                <th>Hora Inicio</th>
                                                <th>Hora Fin</th>
                                                <th>Duración Consulta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {horarios.map((dia, index) => (
                                                <tr key={dia.dia_semana} className={!dia.activo ? 'opacity-50 bg-light' : ''}>
                                                    <td className="fw-bold text-primary">{dia.nombre_dia}</td>
                                                    <td>
                                                        <div className="form-check form-switch fs-5">
                                                            <input className="form-check-input" type="checkbox" checked={dia.activo} onChange={(e) => handleHorarioChange(index, 'activo', e.target.checked)} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input type="time" className="form-control form-control-sm" disabled={!dia.activo} value={dia.hora_inicio} onChange={(e) => handleHorarioChange(index, 'hora_inicio', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <input type="time" className="form-control form-control-sm" disabled={!dia.activo} value={dia.hora_fin} onChange={(e) => handleHorarioChange(index, 'hora_fin', e.target.value)} />
                                                    </td>
                                                    <td>
                                                        <select className="form-select form-select-sm" disabled={!dia.activo} value={dia.duracion_cita} onChange={(e) => handleHorarioChange(index, 'duracion_cita', Number(e.target.value))}>
                                                            <option value={30}>30 Minutos</option>
                                                            <option value={45}>45 Minutos</option>
                                                            <option value={60}>1 Hora</option>
                                                            <option value={90}>1.5 Horas</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-end mt-4 pt-3 border-top">
                                    <button className="btn btn-primary px-5 py-2 fw-bold shadow-sm" onClick={guardarHorarios} disabled={guardandoHorarios}>
                                        {guardandoHorarios ? 'Guardando...' : <><FaSave className="me-2"/> Guardar Configuración</>}
                                    </button>
                                </div>
                            </div>
                        )
                    )}

                </div>
            </div>
        </div>
    );
};

export default MedicoDashboard;