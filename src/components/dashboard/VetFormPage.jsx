import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'; // Agregamos useMap
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración del icono (Si tienes tu imagen, descomenta la línea de iconoVetImg)
// import iconoVetImg from '../../assets/iconovet.jpeg'; 
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  // iconUrl: iconoVetImg, 
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- COMPONENTE 1: Mover el mapa cuando el usuario escribe coordenadas ---
const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    // Solo movemos el mapa si las coordenadas son números válidos
    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      map.setView([lat, lng], 15); // Zoom 15 para ver más cerca
    }
  }, [lat, lng, map]);
  return null;
};

const VetFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const vetToEdit = location.state?.vet || null;
    const isEditing = !!vetToEdit;

    const [formData, setFormData] = useState({
        id: vetToEdit?.id || '',
        name: vetToEdit?.name || '',
        email: vetToEdit?.email || '',
        password: '',
        phone: vetToEdit?.phone || '',
        address: vetToEdit?.address || '',
        latitude: vetToEdit?.latitude ? parseFloat(vetToEdit.latitude) : '',
        longitude: vetToEdit?.longitude ? parseFloat(vetToEdit.longitude) : ''
    });

    // --- COMPONENTE 2: Detectar clic en el mapa ---
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                // Actualizamos los inputs con los datos del clic (con 6 decimales)
                setFormData(prev => ({ 
                    ...prev, 
                    latitude: parseFloat(lat.toFixed(6)), 
                    longitude: parseFloat(lng.toFixed(6)) 
                }));
            },
        });

        // Mostramos el marcador si hay datos válidos
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        
        return (!isNaN(lat) && !isNaN(lng)) ? (
            <Marker position={[lat, lng]} icon={icon} />
        ) : null;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Validar coordenadas antes de enviar
        if (!formData.latitude || !formData.longitude) {
            alert("Por favor selecciona una ubicación en el mapa o escribe las coordenadas.");
            return;
        }

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
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error de conexión';
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                    <h4 className="mb-0">{isEditing ? 'Editar Veterinaria' : 'Registrar Nueva Veterinaria'}</h4>
                    <button className="btn btn-light btn-sm" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-arrow-left me-2"></i> Volver
                    </button>
                </div>
                
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Columna Izquierda: Datos */}
                            <div className="col-lg-6 mb-4">
                                <h5 className="text-muted mb-3 border-bottom pb-2">Datos Generales</h5>
                                
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Clínica</label>
                                    <input className="form-control" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. VetPet Centro" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email (Login)</label>
                                    <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">{isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}</label>
                                    <input className="form-control" type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="555-1234" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dirección (Texto)</label>
                                    <input className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Calle, Número, Colonia" />
                                </div>
                            </div>

                            {/* Columna Derecha: Mapa y Coordenadas */}
                            <div className="col-lg-6">
                                <h5 className="text-muted mb-3 border-bottom pb-2">Ubicación Geográfica</h5>
                                
                                {/* Inputs Manuales de Coordenadas */}
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-bold">Latitud</label>
                                        <input 
                                            type="number" 
                                            step="any" 
                                            className="form-control" 
                                            name="latitude" 
                                            value={formData.latitude} 
                                            onChange={handleChange} 
                                            placeholder="Ej: 19.4326"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold">Longitud</label>
                                        <input 
                                            type="number" 
                                            step="any" 
                                            className="form-control" 
                                            name="longitude" 
                                            value={formData.longitude} 
                                            onChange={handleChange} 
                                            placeholder="Ej: -99.1332"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <small className="text-muted" style={{fontSize: '0.8rem'}}>
                                            * Puedes escribir las coordenadas manualmente o tocar en el mapa.
                                        </small>
                                    </div>
                                </div>

                                <div style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc', position: 'relative', zIndex: 0 }}>
                                    <MapContainer 
                                        // Coordenadas iniciales (CDMX) solo si no hay datos
                                        center={[19.4326, -99.1332]} 
                                        zoom={13} 
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; OpenStreetMap contributors'
                                        />
                                        
                                        {/* Escucha clics para actualizar inputs */}
                                        <LocationMarker />

                                        {/* Escucha inputs para mover el mapa */}
                                        <MapRecenter 
                                            lat={parseFloat(formData.latitude)} 
                                            lng={parseFloat(formData.longitude)} 
                                        />
                                    </MapContainer>
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