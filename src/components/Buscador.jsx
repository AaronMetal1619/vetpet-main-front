import React, { useState } from 'react';

const Buscador = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Llama a la función onSearch con el valor ingresado
  };

  return (
    <div className="input-group shadow-sm rounded w-25">
      <input
        type="text"
        className="form-control border-right-0 rounded-start"
        placeholder="Buscar producto..."
        value={query}
        onChange={handleChange} // Actualiza la query cada vez que el usuario escribe
      />
      <button className="btn btn-outline-primary rounded-end px-4">
        Buscar
      </button>
    </div>
  );
};

export default Buscador;
