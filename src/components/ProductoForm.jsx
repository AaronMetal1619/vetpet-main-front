import React, { useState, useEffect } from 'react';
import { createProducto, updateProducto } from '../api';

const ProductoForm = ({ productoEdit, onSubmit }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: null, 
  });
  
  useEffect(() => {
    if (productoEdit) {
      setProducto(productoEdit);
    } else {
      setProducto({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        imagen: null, 
      });
    }
  }, [productoEdit]);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  // Manejo de la subida de la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProducto({ ...producto, imagen: file }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', producto.nombre);
    formData.append('descripcion', producto.descripcion);
    formData.append('precio', producto.precio);
    formData.append('stock', producto.stock);

    if (producto.imagen instanceof File) {
      formData.append('imagen', producto.imagen); 
    }

    let updatedProduct;
    if (producto.id) {
      formData.append('_method', 'PUT');
      updatedProduct = await updateProducto(producto.id, formData);
    } else {
      updatedProduct = await createProducto(formData);
    }

    onSubmit(updatedProduct);
    window.location.reload();
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h2 className="text-center text-primary mb-4">
        {producto.id ? 'Editar Producto' : 'Agregar Producto'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            className="form-control"
            placeholder="Nombre del producto"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            className="form-control"
            placeholder="Descripción del producto"
            rows="3"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="precio" className="form-label">Precio</label>
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            className="form-control"
            placeholder="Precio del producto"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            className="form-control"
            placeholder="Cantidad en stock"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="imagen" className="form-label">Imagen del Producto</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
          {producto.imagen && (
            <img
              src={producto.imagen instanceof File ? URL.createObjectURL(producto.imagen) : producto.imagen}
              alt="Vista previa"
              className="mt-3"
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          )}
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary btn-sm w-23 mx-auto">
            {producto.id ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;
