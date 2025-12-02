import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; // Importamos useMap
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ✅ 1. TU ICONO DE VETERINARIA (La Huella)
import iconoVetImg from '../assets/iconovet.jpeg';

const vetIcon = L.icon({
  iconUrl: iconoVetImg,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40],
  className: 'rounded-circle border border-white shadow-sm'
});

// ✅ 2. NUEVO ICONO PARA EL USUARIO (Una persona o pin azul)
const userIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9131/9131546.png", // Icono de usuario gratis
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// ✅ 3. COMPONENTE AUXILIAR PARA RE-CENTRAR EL MAPA
// Leaflet no se mueve automáticamente si cambias el estado "center", necesitamos esto:
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14); // Zoom 14 para ver detalle cercano
    }
  }, [lat, lng, map]);
  return null;
};

const AgendarCita = () => {
  const [veterinarias, setVeterinarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myLocation, setMyLocation] = useState(null); // Estado para ubicación del usuario
  const navigate = useNavigate();
  
  // Coordenadas por defecto (CDMX) por si el usuario niega el permiso
  const defaultCenter = [19.4326, -99.1332];

  useEffect(() => {
    // A. Obtener Ubicación del Usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Ubicación denegada o no disponible", error);
        }
      );
    }

    // B. Cargar Veterinarias
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const response = await axios.get('https://vetpet-back.onrender.com/api/users');
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
    navigate('/crear-cita-cliente', { state: { vet } });
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Encuentra tu Veterinaria</h2>
        <p className="text-muted">
          {myLocation 
            ? "📍 Mostrando veterinarias cerca de tu ubicación." 
            : "🌍 Activa tu ubicación para ver las clínicas más cercanas."}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="card shadow-lg border-0 overflow-hidden">
          <div style={{ height: '550px', width: '100%' }}>
            
            <MapContainer 
              center={myLocation || defaultCenter} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
            >
              {/* Capa del Mapa */}
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              {/* Componente invisible que mueve el mapa cuando tenemos ubicación */}
              {myLocation && <RecenterMap lat={myLocation[0]} lng={myLocation[1]} />}

              {/* 📍 MARCADOR DEL USUARIO (Tú estás aquí) */}
              {myLocation && (
                <Marker position={myLocation} icon={userIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>¡Estás aquí!</strong> 🏠
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* 🐾 MARCADORES DE VETERINARIAS */}
              {veterinarias.map(vet => (
                <Marker 
                  key={vet.id} 
                  position={[parseFloat(vet.latitude), parseFloat(vet.longitude)]}
                  icon={vetIcon}
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
                      
                      <div className="alert alert-light py-1 px-2 mb-2 border text-start" style={{fontSize: '0.75rem'}}>
                        <strong>Horario:</strong> 9:00 AM - 7:00 PM
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