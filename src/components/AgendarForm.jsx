import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AgendarForm = () => {
const location = useLocation();
const navigate = useNavigate();
const vet = location.state?.vet; // Tomamos la veterinaria seleccionada
console.log("Datos de veterinaria en AgendarForm:", vet);

const onCancel = () => {
    navigate(-1); // Regresa a la página anterior
};

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-6">
                    {/* Tarjeta contenedora */}
                    <div className="card shadow border-0 overflow-hidden">

                        {/* Encabezado */}
                        <div className="card-header bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h5 mb-0">Agendar Cita con {vet?.name}</h2>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={onCancel}
                                    aria-label="Cerrar"
                                ></button>
                            </div>
                        </div>

                        {/* Cuerpo */}
                        <div className="card-body p-4">
                            {/* Información de la veterinaria */}
                            <div className="mb-4 p-3 bg-light rounded-2">
                                <div className="d-flex align-items-start">
                                    <i className="bi bi-geo-alt-fill text-primary me-2 mt-1"></i>
                                    <div>
                                        <p className="mb-1 fw-semibold">Dirección:</p>
                                        <p className="text-muted mb-0">{vet?.vicinity}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Formulario */}
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="row g-3">
                                    {/* Campo Nombre */}
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="clientName"
                                                placeholder="Nombre del Cliente"
                                                required
                                            />
                                            <label htmlFor="clientName">Nombre completo</label>
                                        </div>
                                    </div>

                                    {/* Campo Teléfono */}
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="clientPhone"
                                                placeholder="Teléfono"
                                                required
                                            />
                                            <label htmlFor="clientPhone">Teléfono</label>
                                        </div>
                                    </div>

                                    {/* Campo Fecha */}
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="appointmentDate"
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                            <label htmlFor="appointmentDate">Fecha</label>
                                        </div>
                                    </div>

                                    {/* Campo Hora */}
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="appointmentTime"
                                                required
                                            />
                                            <label htmlFor="appointmentTime">Hora</label>
                                        </div>
                                    </div>

                                    {/* Campo Notas */}
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                id="appointmentNotes"
                                                placeholder="Motivo de la cita"
                                                style={{ height: '100px' }}
                                            ></textarea>
                                            <label htmlFor="appointmentNotes">Motivo de la cita (opcional)</label>
                                        </div>
                                    </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="d-flex justify-content-between gap-3 mt-4 pt-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary flex-grow-1 py-2"
                                        onClick={onCancel}
                                    >
                                        <i className="bi bi-x-circle me-2"></i> Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-grow-1 py-2"
                                    >
                                        <i className="bi bi-calendar-check me-2"></i> Confirmar Cita
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendarForm;
