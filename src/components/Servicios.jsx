import React, { useState } from 'react';
import './Servicios.css'; // 👈 Asegúrate de crear este archivo

const Servicios = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedMedico, setSelectedMedico] = useState(null);

    // Datos de ejemplo
    const servicios = [
        { id: 1, especialidad: 'Cardiología', medico: 'Dr. Juan Pérez', descripcion: 'Especialista en enfermedades del corazón de mascotas.', telefono: '123-456-789', correo: 'juan.perez@mail.com' },
        { id: 2, especialidad: 'Dermatología', medico: 'Dra. Laura Gómez', descripcion: 'Experta en problemas de la piel y alergias.', telefono: '234-567-890', correo: 'laura.gomez@mail.com' },
    ];

    const filteredServicios = servicios.filter((servicio) =>
        servicio.especialidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        servicio.medico.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (medico) => {
        setSelectedMedico(medico); // 👈 ahora guarda el objeto completo
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="container py-4 servicios-container"> {/* 👈 añadimos la clase del CSS */}
            {/* Header */}
            <header className="text-center mb-5">
                <h1 className="display-4 fw-bold mb-3" style={{ color: '#3A5A78' }}>Servicios Veterinarios</h1>
                <p className="lead" style={{ color: '#5C8374' }}> experto para tu compañero peludo</p>
            </header>

            {/* Barra de búsqueda */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control form-control-lg border-2"
                        style={{
                            borderColor: '#B7C4CF',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 2px 8px rgba(58, 90, 120, 0.1)'
                        }}
                        placeholder="🔍 Buscar especialidad o médico..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Lista de servicios */}
         
        <div key={servicio.id} className="col-md-6 col-lg-4">
  <div className="card h-100 servicio-card">
    <div className="card-body p-4">
      <span className="badge mb-3" style={{
        backgroundColor: '#FFEEF2',
        color: '#C06C84',
        fontSize: '0.8rem'
      }}>
        {servicio.especialidad}
      </span>
      <h4 style={{ color: '#2C3E50', marginBottom: '0.8rem' }}>{servicio.medico}</h4>
      <p className="text-muted mb-4" style={{ lineHeight: '1.6' }}>{servicio.descripcion}</p>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <small className="d-block text-muted mb-1">
            <i className="bi bi-telephone me-2"></i>{servicio.telefono}
          </small>
          <small className="d-block text-muted">
            <i className="bi bi-envelope me-2"></i>{servicio.correo}
          </small>
        </div>
        <button
          className="btn rounded-pill px-3 py-2"
          style={{
            backgroundColor: '#C06C84',
            color: 'white',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
          onClick={() => openModal(servicio)}
        >
          <i className="bi bi-calendar2-plus me-1"></i> Agendar
        </button>
      </div>
    </div>
  </div>
</div>

            {/* Modal */}
            {showModal && selectedMedico && (
                <div
                    className="modal-backdrop fade show d-flex align-items-center justify-content-center modal-backdrop-custom"
                >
                    <div className="modal-content modal-content-custom">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3 style={{ color: '#3A5A78' }}>Agendar con {selectedMedico.medico}</h3>
                            <button
                                onClick={closeModal}
                                className="btn-close"
                                style={{ fontSize: '1.2rem' }}
                            />
                        </div>

                        <p className="mb-4" style={{ color: '#5C8374' }}>
                            Especialidad: {selectedMedico.especialidad}
                        </p>
                        <p className="mb-4" style={{ color: '#5C8374' }}>
                            {selectedMedico.descripcion}
                        </p>

                        <div className="d-grid gap-3">
                            <a
                                href={`tel:${selectedMedico.telefono}`}
                                className="btn btn-lg d-flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: '#3A5A78',
                                    color: 'white',
                                    borderRadius: '8px'
                                }}
                            >
                                <i className="bi bi-telephone-fill me-2"></i> Llamar ahora
                            </a>

                            <a
                                href={`https://wa.me/?text=Hola ${selectedMedico.medico}, quisiera agendar una cita`}
                                className="btn btn-lg d-flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: '#25D366',
                                    color: 'white',
                                    borderRadius: '8px'
                                }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="bi bi-whatsapp me-2"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {filteredServicios.length === 0 && (
                <div className="text-center py-5">
                    <h4 style={{ color: '#3A5A78' }}>No encontramos resultados</h4>
                    <p style={{ color: '#5C8374' }}>Intenta con otro término de búsqueda</p>
                </div>
            )}
        </div>
    );
};

export default Servicios;
