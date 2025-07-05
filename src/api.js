const API_URL = 'http://127.0.0.1:8000/api';
export const GOOGLE_MAPS_API_KEY = 'AIzaSyBzqS6Mp_YH7LF30DX23LB4CzJDAN09TDA';

// Obtener productos
export const fetchProductos = async () => {
  const response = await fetch(`${API_URL}/productos`);
  const data = await response.json();
  return data;
};

// Crear producto con imagen
export const createProducto = async (formData) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: 'POST',
    body: formData, // Usamos FormData directamente
  });
  const data = await response.json();
  return data;
};

// Actualizar producto con imagen
export const updateProducto = async (id, formData) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'PUT', // Cambiar a PUT para actualización de producto
    body: formData,
  });
  const data = await response.json();
  return data;
};

// Eliminar producto
export const deleteProducto = async (id) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
};

export const updatePerfil = async (formData) => {
  const token = localStorage.getItem('auth_token'); // Obtener el token de autenticación

  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT', // Usar PUT para actualizar los datos
    headers: {
      'Authorization': `Bearer ${token}`, // Pasar el token de autorización
    },
    body: formData, // Enviar los datos del formulario (incluyendo la foto si es necesario)
  });

  const data = await response.json(); // Parsear la respuesta
  return data; // Retornar los datos actualizados
};