import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VetsManagement = () => {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Referencia para el mapa
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        latitude: '',  // Nuevo
        longitude: ''  // Nuevo
    });

    useEffect(() => {
        fetchVets();
    }, []);

    // Inicializar mapa cuando se abre el modal
    useEffect(() => {
        if (showModal && window.google) {
            // Pequeño delay para asegurar que el modal se renderizó
            setTimeout(() => initMap(), 300);
        }
    }, [showModal]);

    const initMap = () => {
        const mapElement = document.getElementById('vet-map');
        if (!mapElement) return;

        // Ubicación inicial (Ej: CDMX o la ubicación actual de la vet si estamos editando)
        const initialPos = (formData.latitude && formData.longitude) 
            ? { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) }
            : { lat: 19.4326, lng: -99.1332 }; // Default (CDMX) - Cámbialo a tu ciudad

        const map = new window.google.maps.Map(mapElement, {
            center: initialPos,
            zoom: 13,
            streetViewControl: false,
            mapTypeControl: false
        });

        // Crear marcador si ya hay coordenadas
        if (formData.latitude && formData.longitude) {
            placeMarker(initialPos, map);
        }

        // Evento Click en el mapa
        map.addListener("click", (e) => {
            const clickedPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
            };
            placeMarker(clickedPos, map);
            
            // Actualizar estado
            setFormData(prev => ({
                ...prev,
                latitude: clickedPos.lat,
                longitude: clickedPos.lng
            }));
        });

        mapRef.current = map;
    };

    const placeMarker = (location, map) => {
        // Si ya existe marcador, lo movemos
        if (markerRef.current) {
            markerRef.current.setPosition(location);
        } else {
            // Si no, creamos uno nuevo
            markerRef.current = new window.google.maps.Marker({
                position: location,
                map: map,
                animation: window.google.maps.Animation.DROP
            });
        }
    };

    const fetchVets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://vetpet-back.onrender.com/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const soloVets = response.data.filter(u => u.role === 'partner' && u.partner_type === 'veterinaria');
            setVets(soloVets);
        } catch (error) {
            console.error("Error al cargar:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', email: '', password: '', phone: '', address: '', latitude: '', longitude: '' });
        setIsEditing(false);
        if (markerRef.current) markerRef.current.setMap(null); // Limpiar marcador
        markerRef.current = null;
    };

    const openModal = (vet = null) => {
        if (vet) {
            setIsEditing(true);
            setFormData({ 
                ...vet, 
                password: '',
                latitude: vet.latitude || '',
                longitude: vet.longitude || ''
            }); 
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                await axios.put(`https://vetpet-back.onrender.com/api/users/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Actualizado correctamente.");
            } else {
                const payload = {
                    ...formData,
                    role: 'partner',
                    partner_type: 'veterinaria'
                };
                await axios.post('https://vetpet-back.onrender.com/api/admin/users', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Veterinaria creada exitosamente.");
            }
            fetchVets(); 
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.response?.data?.message || 'Error de conexión'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://vetpet-back.onrender.com/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Eliminado.");
                fetchVets();
            } catch (error) { alert("Error al eliminar."); }
        }
    };

    const filteredVets = vets.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="m-0 fw-bold">Veterinarias</h5>
                <button className="btn btn-success" onClick={() => openModal()}><i className="bi bi-plus-lg me-2"></i> Nueva</button>
            </div>
            <div className="card-body">
                <input type="text" className="form-control mb-3" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light"><tr><th>Nombre</th><th>Ubicación</th><th>Acciones</th></tr></thead>
                        <tbody>
                            {filteredVets.map(v => (
                                <tr key={v.id}>
                                    <td>
                                        <div className="fw-bold">{v.name}</div>
                                        <small className="text-muted">{v.email}</small>
                                    </td>
                                    <td>
                                        {v.latitude ? (
                                            <span className="text-success"><i className="bi bi-geo-alt-fill"></i> Ubicada</span>
                                        ) : (
                                            <span className="text-muted">Sin mapa</span>
                                        )}
                                        <div className="small text-muted">{v.address}</div>
                                    </td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(v)}><i className="bi bi-pencil"></i></button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(v.id)}><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered"> {/* Modal más grande (modal-lg) */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar' : 'Nueva'} Veterinaria</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        {/* Columna Izquierda: Datos */}
                                        <div className="col-md-6">
                                            <div className="mb-2">
                                                <label className="form-label">Nombre</label>
                                                <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Email</label>
                                                <input className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Contraseña</label>
                                                <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Dirección (Texto)</label>
                                                <input className="form-control" name="address" value={formData.address} onChange={handleChange} />
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <small className="text-muted">Lat: {formData.latitude || 'N/A'}</small>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted">Lng: {formData.longitude || 'N/A'}</small>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna Derecha: Mapa */}
                                        <div className="col-md-6">
                                            <label className="form-label text-primary"><i className="bi bi-pin-map-fill"></i> Selecciona la ubicación en el mapa</label>
                                            <div 
                                                id="vet-map" 
                                                style={{ width: '100%', height: '300px', borderRadius: '8px', border: '1px solid #ccc' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar Veterinaria</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VetsManagement;