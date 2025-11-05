import React from 'react';

const AddLensForm = ({ onClose }) => {
  return (
    <div className="form-modal">
      <div className="form-modal-content">
        <h2>Añadir Nuevo Lente</h2>
        <p>Aquí irá el formulario para añadir un nuevo lente.</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default AddLensForm;