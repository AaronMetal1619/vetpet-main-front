import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BrowserRouter, useNavigate } from 'react-router-dom';

// ⚠️ AJUSTA ESTA URL A TU URL REAL DE RENDER
const API_BASE_URL = 'https://vetpet-sandbox-1.onrender.com/api';

const MascotaManagementContent = () => {
    const [mascota, setMascota] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Estado del Formulario
    const [formData, setFormData] = useState({
        nombre: '', especie: '', raza: '', genero: 'Macho',
        edad: '', color: '', peso: '', alergias: false,
        detalle_alergias: '', historial_medico: '', veterinario_encargado: ''
    });

    // Referencia para el archivo de la foto
    const [fotoFile, setFotoFile] = useState(null);
    const navigate = useNavigate();

    // Función para obtener el token de autenticación
    const getToken = () => localStorage.getItem('token');

    // --------------------------------------------------------
    // FUNCIÓN 1: OBTENER MASCOTA (GET /api/mascotas)
    // --------------------------------------------------------
    const fetchMascotas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/mascotas`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            // Si hay mascotas, cargamos la primera para editar
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const fetchedMascota = response.data[0];
                setMascota(fetchedMascota);
                setFormData({
                    ...fetchedMascota,
                    edad: fetchedMascota.edad || '',
                    alergias: !!fetchedMascota.alergias,
                    // Aseguramos que los campos nulos sean strings vacíos
                    color: fetchedMascota.color || '',
                    peso: fetchedMascota.peso || '',
                    detalle_alergias: fetchedMascota.detalle_alergias || '',
                    historial_medico: fetchedMascota.historial_medico || '',
                    veterinario_encargado: fetchedMascota.veterinario_encargado || ''
                });
            } else {
                // Si no hay, preparamos para crear
                setMascota(null);
                setFormData({
                    nombre: '', especie: '', raza: '', genero: 'Macho',
                    edad: '', color: '', peso: '', alergias: false,
                    detalle_alergias: '', historial_medico: '', veterinario_encargado: ''
                });
            }

        } catch (err) {
            console.error("Error al cargar la mascota:", err);
            // Evitamos mostrar error si es solo que no hay datos (404 o vacío esperado)
            if (err.response && err.response.status !== 404) {
                setError('Error al obtener los datos de la mascota.');
            }
            setMascota(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMascotas();
    }, [fetchMascotas]);

    // --------------------------------------------------------
    // MANEJO DE ESTADO DEL FORMULARIO
    // --------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFotoFile(e.target.files[0]);
        }
    };

    // --------------------------------------------------------
    // FUNCIÓN 2: CREAR o ACTUALIZAR MASCOTA (POST/PUT con FormData)
    // --------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setMessage('');

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'alergias') {
                data.append(key, formData[key] ? 1 : 0);
            } else {
                data.append(key, formData[key] || '');
            }
        });

        if (fotoFile) {
            data.append('foto', fotoFile);
        }

        let url = `${API_BASE_URL}/mascotas`;
        let method = 'POST';

        if (mascota?.id) {
            url = `${API_BASE_URL}/mascotas/${mascota.id}`;
            // Truco para Laravel: enviar POST con _method=PUT para soportar archivos
            data.append('_method', 'PUT');
        }

        try {
            await axios({
                method: method,
                url: url,
                data: data,
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                }
            });

            setMessage(`Mascota ${mascota?.id ? 'actualizada' : 'registrada'} con éxito.`);
            await fetchMascotas();
            setFotoFile(null);
            setShowModal(true);

        } catch (err) {
            console.error("Error al guardar:", err.response || err);
            // Aseguramos que el error sea siempre un string
            const errorMsg = err.response?.data?.message;
            const finalError = typeof errorMsg === 'string' ? errorMsg : 'Error al procesar la solicitud.';
            setError(finalError);
        } finally {
            setIsSaving(false);
        }
    };

    // --------------------------------------------------------
    // FUNCIÓN 3: ELIMINAR MASCOTA (DELETE /api/mascotas/{id})
    // --------------------------------------------------------
    const handleDelete = async () => {
        if (!mascota || !window.confirm(`¿Eliminar a ${mascota.nombre}?`)) return;

        setError(null);
        setIsSaving(true);
        try {
            await axios.delete(`${API_BASE_URL}/mascotas/${mascota.id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });

            setMessage(`Mascota eliminada.`);
            setMascota(null);
            setFormData({
                nombre: '', especie: '', raza: '', genero: 'Macho',
                edad: '', color: '', peso: '', alergias: false,
                detalle_alergias: '', historial_medico: '', veterinario_encargado: ''
            });
            setShowModal(true);
        } catch (err) {
            setError('Error al eliminar la mascota.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="container py-5 text-center">Cargando...</div>;

    const isEditMode = !!mascota;

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white py-3">
                            <h2 className="h4 mb-0">
                                <i className="bi bi-paw me-2"></i>
                                {isEditMode ? `Perfil de ${mascota.nombre}` : 'Registrar Mascota'}
                            </h2>
                        </div>

                        <div className="card-body p-4">
                            {error && <div className="alert alert-danger text-center">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6 border-end">
                                        <h5 className="mb-4 text-primary">Datos Generales</h5>

                                        {isEditMode && mascota.foto && (
                                            <div className="text-center mb-4">
                                                <img
                                                    src={`${API_BASE_URL.replace('/api', '')}/storage/${mascota.foto}`}
                                                    alt="Mascota"
                                                    className="rounded-circle shadow-sm object-fit-cover"
                                                    style={{ width: '120px', height: '120px' }}
                                                    onError={(e) => { e.target.src = "https://placehold.co/120x120?text=Pet"; }}
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Foto</label>
                                            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                                        </div>

                                        <div className="mb-3">
                                            <label>Nombre</label>
                                            <input type="text" className="form-control" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
                                        </div>
                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label>Especie</label>
                                                <input type="text" className="form-control" name="especie" value={formData.especie || ''} onChange={handleChange} required />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <label>Raza</label>
                                                <input type="text" className="form-control" name="raza" value={formData.raza || ''} onChange={handleChange} required />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4 mb-3">
                                                <label>Género</label>
                                                <select className="form-select" name="genero" value={formData.genero || 'Macho'} onChange={handleChange}>
                                                    <option value="Macho">Macho</option>
                                                    <option value="Hembra">Hembra</option>
                                                </select>
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label>Edad</label>
                                                <input type="number" className="form-control" name="edad" value={formData.edad || ''} onChange={handleChange} />
                                            </div>
                                            <div className="col-4 mb-3">
                                                <label>Peso</label>
                                                <input type="text" className="form-control" name="peso" value={formData.peso || ''} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <h5 className="mb-4 text-primary">Historial Médico</h5>

                                        <div className="mb-3 form-check">
                                            <input type="checkbox" className="form-check-input" id="alergias" name="alergias" checked={!!formData.alergias} onChange={handleChange} />
                                            <label className="form-check-label" htmlFor="alergias">¿Tiene Alergias?</label>
                                        </div>

                                        <div className="mb-3">
                                            <label>Detalle Alergias</label>
                                            <textarea className="form-control" name="detalle_alergias" value={formData.detalle_alergias || ''} onChange={handleChange} disabled={!formData.alergias} rows="2"></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label>Historial Relevante</label>
                                            <textarea className="form-control" name="historial_medico" value={formData.historial_medico || ''} onChange={handleChange} rows="3"></textarea>
                                        </div>

                                        <div className="mb-3">
                                            <label>Veterinario</label>
                                            <input type="text" className="form-control" name="veterinario_encargado" value={formData.veterinario_encargado || ''} onChange={handleChange} />
                                        </div>

                                        <div className="d-grid gap-2 mt-4">
                                            <button type="submit" className={`btn ${isEditMode ? 'btn-success' : 'btn-primary'}`} disabled={isSaving}>
                                                {isSaving ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Registrar')}
                                            </button>
                                            {isEditMode && (
                                                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isSaving}>Eliminar</button>
                                            )}
                                            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Volver</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center p-4">
                                <h4 className="text-success mb-3">¡Éxito!</h4>
                                <p>{message}</p>
                                <button className="btn btn-success" onClick={() => setShowModal(false)}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Wrapper para proveer el contexto de Router si no existe
const MascotaManagement = () => {
    return (
        <BrowserRouter>
            <MascotaManagementContent />
        </BrowserRouter>
    );
};

export default MascotaManagement;