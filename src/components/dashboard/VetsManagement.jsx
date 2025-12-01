import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VetsManagement = () => {
    const [vets, setVets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Hook para navegar a la otra página
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // ✅ URL CORRECTA
            const response = await axios.get('https://vetpet-back.onrender.com/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Filtramos: rol 'partner' y tipo 'veterinaria'
            const soloVets = response.data.filter(u => u.role === 'partner' && u.partner_type === 'veterinaria');
            setVets(soloVets);
        } catch (error) {
            console.error("Error al cargar:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta veterinaria?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://vetpet-back.onrender.com/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Eliminado correctamente.");
                fetchVets(); // Recargar lista
            } catch (error) { 
                console.error(error);
                alert("Error al eliminar."); 
            }
        }
    };

    // --- NAVEGACIÓN ---
    
    // Ir a la página de creación
    const handleCreate = () => {
        navigate('/create-vet');
    };

    // Ir a la página de edición (pasando los datos de la veterinaria actual)
    const handleEdit = (vet) => {
        navigate('/create-vet', { state: { vet } });
    };

    const filteredVets = vets.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="m-0 fw-bold">Gestión de Veterinarias</h5>
                {/* Botón redirige a la nueva página */}
                <button className="btn btn-success" onClick={handleCreate}>
                    <i className="bi bi-plus-lg me-2"></i> Nueva Veterinaria
                </button>
            </div>
            <div className="card-body">
                <input 
                    type="text" 
                    className="form-control mb-3" 
                    placeholder="Buscar por nombre o correo..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Contacto</th>
                                <th>Dirección</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-3">Cargando...</td></tr>
                            ) : filteredVets.length > 0 ? (
                                filteredVets.map(vet => (
                                    <tr key={vet.id}>
                                        <td>
                                            <span className="fw-bold">{vet.name}</span><br/>
                                            <small className="text-muted">{vet.email}</small>
                                        </td>
                                        <td>{vet.phone || 'N/A'}</td>
                                        <td>
                                            {vet.address || '-'}
                                            {vet.latitude && (
                                                <span className="badge bg-info ms-2 text-dark" title="Ubicación registrada">
                                                    <i className="bi bi-geo-alt-fill"></i> Mapa
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2" 
                                                onClick={() => handleEdit(vet)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger" 
                                                onClick={() => handleDelete(vet.id)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="text-center text-muted py-3">No hay veterinarias registradas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* EL MODAL HA SIDO ELIMINADO DE AQUÍ */}
        </div>
    );
};

export default VetsManagement;