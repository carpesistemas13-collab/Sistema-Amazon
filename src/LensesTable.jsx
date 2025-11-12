import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const LensesTable = ({ lenses, marcas, handleDelete, handleEditClick }) => {

  if (!lenses || lenses.length === 0) {
    return <p>No hay lentes disponibles.</p>;
  }

  return (
    <div className="lenses-table-container">
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Precio Final</th>
            <th>Existencias</th>
            <th>Número de Lote</th>
            <th>Estado</th>
            <th>Código Identificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lenses.map((lens) => (
            <tr key={lens.id} className={lens.estado === 'Baja' ? 'status-baja' : ''}>
              <td>{lens.modelo}</td>
              <td>{marcas.find((m) => m.id === lens.marca_id)?.nombre || 'N/A'}</td>
              <td>${(parseFloat(lens.precio) || 0).toFixed(2)}</td>
              <td>{lens.descuento}%</td>
              <td>${(parseFloat(lens.precio_final) || 0).toFixed(2)}</td>
              <td>{lens.existencias}</td>
              <td>{lens.numero_de_lote}</td>
              <td>{lens.estado}</td>
              <td>{lens.codigo_identificacion}</td>
              <td>
                <button onClick={() => handleDelete(lens.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                </button>
                <button onClick={() => handleEditClick(lens)}>
                  <FontAwesomeIcon icon={faEdit} /> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LensesTable;