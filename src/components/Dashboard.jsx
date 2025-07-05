import React from "react";

const Dashboard = () => {
    return (
        <div className="container mt-5">
            <br /><br />
            <div className="text-center mb-4">
                <h1 className="display-4 fw-bold">Dashboard de Administrador</h1>
                <p className="lead">Administra las citas, usuarios y veterinarias desde un solo lugar.</p>
            </div>
            
            <div className="row">
                {/* Panel de Citas */}
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Citas Agendadas</h5>
                            <input type="text" className="form-control mb-3" placeholder="Buscar cita..." />
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Fecha</th>
                                        <th>Veterinaria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Juan Pérez</td>
                                        <td>2025-04-05</td>
                                        <td>Veterinaria Central</td>
                                    </tr>
                                    <tr>
                                        <td>María López</td>
                                        <td>2025-04-06</td>
                                        <td>Hospital Veterinario</td>
                                    </tr>
                                    <tr>
                                        <td>Carlos Ramírez</td>
                                        <td>2025-04-07</td>
                                        <td>Centro de Salud Animal</td>
                                    </tr>
                                    <tr>
                                        <td>Carlos Ramírez</td>
                                        <td>2025-06-07</td>
                                        <td>Centro de Salud Animal</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="btn btn-primary w-100">Ver todas las citas</button>
                        </div>
                    </div>
                </div>
                
                {/* Panel de Administración */}
                <div className="col-md-6">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Panel de Administración</h5>
                            <ul className="list-group mb-3">
                                <li className="list-group-item">Gestionar Usuarios</li>
                                <li className="list-group-item">Administrar Veterinarias</li>
                                <li className="list-group-item">Configurar Horarios de Citas</li>
                                <li className="list-group-item">Ver Reportes y Estadísticas</li>
                                <li className="list-group-item">Enviar Notificaciones</li>
                            </ul>
                            <button className="btn btn-success w-100">Añadir Nuevo Administrador</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Panel de Reportes */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card shadow-lg">
                        <div className="card-body text-center">
                            <h5 className="card-title">Reportes y Estadísticas</h5>
                            <p className="text-muted">Resumen de la actividad del sistema.</p>
                            <div className="row">
                                <div className="col-md-4">
                                    <h3 className="text-primary">120</h3>
                                    <p>Citas agendadas</p>
                                </div>
                                <div className="col-md-4">
                                    <h3 className="text-success">45</h3>
                                    <p>Usuarios activos</p>
                                </div>
                                <div className="col-md-4">
                                    <h3 className="text-danger">10</h3>
                                    <p>Veterinarias registradas</p>
                                </div>
                            </div>
                            <button className="btn btn-dark mt-3">Ver Detalles</button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Panel de Actividades Recientes */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <h5 className="card-title">Actividades Recientes</h5>
                            <ul className="list-group">
                                <li className="list-group-item">Juan Pérez agendó una cita el 2025-04-05</li>
                                <li className="list-group-item">María López canceló su cita</li>
                                <li className="list-group-item">Se agregó una nueva veterinaria al sistema</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;