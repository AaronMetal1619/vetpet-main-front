import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ✅ IMPORTAMOS TU ICONO PERSONALIZADO
// Asegúrate de que la imagen esté en src/assets/iconovet.jpeg
import iconoVetImg from '../assets/iconovet.jpeg';

const vetIcon = L.icon({
  iconUrl: iconoVetImg,
  iconSize: [45, 45], // Tamaño ajustado
  iconAnchor: [22, 45], // La punta del icono
  popupAnchor: [0, -40], // Donde sale el globo de texto
  className: 'rounded-circle border border-white shadow-sm' // Estilo redondo opcional
});

const AgendarCita = () => {
  const [veterinarias, setVeterinarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Coordenadas por defecto (CDMX) o usa geolocation si prefieres
  const defaultCenter = [19.4326, -99.1332];

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      // Obtenemos usuarios de la API pública
      const response = await axios.get('https://vetpet-back.onrender.com/api/users');
      
      // Filtramos solo veterinarias que tengan coordenadas
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
    // Al dar clic, nos lleva al formulario pasando la veterinaria seleccionada
    navigate('/crear-cita-cliente', { state: { vet } });
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Encuentra tu Veterinaria</h2>
        <p className="text-muted">Explora el mapa y agenda una cita para tu mascota.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card shadow-lg border-0 overflow-hidden">
          <div style={{ height: '550px', width: '100%' }}>
            <MapContainer 
              center={defaultCenter} 
              zoom={12} 
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
                  icon={vetIcon} // ✅ Usamos tu icono
                >
                  <Popup>
                    <div className="text-center" style={{ minWidth: '200px' }}>
                      <h6 className="fw-bold mb-1 text-primary">{vet.name}</h6>
                      <hr className="my-2"/>
                      <p className="small text-muted mb-1">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {vet.address || 'Ubicación registrada'}
                      </p>
                      <p className="small mb-2">
                        <i className="bi bi-telephone-fill me-1"></i> 
                        {vet.phone || 'Sin teléfono'}
                      </p>
                      
                      {/* Sección de Horarios (Estática por ahora) */}
                      <div className="alert alert-light py-1 px-2 mb-2 border text-start" style={{fontSize: '0.75rem'}}>
                        <strong>Horario de Atención:</strong><br/>
                        🕒 Lun - Vie: 9:00 AM - 7:00 PM<br/>
                        🕒 Sáb: 10:00 AM - 2:00 PM
                      </div>

                      <button 
                        className="btn btn-success btn-sm w-100 fw-bold"
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