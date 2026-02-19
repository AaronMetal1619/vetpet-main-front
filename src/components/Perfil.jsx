import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSave, FaUserMd, FaNotesMedical, FaFileMedicalAlt, FaEdit, FaPhone, FaEnvelope, FaBirthdayCake, FaArrowLeft } from "react-icons/fa";
import "../Estilos/Perfil.css";

function Perfil() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  // --- ESTADOS ---
  const [isEditing, setIsEditing] = useState(false); // NUEVO: Controla si vemos la tarjeta o el formulario
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Estado de los datos
  const [formData, setFormData] = useState({
    ID_USUARIO: storedUser?.id_usuario || storedUser?.ID_USUARIO || "",
    NOMBRE_COMPLETO: "",
    CORREO: "",
    TELEFONO: "",
    FECHA_NACIMIENTO: "",
    TIPO_SANGRE: "",
    ALERGIAS_PRINCIPALES: "",
    SEXO: "F",
  });

  // Estado de la foto
  const [previewImage, setPreviewImage] = useState("https://cdn-icons-png.flaticon.com/512/6075/6075889.png");
  const [selectedFile, setSelectedFile] = useState(null);

  // --- FUNCIÓN AUXILIAR PARA LA FECHA ---
  // Corta la parte de la hora que manda Oracle (YYYY-MM-DD HH:MM:SS -> YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split(' ')[0]; // O .split('T')[0] si viene formato ISO
  };

  // --- CARGA DE DATOS ---
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const userId = storedUser?.id_usuario || storedUser?.ID_USUARIO;
        if (!userId) return;

        const response = await axios.get(`http://127.0.0.1:8000/api/pacientes/perfil/${userId}`);
        const data = response.data;

        setFormData((prev) => ({
          ...prev,
          NOMBRE_COMPLETO: data.NOMBRE_COMPLETO || data.nombre_completo || prev.NOMBRE_COMPLETO,
          CORREO: data.CORREO || data.correo || prev.CORREO,
          TELEFONO: data.TELEFONO || data.telefono || "",
          // APLICAMOS LA CORRECCIÓN DE FECHA AQUÍ
          FECHA_NACIMIENTO: formatDateForInput(data.FECHA_NACIMIENTO || data.fecha_nacimiento),
          TIPO_SANGRE: data.TIPO_SANGRE || data.tipo_sangre || "",
          ALERGIAS_PRINCIPALES: data.ALERGIAS_PRINCIPALES || data.alergias_principales || "",
          SEXO: data.SEXO || data.sexo || "F",
        }));

        if (data.FOTO_PERFIL) {
          setPreviewImage(data.FOTO_PERFIL);
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    fetchProfileData();
  }, [token, navigate]);

  // --- MANEJADORES ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const dataToSend = new FormData();
    // Agregamos todos los campos al FormData
    Object.keys(formData).forEach(key => {
        dataToSend.append(key, formData[key] || ""); // Enviar cadena vacía si es null
    });
    
    if (selectedFile) {
      dataToSend.append("FOTO_PERFIL", selectedFile);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/pacientes/perfil",
        dataToSend,
        { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } }
      );

      setMessage({ type: "success", text: "¡Perfil actualizado!" });
      
      // Volvemos al modo "Tarjeta" después de guardar
      setTimeout(() => {
          setIsEditing(false);
          setMessage({ type: "", text: "" }); // Limpiar mensaje
      }, 1500);

    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error al guardar." });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZADO CONDICIONAL ---

  // 1. VISTA DE SOLO LECTURA (TIPO LINKEDIN)
  if (!isEditing) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card shadow border-0 rounded-4 overflow-hidden">
              {/* Banner Decorativo */}
              <div className="bg-primary" style={{ height: "150px", background: "linear-gradient(90deg, #f189f1cf 0%, #c36eeae9 100%)" }}></div>
              
              <div className="card-body px-5 pb-5">
                <div className="row align-items-end" style={{ marginTop: "-80px" }}>
                  {/* Foto de Perfil */}
                  <div className="col-lg-3 text-center text-lg-start">
                    <img
                      src={previewImage}
                      alt="Perfil"
                      className="rounded-circle border border-4 border-white shadow"
                      style={{ width: "160px", height: "160px", objectFit: "cover", backgroundColor: "#fff" }}
                    />
                  </div>
                  {/* Nombre y Botón Editar */}
                  <div className="col-lg-9 d-flex justify-content-between align-items-center flex-wrap pt-4 pt-lg-0">
                    <div>
                      <h2 className="fw-bold mb-0">{formData.NOMBRE_COMPLETO || "Usuario VitaFem"}</h2>
                      <p className="text-muted mb-0">{formData.CORREO}</p>
                    </div>
                    <button 
                        className="btn btn-outline-primary rounded-pill px-4 mt-3 mt-lg-0"
                        onClick={() => setIsEditing(true)} // ACTIVA EL MODO EDICIÓN
                    >
                        <FaEdit className="me-2" /> Editar Perfil
                    </button>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Resumen de Datos */}
                <div className="row g-4">
                  <div className="col-md-6">
                    <h5 className="text-primary fw-bold mb-3"><FaUserMd className="me-2"/> Información Personal</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2"><FaPhone className="text-muted me-2"/> <strong>Teléfono:</strong> {formData.TELEFONO || "No registrado"}</li>
                      <li className="mb-2"><FaBirthdayCake className="text-muted me-2"/> <strong>Nacimiento:</strong> {formData.FECHA_NACIMIENTO || "No registrado"}</li>
                      <li className="mb-2"><strong>Sexo:</strong> {formData.SEXO === "F" ? "Femenino" : "Masculino"}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h5 className="text-danger fw-bold mb-3"><FaNotesMedical className="me-2"/> Resumen Médico</h5>
                    <div className="bg-light p-3 rounded-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Tipo de Sangre:</span>
                            <span className="badge bg-danger">{formData.TIPO_SANGRE || "N/A"}</span>
                        </div>
                        <p className="mb-1 text-muted small fw-bold">Alergias:</p>
                        <p className="mb-0 small">{formData.ALERGIAS_PRINCIPALES || "Ninguna registrada"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. VISTA DE EDICIÓN (FORMULARIO)
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
            {/* Botón para cancelar/regresar */}
            <button className="btn btn-link text-decoration-none text-muted mb-3 ps-0" onClick={() => setIsEditing(false)}>
                <FaArrowLeft className="me-2" /> Volver al perfil
            </button>

          <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
             <div className="bg-light p-4 text-center">
                 <h3 className="fw-bold text-primary">Editando mi Expediente</h3>
                 <p className="text-muted small">Actualiza tu información personal y médica</p>
             </div>
             
             <div className="card-body p-4">
                {/* Previsualización de foto en modo edición */}
                <div className="text-center mb-4">
                    <div className="position-relative d-inline-block">
                        <img src={previewImage} className="rounded-circle shadow-sm" style={{ width: "120px", height: "120px", objectFit: "cover" }} alt="Editando" />
                        <label htmlFor="photo-upload" className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow cursor-pointer" style={{ cursor: "pointer" }}>
                          <FaCamera />
                        </label>
                        <input id="photo-upload" type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                        {/* Mismos campos de antes... */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Nombre Completo</label>
                            <input type="text" name="NOMBRE_COMPLETO" className="form-control" value={formData.NOMBRE_COMPLETO} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Teléfono</label>
                            <input type="tel" name="TELEFONO" className="form-control" value={formData.TELEFONO} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Fecha de Nacimiento</label>
                            {/* Input Date corregido */}
                            <input type="date" name="FECHA_NACIMIENTO" className="form-control" value={formData.FECHA_NACIMIENTO} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Tipo de Sangre</label>
                            <select name="TIPO_SANGRE" className="form-select" value={formData.TIPO_SANGRE} onChange={handleChange}>
                                <option value="">Selecciona</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold small text-muted">Sexo</label>
                            <select name="SEXO" className="form-select" value={formData.SEXO} onChange={handleChange}>
                                <option value="F">Femenino</option>
                                <option value="M">Masculino</option>
                            </select>
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold small text-muted">Alergias</label>
                            <textarea name="ALERGIAS_PRINCIPALES" className="form-control" rows="3" value={formData.ALERGIAS_PRINCIPALES} onChange={handleChange}></textarea>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}>{message.text}</div>
                    )}

                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? "Guardando..." : <><FaSave className="me-2"/> Guardar Cambios</>}
                        </button>
                        <button type="button" className="btn btn-light text-muted" onClick={() => setIsEditing(false)}>Cancelar</button>
                    </div>
                </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;