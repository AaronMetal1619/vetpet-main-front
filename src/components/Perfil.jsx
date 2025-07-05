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
  const [photos, setPhotos] = useState([]); 
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
      axios
        .get("http://127.0.0.1:8000/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data) {
            setUserData(response.data);
            setEditedUserData(response.data);
            setPhotos([ 
              { url: "https://www.mediterraneannatural.com/wp-content/uploads/2019/06/Hay-cuatro-cachorros-en-la-basura-la-historia-real-de-los-4-guerreros-2.jpg" },
              { url: "https://www.kiwoko.com/servicios/kiwokoadopta/images/profiles/pets/lavanda-67ce3dc1eeb36763591226.jfif" },
            ]);
            console.log("Datos del usuario:", response.data); 
          } else {
            console.error("No se encontraron datos del usuario.");
          }
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
        });
    } else {
      console.error("No se encontró el token de autenticación.");
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUserData(userData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUserData((prevState) => ({
        ...prevState,
        profilePic: file,
      }));
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
      const response = await axios.post(
        `http://127.0.0.1:8000/api/update-profile/${userData.id}`,
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

  if (!userData) {
    return <div>Cargando...</div>;
  }

  console.log("Rol del usuario:", userData.role); // Aquí se debe acceder a 'role' y no 'rol'

  return (
    <main>
      <br /><br />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-img-container">
            <img
              src={ 
                editedUserData.profilePic 
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
            
            {userData.role === "admin" ? ( // Cambié 'rol' por 'role'
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
                      <tr>
                        <td>1</td>
                        <td>2025-04-01</td>
                        <td>Solicitud de actualización de perfil aprobada</td>
                        <td><span className="badge bg-success">Completada</span></td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>2025-03-28</td>
                        <td>Nuevo usuario registrado en el sistema</td>
                        <td><span className="badge bg-warning">Pendiente</span></td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>2025-03-25</td>
                        <td>Revisión de seguridad completada</td>
                        <td><span className="badge bg-info">En Proceso</span></td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>2025-03-20</td>
                        <td>Error en el sistema de notificaciones</td>
                        <td><span className="badge bg-danger">Urgente</span></td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>2025-03-18</td>
                        <td>Se realizó una actualización de software en el servidor</td>
                        <td><span className="badge bg-secondary">Completada</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                {isEditing ? (
                  <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={editedUserData.name || ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={editedUserData.email || ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={editedUserData.phone || ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="profilePic" className="form-label">
                        Foto de perfil
                      </label>
                      <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        className="form-control"
                        onChange={handleProfilePicChange}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Guardar cambios
                    </button>
                    <button
                      type="button"
                      className="btn cancel-btn"
                      onClick={handleCancelClick}
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <button className="btn btn-warning" onClick={handleEditClick}>
                    <FaEdit />
                  </button>
                )}

                <div className="gallery-section">
                  <h2>Tus Fotos</h2>
                  <div className="gallery">
                    {photos.length > 0 ? (
                      photos.map((photo, index) => (
                        <img key={index} src={photo.url} alt={`Foto ${index + 1}`} />
                      ))
                    ) : (
                      <p>No hay fotos disponibles.</p>
                    )}
                  </div>
                </div>

                <div className="appointments-section">
                  <h2>Citas</h2>
                  <ul>
                    {appointments.map((appointment, index) => (
                      <li key={index}>
                        {appointment.date} - {appointment.time}: {appointment.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pets-section">
                  <h2>Mis Mascotas</h2>
                  <ul>
                    {pets.map((pet, index) => (
                      <li key={index}>
                        {pet.name} ({pet.breed})
                      </li>
                    ))}
                  </ul>
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
