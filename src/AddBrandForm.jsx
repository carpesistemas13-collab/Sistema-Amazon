import React from 'react';

const AddBrandForm = ({ onClose }) => {
  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h2>Añadir Nueva Marca</h2>
        <p>Aquí irá el formulario para añadir una nueva marca.</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default AddBrandForm;