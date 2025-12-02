import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono personalizado para el mapa
const vetIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2301/2301129.png", // Icono de veterinaria
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const AgendarCita = () => {
  const [veterinarias, setVeterinarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Ubicación por defecto (CDMX) - Puedes usar geolocalización real si prefieres
  const defaultCenter = [19.4326, -99.1332];

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      // Como la ruta /api/users es pública, no necesitamos token aquí
      const response = await axios.get('https://vetpet-back.onrender.com/api/users');
      
      // Filtramos solo las veterinarias que tengan coordenadas válidas
      const vetsConMapa = response.data.filter(u => 
        u.role === 'partner' && 
        u.partner_type === 'veterinaria' &&
        u.latitude && u.longitude
      );
      setVeterinarias(vetsConMapa);
    } catch (error) {
      console.error("Error cargando mapa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgendar = (vet) => {
    // Redirigimos al formulario de cita, pasando la veterinaria seleccionada
    navigate('/crear-cita-cliente', { state: { vet } });
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Encuentra tu Veterinaria</h2>
        <p className="text-muted">Selecciona una clínica en el mapa para agendar tu cita.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card shadow-lg border-0 overflow-hidden">
          <div style={{ height: '500px', width: '100%' }}>
            <MapContainer 
              center={defaultCenter} 
              zoom={11} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {veterinarias.map(vet => (
                <Marker 
                  key={vet.id} 
                  position={[parseFloat(vet.latitude), parseFloat(vet.longitude)]}
                  icon={vetIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <h6 className="fw-bold mb-1">{vet.name}</h6>
                      <p className="small text-muted mb-2">{vet.address || 'Sin dirección'}</p>
                      <p className="small mb-2">📞 {vet.phone || 'S/N'}</p>
                      
                      {/* Horarios (Simulados por ahora) */}
                      <div className="alert alert-light py-1 px-2 mb-2 border" style={{fontSize: '0.75rem'}}>
                        🕒 Lun-Vie: 9am - 7pm
                      </div>

                      <button 
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => handleAgendar(vet)}
                      >
                        📅 Agendar Cita
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendarCita;