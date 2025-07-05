import React, { useEffect, useState, useRef } from "react";
import "../Estilos/Card.css";
import "../Estilos/Styles.css";
import veterinariaIcon from "../assets/iconoVet.png";
import Ubicacion from "../assets/Ubicacion.png";

const AgendarCita = () => {
  const [veterinarias, setVeterinarias] = useState([]);
  const [location, setLocation] = useState(null);
  const [showAgendarForm, setShowAgendarForm] = useState(false); // Estado para mostrar el formulario
  const [selectedVet, setSelectedVet] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [citaExitosa, setCitaExitosa] = useState(false);

  useEffect(() => {
    console.log("Buscando ubicación...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Ubicación obtenida:", latitude, longitude);
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener la ubicación: ", error);
        }
      );
    } else {
      console.error("Geolocalización no disponible.");
    }
  }, []);

  useEffect(() => {
    if (location && window.google?.maps) {
      console.log("Iniciando mapa...");
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 14,
      });

      mapRef.current = mapInstance;

      if (window.google.maps.marker?.AdvancedMarkerElement) {
        new window.google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: mapInstance,
          title: "Tu ubicación",
        });
      } else {
        new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          title: "Tu ubicación",
          icon: {
            url: Ubicacion,
            scaledSize: new window.google.maps.Size(90, 60),
          },
        });
      }

      buscarVeterinarias(location.lat, location.lng);
    }
  }, [location]);

  const buscarVeterinarias = (lat, lng) => {
    console.log("Buscando veterinarias cercanas...");
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: 3000,
      type: "veterinary_care",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log("Veterinarias encontradas:", results);
        setVeterinarias(results);
        limpiarMarcadores();
        agregarMarcadores(results);
      } else {
        console.error("No se encontraron veterinarias: " + status);
      }
    });
  };

  const agregarMarcadores = (results) => {
    console.log("Agregando marcadores...");
    results.forEach((vet) => {
      const marker = new window.google.maps.Marker({
        position: {
          lat: vet.geometry.location.lat(),
          lng: vet.geometry.location.lng(),
        },
        map: mapRef.current,
        title: vet.name,
        icon: {
          url: veterinariaIcon,
          scaledSize: new window.google.maps.Size(58, 50),
        },
      });

      markersRef.current.push(marker);
      console.log("Marcador agregado para:", vet.name);
    });
  };

  const limpiarMarcadores = () => {
    console.log("Limpiando marcadores...");
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  const onAgendarCita = (vet) => {
    setSelectedVet(vet); // Guardamos la veterinaria seleccionada
    setShowAgendarForm(true); // Mostramos el formulario de agendar cita
    setCitaExitosa(false); // Aseguramos que el estado de "citaExitosa" se resetee para nuevas citas
  };

  const onCancel = () => {
    console.log("Formulario cancelado");
    setShowAgendarForm(false); // Ocultamos el formulario
    setSelectedVet(null); // Limpiamos la veterinaria seleccionada
    setCitaExitosa(false); // Reseteamos el estado de citaExitosa
  };

  const handleReload = () => {
    console.log("Se ha registrado la cita correctamente.");
    setShowAgendarForm(false);
    setSelectedVet(null); // Limpiar veterinaria seleccionada después de registrar la cita
    setCitaExitosa(false); // Restablecer estado después de la cita exitosa
  };

  const handleAgendarCita = () => {
    setCitaExitosa(true); // Cambia el modal a la vista de éxito
  };

  return (
    <main className="pb-5">
      <div className="container mt-4">
        {/* Contenido principal */}
        <div className="mb-4">
          <h2 className="mb-3">Veterinarias Cercanas</h2>
          <div
            id="map"
            className="rounded-3 shadow-sm"
            style={{ height: "400px", width: "100%", marginBottom: "20px" }}
          ></div>
        </div>

        {/* Listado de veterinarias */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {veterinarias.length > 0 ? (
            veterinarias.map((vet, index) => (
              <div className="col" key={index}>
                {/* Tarjeta de veterinaria */}
                <div className="card h-100 shadow-sm">
                  <img
                    src={vet.photos && vet.photos[0]?.getUrl() ? vet.photos[0].getUrl() : "https://instrumentalia.com.mx/img/p/es-default-home_default.jpg"}
                    className="card-img-top object-fit-cover"
                    alt="Veterinaria"
                    style={{ height: "180px" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{vet.name}</h5>
                    <p className="card-text text-muted small">{vet.vicinity}</p>
                    <p className="mb-2">
                      <span className="badge bg-secondary">{vet.business_status}</span>
                    </p>
                    <button
                      onClick={() => onAgendarCita(vet)}
                      className="btn btn-success mt-auto align-self-start"
                    >
                      Agendar Cita
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted">No se encontraron veterinarias.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de agendamiento */}
      {showAgendarForm && (
        <div
          className="modal fade show"
          tabIndex="-1"
          aria-labelledby="modalAgendarCitaLabel"
          aria-hidden={!showAgendarForm}
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title" id="modalAgendarCitaLabel">
                  {citaExitosa ? "Cita Agendada" : `Agendar Cita con ${selectedVet?.name}`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onCancel}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="modal-body text-center">
                {citaExitosa ? (
                  <>
                    <p className="text-success fw-bold">Tu cita ha sido agendada con éxito 🐾</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={onCancel}
                    >
                      Aceptar
                    </button>
                  </>
                ) : (
                  <form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        defaultValue={selectedVet.name}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        defaultValue={selectedVet.vicinity}
                        disabled
                      />
                    </div>
                    <div className="row g-2">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="date" className="form-label">Fecha</label>
                        <input type="date" className="form-control" id="date" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="time" className="form-label">Hora</label>
                        <input type="time" className="form-control" id="time" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onCancel}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAgendarCita}
                      >
                        Agendar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AgendarCita;
