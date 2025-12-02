import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importa tu imagen (ajusta la ruta si es necesario)
// Si no tienes la imagen aún, puedes comentar esta línea y usar un icono por defecto temporalmente
// import iconoVetImg from '../../assets/iconovet.jpeg'; 

// Configuración del icono
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", // Usamos el default si no hay imagen local
  // iconUrl: iconoVetImg, // Descomenta esto cuando tengas tu imagen
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
    
    // Detectar si es edición
    const vetToEdit = location.state?.vet || null;
    const isEditing = !!vetToEdit;

    // Estado inicial
    const [formData, setFormData] = useState({
        id: vetToEdit?.id || '',
        name: vetToEdit?.name || '',
        email: vetToEdit?.email || '',
        password: '', // Contraseña vacía por seguridad
        phone: vetToEdit?.phone || '',
        address: vetToEdit?.address || '',
        latitude: vetToEdit?.latitude ? parseFloat(vetToEdit.latitude) : '',
        longitude: vetToEdit?.longitude ? parseFloat(vetToEdit.longitude) : ''
    });

    // Componente interno para capturar clics en el mapa
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
            },
        });

        // Solo mostramos el marcador si hay coordenadas válidas
        return (formData.latitude && formData.longitude) ? (
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
                // EDITAR
                await axios.put(`https://vetpet-back.onrender.com/api/users/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Veterinaria actualizada correctamente.");
            } else {
                // CREAR NUEVA
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
            // Regresar al listado
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error de conexión con el servidor';
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0">
                {/* Header */}
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0">{isEditing ? 'Editar Veterinaria' : 'Registrar Nueva Veterinaria'}</h4>
                    <button className="btn btn-light btn-sm" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-arrow-left me-2"></i> Volver
                    </button>
                </div>
                
                {/* Body */}
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Columna Izquierda: Datos del Formulario */}
                            <div className="col-lg-6 mb-4">
                                <h5 className="text-muted mb-3 border-bottom pb-2">Información General</h5>
                                
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Clínica</label>
                                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. VetPet Centro" />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico (Login)</label>
                                    <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="contacto@vet.com" />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">{isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}</label>
                                    <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} placeholder="********" />
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="555-1234" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Dirección (Texto)</label>
                                        <input className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Av. Principal #123" />
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Mapa Interactivo */}
                            <div className="col-lg-6">
                                <h5 className="text-muted mb-3 border-bottom pb-2">Ubicación en Mapa</h5>
                                <div className="alert alert-info py-2 small d-flex align-items-center">
                                    <i className="bi bi-geo-alt-fill me-2 fs-5"></i> 
                                    <span>Haz clic en el mapa para marcar la ubicación exacta de la clínica.</span>
                                </div>
                                
                                <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc', position: 'relative', zIndex: 0 }}>
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
                                
                                <div className="d-flex justify-content-between mt-2 text-muted small bg-light p-2 rounded border">
                                    <span><strong>Latitud:</strong> {formData.latitude ? parseFloat(formData.latitude).toFixed(6) : '---'}</span>
                                    <span><strong>Longitud:</strong> {formData.longitude ? parseFloat(formData.longitude).toFixed(6) : '---'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-grid gap-2 mt-4">
                            <button type="submit" className="btn btn-success btn-lg">
                                <i className="bi bi-check-circle-fill me-2"></i>
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