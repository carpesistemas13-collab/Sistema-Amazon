import React, { useState } from 'react';
import AddBrandForm from './AddBrandForm';
import AddLensForm from './AddLensForm';

const AddButtons = () => {
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [showAddLensForm, setShowAddLensForm] = useState(false);

  return (
    <div className="add-buttons-container">
      <button className="toggle-form-button" onClick={() => setShowAddBrandForm(true)}>Añadir Nueva Marca</button>
      <button className="toggle-form-button" onClick={() => setShowAddLensForm(true)}>Añadir Nuevo Lente</button>

      {showAddBrandForm && <AddBrandForm onClose={() => setShowAddBrandForm(false)} />}
      {showAddLensForm && <AddLensForm onClose={() => setShowAddLensForm(false)} />}
    </div>
  );
};

export default AddButtons;