import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VetsManagement = () => {
    // --- Estados ---
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Estado del Formulario
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
    });

    // --- 1. Cargar Veterinarias (GET) ---
    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://vetpet-sandbox-vkt2.onrender.com/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // FILTRO: Buscamos usuarios con rol 'partner' (que son las veterinarias)
            const soloVets = response.data.filter(u => u.role === 'partner');
            setVets(soloVets);
        } catch (error) {
            console.error("Error cargando veterinarias", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Manejar Formulario ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', email: '', password: '' });
        setIsEditing(false);
    };

    const openModal = (vet = null) => {
        if (vet) {
            setIsEditing(true);
            setFormData({ ...vet, password: '' }); 
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    // --- 3. Guardar (Crear o Editar) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!formData.name || !formData.email) {
            alert("Nombre y Email son obligatorios");
            return;
        }
        if (!isEditing && !formData.password) {
            alert("La contraseña es obligatoria para nuevos usuarios");
            return;
        }

        try {
            if (isEditing) {
                // --- EDICIÓN (PUT) ---
                // Ajusta si tu ruta de update es diferente
                await axios.put(`https://vetpet-sandbox-vkt2.onrender.com/api/users/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                alert("Veterinaria actualizada correctamente.");
                fetchVets(); 
            } else {
                // --- CREACIÓN (POST) ---
                const payload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'partner',            // <--- Rol compatible con tu Backend
                    partner_type: 'veterinaria' // <--- Identificador específico
                };

                await axios.post('https://vetpet-sandbox-vkt2.onrender.com/api/admin/users', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                alert("Veterinaria creada exitosamente.");
                fetchVets(); 
            }
            setShowModal(false);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error al guardar.';
            alert(`Error: ${msg}`);
        }
    };

    // --- 4. Eliminar (DELETE) ---
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta veterinaria?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://vetpet-sandbox-vkt2.onrender.com/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Veterinaria eliminada.");
                fetchVets();
            } catch (error) {
                console.error(error);
                alert("Error al eliminar.");
            }
        }
    };

    // --- 5. Buscador ---
    const filteredVets = vets.filter(vet => 
        (vet.name && vet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vet.email && vet.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="card shadow-sm border-0">
            {/* Header */}
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="m-0 fw-bold text-dark">Gestión de Veterinarias</h5>
                <button className="btn btn-success" onClick={() => openModal()}>
                    <i className="bi bi-plus-lg me-2"></i> Nueva Veterinaria
                </button>
            </div>

            <div className="card-body">
                {/* Buscador */}
                <div className="input-group mb-3">
                    <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-search text-muted"></i>
                    </span>
                    <input 
                        type="text" 
                        className="form-control border-start-0 ps-0" 
                        placeholder="Buscar por nombre o correo..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabla */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Email (Login)</th>
                                <th>Rol Sistema</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center">Cargando...</td></tr>
                            ) : filteredVets.length > 0 ? (
                                filteredVets.map(vet => (
                                    <tr key={vet.id}>
                                        <td className="fw-bold">{vet.name}</td>
                                        <td>{vet.email}</td>
                                        <td><span className="badge bg-success">Veterinaria (Partner)</span></td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(vet)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(vet.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-4">
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar Veterinaria' : 'Nueva Veterinaria'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input 
                                            type="text" className="form-control" name="name" 
                                            value={formData.name} onChange={handleChange} required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input 
                                            type="email" className="form-control" name="email" 
                                            value={formData.email} onChange={handleChange} required 
                                        />
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="form-label">
                                            {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                                        </label>
                                        <input 
                                            type="password" className="form-control" name="password" 
                                            value={formData.password} onChange={handleChange} required={!isEditing} 
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">{isEditing ? 'Actualizar' : 'Registrar'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VetsManagement;