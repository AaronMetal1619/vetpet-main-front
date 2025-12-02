import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaTimes } from "react-icons/fa"; // Agregué iconos nuevos
import "../Estilos/Perfil.css";

function Perfil() {
  // --- ESTADOS DE USUARIO ---
  const [userData, setUserData] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false); // Renombrado para claridad
  const [editedUserData, setEditedUserData] = useState({});

  // --- ESTADOS DEL CARDEX (MASCOTAS) ---
  const [pets, setPets] = useState([]);
  const [showPetModal, setShowPetModal] = useState(false);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [currentPet, setCurrentPet] = useState({
    id: null,
    name: "",
    owner_name: "", // Nuevo campo solicitado
    age: "",
    breed: "",
    allergies: "Ninguna",
    chronic_diseases: "Ninguna",
    surgeries: "Ninguna",
    photo: null, // Archivo
    photo_url: "" // URL para previsualizar
  });
    // Agrega estos estados junto a los otros
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPetHistory, setSelectedPetHistory] = useState([]);
  const [selectedPetName, setSelectedPetName] = useState("");

  // Función para abrir el modal
  const handleShowHistory = (pet) => {
      setSelectedPetName(pet.name);
      setSelectedPetHistory(pet.medical_history || []); // Laravel nos manda esto gracias al "with"
      setShowHistoryModal(true);
  };

  // --- ESTADOS DE ADORNO (FOTOS/CITAS) ---
  const [photos] = useState([
    { url: "https://via.placeholder.com/150" }, // Placeholders para ejemplo
    { url: "https://via.placeholder.com/150" },
  ]);
  const [appointments] = useState([
    { date: "2025-05-01", time: "10:00 AM", description: "Consulta general" },
  ]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 1. CARGA INICIAL DE DATOS
  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchPets();
    }
  }, [token]);

  const fetchUserData = () => {
    axios.get("https://vetpet-back.onrender.com/api/me", { // URL CORREGIDA A PROD
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserData(res.data);
        setEditedUserData(res.data);
      })
      .catch((err) => console.error("Error usuario:", err));
  };

  const fetchPets = () => {
    axios.get("https://vetpet-back.onrender.com/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPets(res.data))
      .catch((err) => console.error("Error mascotas:", err));
  };

  // --- LÓGICA DE USUARIO ---
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setEditedUserData((prev) => ({ ...prev, profilePic: file }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editedUserData.name);
    formData.append("email", editedUserData.email);
    formData.append("phone", editedUserData.phone);
    if (editedUserData.profilePic instanceof File) {
      formData.append("profile_picture", editedUserData.profilePic);
    }

    try {
      const res = await axios.post(
        `https://vetpet-back.onrender.com/api/update-profile/${userData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      setUserData(res.data.user);
      setIsEditingUser(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // --- LÓGICA DE CARDEX (MASCOTAS) ---

  // Abrir modal para crear
  const openNewPetModal = () => {
    setCurrentPet({
      id: null, name: "", owner_name: userData.name, age: "", breed: "", 
      allergies: "Ninguna", chronic_diseases: "Ninguna", surgeries: "Ninguna", 
      photo: null, photo_url: ""
    });
    setIsEditingPet(false);
    setShowPetModal(true);
  };

  // Abrir modal para editar
  const openEditPetModal = (pet) => {
    setCurrentPet({
      ...pet,
      photo: null, // Reseteamos el archivo input, mantenemos la URL existente
      photo_url: pet.photo_url // Asumiendo que el back devuelve esto
    });
    setIsEditingPet(true);
    setShowPetModal(true);
  };

  const handlePetInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPet((prev) => ({ ...prev, [name]: value }));
  };

  const handlePetFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentPet((prev) => ({ 
        ...prev, 
        photo: file,
        photo_url: URL.createObjectURL(file) // Previsualización local
      }));
    }
  };

  // GUARDAR MASCOTA (Crear o Editar)
  const handlePetSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentPet.name);
    formData.append("owner_name", currentPet.owner_name);
    formData.append("age", currentPet.age);
    formData.append("breed", currentPet.breed);
    formData.append("allergies", currentPet.allergies);
    formData.append("chronic_diseases", currentPet.chronic_diseases);
    formData.append("surgeries", currentPet.surgeries);
    
    if (currentPet.photo instanceof File) {
      formData.append("photo", currentPet.photo);
    }

    try {
      let url = "https://vetpet-back.onrender.com/api/pets";
      
      if (isEditingPet) {
        // Truco para Laravel: usar POST con _method=PUT para poder subir archivos
        formData.append("_method", "PUT");
        url = `${url}/${currentPet.id}`;
      }

      await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });

      fetchPets(); // Recargar lista
      setShowPetModal(false);
    } catch (error) {
      console.error("Error guardando mascota:", error.response?.data || error.message);
      alert("Error al guardar la mascota. Revisa la consola.");
    }
  };

  // ELIMINAR MASCOTA
  const handleDeletePet = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este Cardex? Se borrarán los datos médicos.")) return;
    
    try {
      await axios.delete(`https://vetpet-back.onrender.com/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPets();
    } catch (error) {
      console.error("Error eliminando mascota:", error);
    }
  };

  if (!userData) return <div className="text-center mt-5">Cargando perfil...</div>;

  return (
    <main className="container my-5">
      {/* --- SECCIÓN PERFIL DE USUARIO --- */}
      <div className="profile-container shadow p-4 rounded bg-white">
        <div className="profile-header d-flex align-items-center gap-4">
          <div className="profile-img-container">
            <img
              src={
                editedUserData.profilePic instanceof File
                  ? URL.createObjectURL(editedUserData.profilePic)
                  : userData.profile_picture || "https://st2.depositphotos.com/3895623/5589/v/450/depositphotos_55896913-stock-illustration-usershirt.jpg"
              }
              alt="Perfil"
              className="rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>
          <div className="profile-info flex-grow-1">
            <h1>{userData.name}</h1>
            <p className="text-muted">{userData.email}</p>

            {userData.role === "admin" ? (
               // ... (Tu código de admin se mantiene igual)
               <p>Panel de Admin</p>
            ) : (
              <>
                {isEditingUser ? (
                  <form onSubmit={handleUserSubmit} className="mt-3">
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <input name="name" className="form-control" value={editedUserData.name || ""} onChange={handleUserInputChange} placeholder="Nombre" />
                        </div>
                        <div className="col-md-6 mb-2">
                            <input name="phone" className="form-control" value={editedUserData.phone || ""} onChange={handleUserInputChange} placeholder="Teléfono" />
                        </div>
                        <div className="col-12 mb-2">
                             <input type="file" className="form-control" onChange={handleUserFileChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success me-2">Guardar</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingUser(false)}>Cancelar</button>
                  </form>
                ) : (
                  <button className="btn btn-outline-primary" onClick={() => setIsEditingUser(true)}>
                    <FaEdit /> Editar Perfil
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <hr className="my-5" />

        {/* --- SECCIÓN CARDEX DE MASCOTAS --- */}
        <div className="pets-section">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary">Cardex de Mascotas</h2>
            <button className="btn btn-primary" onClick={openNewPetModal}>
              <FaPlus /> Agregar Mascota
            </button>
          </div>

          <div className="row">
            {pets.length > 0 ? (
              pets.map((pet) => (
                <div key={pet.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <img 
                        src={pet.photo_url || "https://cdn-icons-png.flaticon.com/512/616/616408.png"} 
                        className="card-img-top" 
                        alt={pet.name}
                        style={{ height: "200px", objectFit: "cover" }} 
                    />
                    <div className="card-body">
                      <h4 className="card-title fw-bold">{pet.name}</h4>
                      <h6 className="card-subtitle mb-2 text-muted">{pet.breed} - {pet.age} años</h6>
                      
                      <div className="small mt-3">
                        {/* LÓGICA DE PRÓXIMA CITA */}
                          {pet.next_appointment ? (
                              <div className="alert alert-info py-1 px-2 mb-2" style={{ fontSize: '0.85rem' }}>
                                  <strong>Próxima Cita:</strong><br/>
                                  {pet.next_appointment.date} a las {pet.next_appointment.time}
                              </div>
                          ) : (
                              <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                                  Sin citas pendientes
                              </div>
                          )}
                        <p className="mb-1"><strong>Dueño:</strong> {pet.owner_name}</p>
                        <p className="mb-1 text-danger"><strong>Alergias:</strong> {pet.allergies}</p>
                        <p className="mb-1 text-warning"><strong>Enfermedades:</strong> {pet.chronic_diseases}</p>
                        <p className="mb-1"><strong>Cirugías:</strong> {pet.surgeries}</p>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-info me-1"
                          onClick={() => handleShowHistory(pet)} // Necesitamos crear esta función
                      >
                          Historial
                      </button>
                    <div className="card-footer bg-white border-top-0 d-flex justify-content-end gap-2 pb-3">
                        <button className="btn btn-sm btn-outline-warning" onClick={() => openEditPetModal(pet)}>
                            <FaEdit /> Editar
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePet(pet.id)}>
                            <FaTrash />
                        </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-muted">
                <p>No tienes mascotas registradas aún.</p>
              </div>
            )}
          </div>
        </div>

        {/* --- MODAL PARA AGREGAR/EDITAR MASCOTA --- */}
        {showPetModal && (
            <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
            }}>
                <div className="modal-content bg-white p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                    <div className="d-flex justify-content-between mb-3">
                        <h3>{isEditingPet ? "Editar Cardex" : "Nuevo Cardex"}</h3>
                        <button className="btn btn-link text-dark" onClick={() => setShowPetModal(false)}><FaTimes size={20}/></button>
                    </div>
                    
                    <form onSubmit={handlePetSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nombre Mascota</label>
                                <input name="name" className="form-control" value={currentPet.name || ""} onChange={handlePetInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Raza</label>
                                <input name="breed" className="form-control" value={currentPet.breed || ""} onChange={handlePetInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Edad (años)</label>
                                <input type="number" name="age" className="form-control" value={currentPet.age || ""} onChange={handlePetInputChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Nombre Dueño</label>
                                <input name="owner_name" className="form-control" value={currentPet.owner_name || ""} onChange={handlePetInputChange} required />
                            </div>
                            
                            <div className="col-12">
                                <label className="form-label text-danger">Alergias</label>
                                <textarea name="allergies" className="form-control" rows="2" value={currentPet.allergies || ""} onChange={handlePetInputChange}></textarea>
                            </div>
                            <div className="col-12">
                                <label className="form-label text-warning">Enfermedades Crónicas</label>
                                <textarea name="chronic_diseases" className="form-control" rows="2" value={currentPet.chronic_diseases || ""} onChange={handlePetInputChange}></textarea>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Cirugías Previas</label>
                                <textarea name="surgeries" className="form-control" rows="2" value={currentPet.surgeries || ""} onChange={handlePetInputChange}></textarea>
                            </div>
                            
                            <div className="col-12">
                                <label className="form-label">Foto de la Mascota</label>
                                <input type="file" className="form-control" onChange={handlePetFileChange} accept="image/*" />
                                {currentPet.photo_url && (
                                    <div className="mt-2 text-center">
                                        <img src={currentPet.photo_url} alt="Previsualización" style={{ height: '100px', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 d-grid gap-2">
                            <button type="submit" className="btn btn-primary btn-lg">
                                {isEditingPet ? "Actualizar Cardex" : "Guardar Mascota"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        {/* MODAL DE HISTORIAL MÉDICO */}
{showHistoryModal && (
    <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050
    }}>
        <div className="modal-content bg-white p-4 rounded shadow-lg" style={{ width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                <h4 className="m-0">📋 Historial de {selectedPetName}</h4>
                <button className="btn btn-close" onClick={() => setShowHistoryModal(false)}>X</button>
            </div>

            {selectedPetHistory.length > 0 ? (
                <div className="list-group">
                    {selectedPetHistory.map((record) => (
                        <div key={record.id} className="list-group-item list-group-item-action flex-column align-items-start">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1 text-primary">{record.clinic_name}</h5>
                                <small className="text-muted">{record.visit_date}</small>
                            </div>
                            <p className="mb-1"><strong>Diagnóstico:</strong> {record.diagnosis}</p>
                            {record.treatment && (
                                <small className="text-muted"><strong>Tratamiento:</strong> {record.treatment}</small>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-4 text-muted">
                    <p>No hay registros médicos previos.</p>
                </div>
            )}
            
            <div className="mt-3 text-end">
                <button className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>Cerrar</button>
            </div>
        </div>
    </div>
            )}

      </div>
    </main>
  );
}

export default Perfil;