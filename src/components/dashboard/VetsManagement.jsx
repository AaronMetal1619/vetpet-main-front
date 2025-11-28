import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VetsManagement = () => {
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
        phone: '',
        address: ''
    });

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
            
            // Filtramos las veterinarias
            const soloVets = response.data.filter(u => u.role === 'partner' && u.partner_type === 'veterinaria');
            setVets(soloVets);
        } catch (error) {
            console.error("Error al cargar:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ id: '', name: '', email: '', password: '', phone: '', address: '' });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            if (isEditing) {
                // UPDATE
                await axios.put(`https://vetpet-sandbox-vkt2.onrender.com/api/users/${formData.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Actualizado correctamente.");
            } else {
                // CREATE
                const payload = {
                    ...formData,
                    role: 'partner',
                    partner_type: 'veterinaria'
                };
                await axios.post('https://vetpet-sandbox-vkt2.onrender.com/api/admin/users', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Veterinaria creada exitosamente.");
            }
            fetchVets(); 
            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.response?.data?.message || 'Error de conexión'}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Eliminar veterinaria?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://vetpet-sandbox-vkt2.onrender.com/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Eliminado.");
                fetchVets();
            } catch (error) {
                console.error(error);
                alert("Error al eliminar.");
            }
        }
    };

    const filteredVets = vets.filter(vet => 
        (vet.name && vet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vet.email && vet.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="m-0 fw-bold">Gestión de Veterinarias</h5>
                <button className="btn btn-success" onClick={() => openModal()}>
                    <i className="bi bi-plus-lg me-2"></i> Nueva
                </button>
            </div>
            <div className="card-body">
                <input type="text" className="form-control mb-3" placeholder="Buscar..." 
                       value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Contacto</th>
                                <th>Ubicación</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVets.map(vet => (
                                <tr key={vet.id}>
                                    <td className="fw-bold">{vet.name}</td>
                                    <td>
                                        <div>{vet.email}</div>
                                        <small className="text-muted">{vet.phone || 'S/N'}</small>
                                    </td>
                                    <td>{vet.address || '-'}</td>
                                    <td className="text-end">
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openModal(vet)}><i className="bi bi-pencil"></i></button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(vet.id)}><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar' : 'Nueva'} Veterinaria</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
                                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!isEditing} />
                                    </div>
                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label className="form-label">Teléfono</label>
                                            <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label className="form-label">Dirección</label>
                                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
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