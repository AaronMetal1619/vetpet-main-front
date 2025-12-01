import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono de Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const VetFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Si venimos de "Editar", recibimos los datos por el estado de la navegación
    const vetToEdit = location.state?.vet || null;
    const isEditing = !!vetToEdit;

    const [formData, setFormData] = useState({
        id: vetToEdit?.id || '',
        name: vetToEdit?.name || '',
        email: vetToEdit?.email || '',
        password: '', // Contraseña siempre vacía por seguridad
        phone: vetToEdit?.phone || '',
        address: vetToEdit?.address || '',
        latitude: vetToEdit?.latitude ? parseFloat(vetToEdit.latitude) : '',
        longitude: vetToEdit?.longitude ? parseFloat(vetToEdit.longitude) : ''
    });

    // Componente del Marcador
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
            },
        });
        return formData.latitude && formData.longitude ? (
            <Marker position={[formData.latitude, formData.longitude]} icon={icon} />
        ) : null;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                await axios.put(`https://vetpet-back.onrender.com/api/users/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Veterinaria actualizada correctamente.");
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
            // Redirigir al dashboard después de guardar
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.response?.data?.message || 'Error de conexión'}`);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0">{isEditing ? 'Editar Veterinaria' : 'Registrar Nueva Veterinaria'}</h4>
                    <button className="btn btn-light btn-sm" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-arrow-left"></i> Volver
                    </button>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Columna Izquierda: Datos */}
                            <div className="col-lg-6 mb-4">
                                <h5 className="text-muted mb-3">Información General</h5>
                                
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Clínica</label>
                                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico (Acceso)</label>
                                    <input className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}</label>
                                    <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Dirección (Texto)</label>
                                        <input className="form-control" name="address" value={formData.address} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Mapa */}
                            <div className="col-lg-6">
                                <h5 className="text-muted mb-3">Ubicación en Mapa</h5>
                                <div className="alert alert-info py-2 small">
                                    <i className="bi bi-info-circle me-2"></i> 
                                    Haz clic en el mapa para establecer la ubicación exacta.
                                </div>
                                
                                <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #eee' }}>
                                    <MapContainer 
                                        center={formData.latitude ? [formData.latitude, formData.longitude] : [19.4326, -99.1332]} 
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
                                <div className="d-flex justify-content-between mt-2 text-muted small">
                                    <span>Lat: {formData.latitude ? parseFloat(formData.latitude).toFixed(6) : '---'}</span>
                                    <span>Lng: {formData.longitude ? parseFloat(formData.longitude).toFixed(6) : '---'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-grid gap-2 mt-4">
                            <button type="submit" className="btn btn-success btn-lg">
                                <i className="bi bi-save me-2"></i>
                                {isEditing ? 'Guardar Cambios' : 'Registrar Veterinaria'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VetFormPage;