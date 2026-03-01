import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaCheck, FaTimes, FaStethoscope, FaUserPlus, FaSave } from 'react-icons/fa';

const AdminDashboard = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('citas'); // Controla las pestañas
    const token = localStorage.getItem('token');

    // Estado para el formulario del nuevo médico
    const [nuevoMedico, setNuevoMedico] = useState({
        nombre: '', correo: '', password: '', especialidad: '', cedula: ''
    });
    const [guardandoMedico, setGuardandoMedico] = useState(false);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/admin/citas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCitas(res.data);
        } catch (error) { console.error("Error cargando citas", error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCitas(); }, [token]);

    const cambiarEstado = async (idCita, nuevoEstado) => {
        if (nuevoEstado === 'CANCELADA' && !window.confirm('¿Seguro que deseas cancelar esta cita?')) return;
        try {
            await axios.put(`http://127.0.0.1:8000/api/admin/citas/${idCita}/estado`, 
                { estado: nuevoEstado }, { headers: { Authorization: `Bearer ${token}` } }
            );
            setCitas(citas.map(cita => cita.id_cita === idCita ? { ...cita, estado: nuevoEstado } : cita));
        } catch (error) { alert("Error al actualizar estado"); }
    };

    const handleCrearMedico = async (e) => {
        e.preventDefault();
        setGuardandoMedico(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/admin/medicos', nuevoMedico, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('¡Médico registrado exitosamente con horario base asignado!');
            setNuevoMedico({ nombre: '', correo: '', password: '', especialidad: '', cedula: '' });
            setActiveTab('citas'); // Volver a la tabla
        } catch (error) {
            alert(error.response?.data?.error || "Error al registrar médico. Revisa que el correo no esté duplicado.");
        } finally {
            setGuardandoMedico(false);
        }
    };

    const getBadgeColor = (estado) => {
        switch (estado?.toUpperCase()) {
            case 'PENDIENTE': return 'bg-warning text-dark';
            case 'CONFIRMADA': return 'bg-success';
            case 'CANCELADA': return 'bg-danger';
            case 'FINALIZADA': return 'bg-secondary';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="container-fluid bg-light h-100 p-4" style={{ overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-primary mb-0"><FaCalendarAlt className="me-2"/> Panel Administrativo</h2>
                    <p className="text-muted">Recepción y Gestión Clínica</p>
                </div>
            </div>

            {/* PESTAÑAS (TABS) */}
            <ul className="nav nav-tabs mb-4 border-bottom-0">
                <li className="nav-item">
                    <button className={`nav-link fw-bold ${activeTab === 'citas' ? 'active bg-white border-bottom-0 text-primary' : 'text-muted'}`} onClick={() => setActiveTab('citas')}>
                        <FaCalendarAlt className="me-2"/> Agenda General
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link fw-bold ${activeTab === 'medicos' ? 'active bg-white border-bottom-0 text-primary' : 'text-muted'}`} onClick={() => setActiveTab('medicos')}>
                        <FaUserPlus className="me-2"/> Alta de Especialistas
                    </button>
                </li>
            </ul>

            {/* CONTENIDO DE LAS PESTAÑAS */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden rounded-top-0">
                <div className="card-body p-0">
                    
                    {/* TAB 1: CITAS */}
                    {activeTab === 'citas' && (
                        loading ? ( <div className="text-center py-5"><div className="spinner-border text-primary"></div></div> ) : (
                            <div className="table-responsive p-3">
                                {/* ... Aquí va exactamente la misma tabla que ya tenías en AdminDashboard ... */}
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Fecha y Hora</th><th>Paciente</th><th>Médico</th><th>Motivo</th><th className="text-center">Estado</th><th className="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {citas.map(cita => (
                                            <tr key={cita.id_cita}>
                                                <td><div className="fw-bold">{cita.fecha_formateada}</div><div className="small text-muted">{cita.hora} hrs</div></td>
                                                <td><span className="fw-semibold">{cita.paciente}</span></td>
                                                <td><div className="d-flex align-items-center"><FaStethoscope className="text-primary me-2"/> {cita.medico}</div></td>
                                                <td><span className="text-muted small d-inline-block text-truncate" style={{maxWidth:'150px'}}>{cita.motivo || 'Sin motivo'}</span></td>
                                                <td className="text-center"><span className={`badge ${getBadgeColor(cita.estado)} rounded-pill px-3 py-2`}>{cita.estado}</span></td>
                                                <td className="text-end">
                                                    {cita.estado === 'PENDIENTE' && (
                                                        <div className="btn-group shadow-sm">
                                                            <button className="btn btn-sm btn-success" onClick={() => cambiarEstado(cita.id_cita, 'CONFIRMADA')}><FaCheck /></button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => cambiarEstado(cita.id_cita, 'CANCELADA')}><FaTimes /></button>
                                                        </div>
                                                    )}
                                                    {cita.estado === 'CONFIRMADA' && ( <button className="btn btn-sm btn-outline-secondary" onClick={() => cambiarEstado(cita.id_cita, 'FINALIZADA')}>Finalizar</button> )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {/* TAB 2: ALTA DE MÉDICOS */}
                    {activeTab === 'medicos' && (
                        <div className="p-4 p-md-5 bg-white">
                            <h4 className="fw-bold text-primary mb-4">Registrar Nuevo Especialista</h4>
                            <form onSubmit={handleCrearMedico}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">Nombre Completo (Dr./Dra.)</label>
                                        <input type="text" className="form-control" required value={nuevoMedico.nombre} onChange={e => setNuevoMedico({...nuevoMedico, nombre: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">Especialidad (Ej: Ginecología)</label>
                                        <input type="text" className="form-control" required value={nuevoMedico.especialidad} onChange={e => setNuevoMedico({...nuevoMedico, especialidad: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">Cédula Profesional</label>
                                        <input type="text" className="form-control" required value={nuevoMedico.cedula} onChange={e => setNuevoMedico({...nuevoMedico, cedula: e.target.value})} />
                                    </div>
                                    <div className="col-12"><hr/></div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">Correo Electrónico (Para Iniciar Sesión)</label>
                                        <input type="email" className="form-control" required value={nuevoMedico.correo} onChange={e => setNuevoMedico({...nuevoMedico, correo: e.target.value})} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted">Contraseña Temporal</label>
                                        <input type="password" className="form-control" required minLength="6" value={nuevoMedico.password} onChange={e => setNuevoMedico({...nuevoMedico, password: e.target.value})} />
                                    </div>
                                </div>
                                <div className="mt-4 text-end">
                                    <button type="submit" className="btn btn-primary px-4 py-2" disabled={guardandoMedico}>
                                        {guardandoMedico ? 'Guardando...' : <><FaSave className="me-2"/> Registrar Especialista</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;