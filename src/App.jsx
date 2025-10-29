import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [lenses, setLenses] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [newLens, setNewLens] = useState({
    modelo: '',
    marca_id: '',
    precio: '',
    descuento: '',
    numero_de_lote: '',
    estado: 'En inventario',
    codigo_identificacion: '',
    existencias: 0, // Nuevo campo para existencias
  });
  const [showForm, setShowForm] = useState(false);
  const [editingLensId, setEditingLensId] = useState(null); // Nuevo estado para el ID del lente en edición

  useEffect(() => {
    getLenses();
    getMarcas();
  }, []);

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

  const getLenses = async () => {
    const { data, error } = await supabase.from('lentes').select('*');
    if (error) {
      console.error('Error fetching lenses:', error);
    } else {
      // console.log('Datos de lentes recuperados de Supabase:', data); // DEBUG
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
      // Excluir precio_final al insertar, ya que es una columna generada en Supabase
      const { precio_final, ...lensToInsert } = newLens;

      const { data, error } = await supabase.from('lentes').insert([lensToInsert]);

      if (error) {
        console.error('Error al añadir lente:', error);
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
    const { precio_final, ...lensToUpdate } = newLens;
    const { error } = await supabase
      .from('lentes')
      .update(lensToUpdate)
      .eq('id', editingLensId);

    if (error) {
      console.error('Error al actualizar lente:', error);
    } else {
      getLenses();
      setShowForm(false);
      setEditingLensId(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este lente? Esta acción no se puede deshacer.')) {
      const { error } = await supabase.from('lentes').delete().eq('id', id);
      if (error) {
        console.error('Error al eliminar lente:', error);
      } else {
        getLenses();
      }
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
      <h1>Inventario de Lentes</h1>

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
                  <button onClick={() => handleDelete(lens.id)}>Eliminar</button>
                  <button onClick={() => handleEditClick(lens)}>Editar</button>
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
