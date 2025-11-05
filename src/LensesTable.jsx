import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LensesTable = ({ filters }) => {
  const [lenses, setLenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLenses(filters);
  }, [filters]);

  async function getLenses(currentFilters) {
    setLoading(true);
    try {
      let query = supabase
          .from('lentes')
          .select('id, modelo, marca_id, precio, descuento, precio_final, estado, existencias, numero_de_lote, codigo_identificacion, marcas!inner(nombre)');

      if (currentFilters.batchNumber) {
        query = query.ilike('numero_de_lote', `%${currentFilters.batchNumber}%`);
      }
      if (currentFilters.model) {
        query = query.ilike('modelo', `%${currentFilters.model}%`);
      }
      if (currentFilters.brand) {
        query = query.ilike('marcas.nombre', `%${currentFilters.brand}%`);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        setLenses([]);
      } else {
        setLenses(data);
      }
    } catch (err) {
      setError('Failed to fetch lenses.');
      setLenses([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lente?')) {
      const { error } = await supabase
        .from('lentes')
        .delete()
        .eq('id', id);

      if (error) {
        setError('Error al eliminar el lente.');
      } else {
        setLenses(lenses.filter((lens) => lens.id !== id));
      }
    }
  };

  const handleEdit = (id) => {
    // Implement edit functionality or navigate to an edit page
    console.log('Edit lens with ID:', id);
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Lentes', 14, 16);
    doc.autoTable({
      startY: 20,
      head: [['Modelo', 'Marca', 'Precio', 'Descuento', 'Precio Final', 'Existencias', 'Número de Lote', 'Estado', 'Código Identificación']],
      body: lenses.map(lens => [
        lens.modelo,
        lens.marcas.nombre,
        `$${lens.precio.toFixed(2)}`,
        `${lens.descuento}%`,
        `$${lens.precio_final.toFixed(2)}`,
        lens.existencias,
        lens.numero_de_lote,
        lens.estado,
        lens.codigo_identificacion,
      ]),
    });
    doc.save('reporte_lentes.pdf');
  };

  if (loading) {
    return <p>Cargando lentes...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="lenses-table-container">
      <h2>Lentes Disponibles</h2>
      <p>Total de lentes registrados: {lenses.length}</p>
      <button onClick={generatePdf} className="generate-report-button">Generar Reporte PDF</button>
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
            <tr key={lens.id}>
              <td>{lens.modelo}</td>
              <td>{lens.marcas ? lens.marcas.nombre : 'N/A'}</td>
              <td>${lens.precio.toFixed(2)}</td>
              <td>{lens.descuento}%</td>
              <td>${lens.precio_final.toFixed(2)}</td>
              <td>{lens.existencias}</td>
              <td>{lens.numero_de_lote}</td>
              <td>{lens.estado}</td>
              <td>{lens.codigo_identificacion}</td>
              <td>
                <button onClick={() => handleDelete(lens.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} /> Eliminar
                </button>
                <button onClick={() => handleEdit(lens.id)}>
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