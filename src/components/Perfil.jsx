import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa"; 
import "../Estilos/Perfil.css";

function Perfil() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
  });
  const [photos, setPhotos] = useState([ 
    { url: "https://www.mediterraneannatural.com/wp-content/uploads/2019/06/Hay-cuatro-cachorros-en-la-basura-la-historia-real-de-los-4-guerreros-2.jpg" },
    { url: "https://www.kiwoko.com/servicios/kiwokoadopta/images/profiles/pets/lavanda-67ce3dc1eeb36763591226.jfif" },
  ]);
  const [appointments, setAppointments] = useState([ 
    { date: "2025-05-01", time: "10:00 AM", description: "Consulta general" },
    { date: "2025-06-15", time: "2:30 PM", description: "Chequeo dental" },
  ]);
  const [pets, setPets] = useState([ 
    { name: "Max", breed: "Labrador" },
    { name: "Bella", breed: "Bulldog Francés" },
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // NUEVA URL
      axios
        .get("https://vetpet-back.onrender.com/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data) {
            setUserData(response.data);
            setEditedUserData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    }
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => { setIsEditing(false); setEditedUserData(userData); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUserData((prevState) => ({ ...prevState, profilePic: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", editedUserData.name);
    formData.append("email", editedUserData.email);
    formData.append("phone", editedUserData.phone);
    if (editedUserData.profilePic instanceof File) {
      formData.append("profile_picture", editedUserData.profilePic);
    }

    try {
      // NUEVA URL
      const response = await axios.post(
        `https://vetpet-back.onrender.com/api/update-profile/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUserData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  if (!userData) return <div>Cargando...</div>;

  return (
    <main>
      <br /><br />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-img-container">
            <img
              src={ 
                editedUserData.profilePic && editedUserData.profilePic instanceof File
                ? URL.createObjectURL(editedUserData.profilePic) 
                : "https://st2.depositphotos.com/3895623/5589/v/450/depositphotos_55896913-stock-illustration-usershirt.jpg"
              }
              alt="Foto de perfil"
              className="profile-img"
            />
          </div>
          <div className="profile-info">
            <h1>{userData.name}</h1>
            <p>{userData.email}</p>
            
            {userData.role === "admin" ? (
              <div>
                <h3>Notificaciones Recientes</h3>
                <div className="admin-table-container">
                  <table className="table table-bordered admin-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Fecha</th>
                        <th>Notificación</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>1</td><td>2025-04-01</td><td>Solicitud de actualización de perfil aprobada</td><td><span className="badge bg-success">Completada</span></td></tr>
                      <tr><td>2</td><td>2025-03-28</td><td>Nuevo usuario registrado en el sistema</td><td><span className="badge bg-warning">Pendiente</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Nombre</label>
                      <input type="text" id="name" name="name" className="form-control" value={editedUserData.name || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Correo</label>
                      <input type="email" id="email" name="email" className="form-control" value={editedUserData.email || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Teléfono</label>
                      <input type="tel" id="phone" name="phone" className="form-control" value={editedUserData.phone || ""} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="profilePic" className="form-label">Foto</label>
                      <input type="file" id="profilePic" name="profilePic" className="form-control" onChange={handleProfilePicChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                    <button type="button" className="btn cancel-btn" onClick={handleCancelClick}>Cancelar</button>
                  </form>
                ) : (
                  <button className="btn btn-warning" onClick={handleEditClick}><FaEdit /></button>
                )}

                <div className="gallery-section">
                  <h2>Tus Fotos</h2>
                  <div className="gallery">
                    {photos.length > 0 ? photos.map((p, i) => <img key={i} src={p.url} alt={`Foto ${i}`} />) : <p>No hay fotos.</p>}
                  </div>
                </div>

                <div className="appointments-section">
                  <h2>Citas</h2>
                  <ul>{appointments.map((a, i) => <li key={i}>{a.date} - {a.time}: {a.description}</li>)}</ul>
                </div>

                <div className="pets-section">
                  <h2>Mis Mascotas</h2>
                  <ul>{pets.map((p, i) => <li key={i}>{p.name} ({p.breed})</li>)}</ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Perfil;