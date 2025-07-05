import React from 'react';
import { fetchProductos, deleteProducto } from '../api';
import ProductoForm from './ProductoForm';

const ProductoList = ({ productos, onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (isConfirmed) {
      const success = await deleteProducto(id);
      if (success) {
        onDelete(id);
        alert('Producto eliminado con éxito');
      } else {
        alert('Hubo un error al eliminar el producto');
      }
    }
  };

  return (
    <div>
      <h2 className="my-4">Listado de Productos</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>
                {producto.imagen && (  
                  <img 
                    src={`${producto.imagen}`} 
                    alt="Producto" 
                    style={{ maxWidth: '100px', maxHeight: '100px' }} 
                  />
                )}
              </td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => onEdit(producto)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoList;
