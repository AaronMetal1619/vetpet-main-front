import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppointmentsIndex = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://vetpet-back.onrender.com/api/citas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCitas(response.data);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("¿Borrar esta cita?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://vetpet-back.onrender.com/api/citas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchCitas();
            } catch (error) { alert("Error al borrar"); }
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-muted">Agenda de Citas</h4>
                <button className="btn btn-primary" onClick={() => navigate('/create-appointment')}>
                    <i className="bi bi-plus-circle me-2"></i> Agendar Cita
                </button>
            </div>

            {loading ? (
                <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>
            ) : citas.length === 0 ? (
                <div className="alert alert-info text-center">No hay citas programadas.</div>
            ) : (
                <div className="row g-3">
                    {citas.map(cita => (
                        <div key={cita.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 shadow-sm border-0 border-start border-4 border-info">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h5 className="card-title fw-bold">{cita.nombre}</h5>
                                        <button onClick={() => handleDelete(cita.id)} className="btn btn-sm text-danger p-0 border-0">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    <h6 className="card-subtitle mb-3 text-muted">
                                        <i className="bi bi-clock me-1"></i> {cita.fecha}
                                    </h6>
                                    <p className="card-text bg-light p-2 rounded">
                                        {cita.motivo}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentsIndex;