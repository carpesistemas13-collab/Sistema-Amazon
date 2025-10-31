import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importar autoTable directamente


function App() {
  const [lenses, setLenses] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [newLens, setNewLens] = useState({
    modelo: '',
    marca_id: '',
    precio: '',
    descuento: '',
    existencias: '',
    numero_de_lote: '',
    estado: '',
    codigo_identificacion: '',
  });

  const [newMarca, setNewMarca] = useState('');
  const [showMarcaForm, setShowMarcaForm] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingLensId, setEditingLensId] = useState(null); // Nuevo estado para el ID del lente en edición
  const [filterLotNumber, setFilterLotNumber] = useState(''); // Nuevo estado para el filtro de número de lote
  const [filterModel, setFilterModel] = useState(''); // Nuevo estado para el filtro de modelo
  const [reportLotNumber, setReportLotNumber] = useState(''); // Nuevo estado para el número de lote del reporte
  const [notification, setNotification] = useState(null); // { message: '', type: 'success' | 'error' }
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lensToDeleteId, setLensToDeleteId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false); // Estado para controlar la visibilidad del modal de reporte
  const [lotNumberForReport, setLotNumberForReport] = useState(''); // Estado para el número de lote a reportar

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Ocultar después de 3 segundos
  };

  useEffect(() => {
    getLenses();
    getMarcas();
  }, []);

  useEffect(() => {
    getLenses(filterLotNumber, filterModel);
  }, [filterLotNumber, filterModel]);

  useEffect(() => {
    if (showForm && !editingLensId) {
      const initialNewLensState = {
        modelo: '',
        marca_id: '',
        precio: '',
        descuento: '',
        numero_de_lote: '',
        estado: 'En inventario',
        codigo_identificacion: '',
        existencias: 0, // Nuevo campo para existencias
      };
      setNewLens(initialNewLensState);
      console.log('Formulario abierto, newLens reiniciado a:', initialNewLensState); // DEBUG
    }
  }, [showForm, editingLensId]);

  // console.log('Marcas:', marcas); // Para depurar el problema de las marcas

  const getLenses = async (lotNumber = '', model = '') => {
    let query = supabase.from('lentes').select('*');

    if (lotNumber) {
      query = query.ilike('numero_de_lote', `%${lotNumber}%`);
    }

    if (model) {
      query = query.ilike('modelo', `%${model}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching lenses:', error);
    } else {
      setLenses(data);
    }
  };

  const getMarcas = async () => {
    const { data, error } = await supabase.from('marcas').select('*');
    if (error) {
      console.error('Error fetching brands:', error);
    } else {
      setMarcas(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingLensId) {
      await handleUpdate();
    } else {
      // Validación de campos obligatorios
      if (!newLens.numero_de_lote || !newLens.modelo || !newLens.precio || !newLens.existencias || !newLens.codigo_identificacion) {
        showNotification('Por favor, completa todos los campos obligatorios.', 'error');
        return;
      }
      // Excluir precio_final columna auto generada por supabase
      const { precio_final, ...lensToInsert } = newLens;

      const { data, error } = await supabase.from('lentes').insert([lensToInsert]);

      if (error) {
        console.error('Error al añadir lente:', error);
        showNotification('Error al añadir lente.', 'error');
      } else {
        setNewLens({
          modelo: '',
          marca_id: '',
          precio: '',
          descuento: '',
          numero_de_lote: '',
          estado: 'En inventario',
          codigo_identificacion: '',
          existencias: 0, // Reiniciar existencias también
        });
        getLenses();
        setShowForm(false);
        showNotification('Lente añadido exitosamente.', 'success');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLens((prev) => ({
      ...prev,
      [name]: name === 'precio' || name === 'descuento' || name === 'existencias' ? parseFloat(value) : value,
    }));
  };

  const handleEditClick = (lens) => {
    setEditingLensId(lens.id);
    setNewLens(lens);
    setShowForm(true);
  };

  const handleUpdate = async () => {
    // Validación de campos obligatorios
    if (!newLens.numero_de_lote || !newLens.modelo || !newLens.precio || !newLens.existencias || !newLens.codigo_identificacion) {
      showNotification('Por favor, completa todos los campos obligatorios.', 'error');
      return;
    }

    const { precio_final, ...lensToUpdate } = newLens;
    const { error } = await supabase
      .from('lentes')
      .update(lensToUpdate)
      .eq('id', editingLensId);

    if (error) {
      console.error('Error al actualizar lente:', error);
      showNotification('Error al actualizar lente.', 'error');
    } else {
      getLenses();
      setShowForm(false);
      setEditingLensId(null);
      showNotification('Lente actualizado exitosamente.', 'success');
    }
  };

  const handleDelete = (id) => {
    setLensToDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (lensToDeleteId) {
      const { error } = await supabase.from('lentes').delete().eq('id', lensToDeleteId);

      if (error) {
        console.error('Error al eliminar lente:', error);
        showNotification('Error al eliminar lente.', 'error');
      } else {
        getLenses();
        showNotification('Lente eliminado exitosamente.', 'success');
      }
      setLensToDeleteId(null);
      setShowConfirmModal(false);
    }
  };

  const cancelDelete = () => {
    setLensToDeleteId(null);
    setShowConfirmModal(false);
  };

  const clearFilters = () => {
    setFilterModel('');
    setFilterLotNumber('');
  };

  const generatePdfReport = async () => {
    setShowReportModal(true);
  };

  const handleGenerateReportFromModal = async () => {
    if (!lotNumberForReport) {
      showNotification('Por favor, introduce un número de lote para generar el reporte.', 'error');
      return;
    }

    showNotification(`Generando reporte para el lote: ${lotNumberForReport}`, 'success');

    const { data: lensesData, error } = await supabase
      .from('lentes')
      .select('*')
      .eq('numero_de_lote', lotNumberForReport);

    if (error) {
      console.error('Error al obtener lentes para el reporte:', error);
      showNotification('Error al obtener lentes para el reporte.', 'error');
      return;
    }

    if (lensesData.length === 0) {
      showNotification(`No se encontraron lentes para el número de lote: ${lotNumberForReport}`, 'error');
      return;
    }

    const doc = new jsPDF();

    // Título del reporte
    doc.setFontSize(18);
    doc.text(`Reporte de Lentes - Lote: ${lotNumberForReport}`, 14, 22);

    // Preparar los datos para autoTable
    const tableColumn = [
      "Modelo",
      "Marca",
      "Precio",
      "Descuento",
      "Precio Final",
      "Existencias",
      "Estado",
      "Código Identificación",
    ];

    const tableRows = lensesData.map((lens) => [
      lens.modelo,
      marcas.find((m) => m.id === lens.marca_id)?.nombre || 'N/A',
      `$${lens.precio.toFixed(2)}`,
      `${lens.descuento}%`,
      `$${lens.precio_final.toFixed(2)}`,
      lens.existencias,
      lens.estado,
      lens.codigo_identificacion,
    ]);

    
    autoTable(doc, { // Llamar autoTable como función, pasando el doc
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [22, 160, 133] }, 
      bodyStyles: { textColor: [50, 50, 50] },
      theme: 'striped', 
      margin: { top: 10 },
      didDrawPage: function (data) {
        // Footer
        let str = 'Página ' + doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
    });

    doc.save(`reporte_lote_${lotNumberForReport}.pdf`);
    showNotification('Reporte PDF generado exitosamente.', 'success');
    setShowReportModal(false); // Cierra el modal después de generar el reporte
    setLotNumberForReport(''); // Limpia el campo del número de lote
  };

  const handleAddMarca = async () => {
    if (!newMarca.trim()) {
      alert('El nombre de la marca no puede estar vacío.');
      return;
    }
    const { data, error } = await supabase.from('marcas').insert([{ nombre: newMarca }]);
    if (error) {
      console.error('Error al añadir marca:', error);
    } else {
      setNewMarca('');
      getMarcas();
    }
  };

  const calculatePrecioFinal = (precio, descuento) => {
    const pc = parseFloat(precio);
    const desc = parseFloat(descuento);
    if (!isNaN(pc) && !isNaN(desc)) {
      const finalPrice = pc - (pc * (desc / 100));
      return finalPrice;
    }
    return 0;
  };

  return (
    <div className="App">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que quieres eliminar este lente? Esta acción no se puede deshacer.</p>
            <div className="confirm-modal-buttons">
              <button onClick={confirmDelete} className="confirm-button">Confirmar</button>
              <button onClick={cancelDelete} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <h2>Generar Reporte PDF</h2>
            <p>Introduce el número de lote para el reporte:</p>
            <input
              type="text"
              value={lotNumberForReport}
              onChange={(e) => setLotNumberForReport(e.target.value)}
              placeholder="Número de Lote"
            />
            <div className="report-modal-buttons">
              <button onClick={handleGenerateReportFromModal} className="confirm-button">Generar</button>
              <button onClick={() => setShowReportModal(false)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <h1>Gestión de Lentes</h1>

      <button onClick={() => setShowMarcaForm(!showMarcaForm)} className="toggle-form-button">
        {showMarcaForm ? 'Ocultar Formulario de Marca' : 'Añadir Nueva Marca'}
      </button>

      {showMarcaForm && (
        <div className="marca-form-container">
          <h2>Añadir Nueva Marca</h2>
          <input
            type="text"
            placeholder="Nombre de la Marca"
            value={newMarca}
            onChange={(e) => setNewMarca(e.target.value)}
          />
          <button onClick={handleAddMarca}>Añadir Marca</button>
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
        {showForm ? 'Ocultar Formulario' : 'Añadir Nuevo Lente'}
      </button>

      {showForm && ( // Renderizado condicional del formulario
        <form onSubmit={handleSubmit}>
          <h2>{editingLensId ? 'Editar Lente' : 'Añadir Nuevo Lente'}</h2>
          <div>
            <label>Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={newLens.modelo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Marca:</label>
            <select
              name="marca_id"
              value={newLens.marca_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Precio Compra:</label>
            <input
              type="number"
              name="precio"
              value={newLens.precio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Descuento:</label>
            <input
              type="number"
              name="descuento"
              value={newLens.descuento}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Número de Lote:</label>
            <input
              type="text"
              name="numero_de_lote"
              value={newLens.numero_de_lote}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Existencias:</label>
            <input
              type="number"
              name="existencias"
              value={newLens.existencias}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Estado:</label>
            <select
              name="estado"
              value={newLens.estado}
              onChange={handleInputChange}
            >
              <option value="En inventario">En inventario</option>
              <option value="Publicado">Publicado</option>
              <option value="Vendido">Vendido</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div> {/* Nuevo campo para codigo_identificacion */}
            <label>Código de Identificación:</label>
            <input
              type="text"
              name="codigo_identificacion"
              value={newLens.codigo_identificacion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Precio Final:</label>
            <input
              type="text"
              name="precio_final"
              value={((parseFloat(newLens.precio) || 0) * (1 - (parseFloat(newLens.descuento) || 0) / 100)).toFixed(2)}
              readOnly
            />
          </div>
          <button type="submit">{editingLensId ? 'Actualizar Lente' : 'Añadir Lente'}</button>
        </form>
      )}

      <h2>Lentes Disponibles</h2>
      <div className="filters-wrapper">
        <div className="filter-container">
          <label htmlFor="lotFilter">Filtrar por Número de Lote:</label>
          <input
            type="text"
            id="lotFilter"
            value={filterLotNumber}
            onChange={(e) => setFilterLotNumber(e.target.value)}
            placeholder="Introduce número de lote"
          />
        </div>
        <div className="filter-container">
          <label htmlFor="modelFilter">Filtrar por Modelo:</label>
          <input
            type="text"
            id="modelFilter"
            value={filterModel}
            onChange={(e) => setFilterModel(e.target.value)}
            placeholder="Introduce modelo"
          />
        </div>
        <button onClick={clearFilters} className="clear-filters-button">Limpiar Filtros</button>
      </div>

      <div className="report-section">
          <button onClick={generatePdfReport} className="generate-report-button">Generar Reporte PDF</button>
        </div>

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
              <tr key={lens.id}>
                <td data-label="Modelo">{lens.modelo}</td>
                <td data-label="Marca">{marcas.find((m) => m.id === lens.marca_id)?.nombre || 'N/A'}</td>
                <td data-label="Precio">${lens.precio.toFixed(2)}</td>
                <td data-label="Descuento">{lens.descuento}%</td>
                <td data-label="Precio Final">${lens.precio_final.toFixed(2)}</td>
                <td data-label="Existencias">{lens.existencias}</td>
                <td data-label="Número de Lote">{lens.numero_de_lote}</td>
                <td data-label="Estado">{lens.estado}</td>
                <td data-label="Código Identificación">{lens.codigo_identificacion}</td>
                <td>
                  <button onClick={() => handleDelete(lens.id)}><FontAwesomeIcon icon={faTrash} /> Eliminar</button>
                  <button onClick={() => handleEditClick(lens)}><FontAwesomeIcon icon={faEdit} /> Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
