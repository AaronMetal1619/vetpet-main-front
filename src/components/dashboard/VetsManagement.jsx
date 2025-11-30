import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 📍 Fix para el icono de marcador en React Leaflet
// (A veces no carga la imagen por defecto, esto lo arregla)
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const VetsManagement = () => {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        latitude: '',
        longitude: ''
    });

    useEffect(() => {
        fetchVets();
    }, []);

    // --- Componente interno para detectar clics en el mapa ---
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                // Guardamos coordenadas en el estado
                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng
                }));
            },
        });

        // Si hay coordenadas, mostramos el marcador
        return formData.latitude && formData.longitude ? (
            <Marker position={[formData.latitude, formData.longitude]} icon={icon} />
        ) : null;
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
    };

    const openModal = (vet = null) => {
        if (vet) {
            setIsEditing(true);
            setFormData({ 
                ...vet, 
                password: '',
                // Aseguramos que sean números si existen
                latitude: vet.latitude ? parseFloat(vet.latitude) : '',
                longitude: vet.longitude ? parseFloat(vet.longitude) : ''
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
                <button className="btn btn-success" onClick={() => openModal()}>
                    <i className="bi bi-plus-lg me-2"></i> Nueva
                </button>
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
                                            <span className="text-success"><i className="bi bi-geo-alt-fill"></i> Con Mapa</span>
                                        ) : (
                                            <span className="text-muted">Sin ubicación</span>
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
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
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
                                                    <small className="text-muted">Lat: {formData.latitude ? parseFloat(formData.latitude).toFixed(4) : 'N/A'}</small>
                                                </div>
                                                <div className="col-6">
                                                    <small className="text-muted">Lng: {formData.longitude ? parseFloat(formData.longitude).toFixed(4) : 'N/A'}</small>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna Derecha: Mapa LEAFLET */}
                                        <div className="col-md-6">
                                            <label className="form-label text-primary"><i className="bi bi-pin-map-fill"></i> Toca en el mapa para ubicar</label>
                                            
                                            <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                                
                                                <MapContainer 
                                                    center={formData.latitude ? [formData.latitude, formData.longitude] : [19.4326, -99.1332]} // CDMX por defecto
                                                    zoom={13} 
                                                    style={{ height: '100%', width: '100%' }}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    <LocationMarker />
                                                </MapContainer>

                                            </div>
                                            <small className="text-muted d-block mt-1">Usa el zoom para mayor precisión.</small>
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