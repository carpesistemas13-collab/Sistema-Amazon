import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [lenses, setLenses] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [newLens, setNewLens] = useState({
    modelo: '',
    marca_id: '',
    precio_compra: '',
    descuento: '',
    stock: '',
    numero_lote: '',
    estado: 'En inventario',
    precio_final: 0,
  });
  const [showForm, setShowForm] = useState(false); // Nuevo estado para controlar la visibilidad del formulario

  useEffect(() => {
    getLenses();
    getMarcas();
  }, []);

  const getLenses = async () => {
    const { data, error } = await supabase.from('lentes').select('*');
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

  const calculatePrecioFinal = (precio_compra, descuento) => {
    const pc = parseFloat(precio_compra);
    const desc = parseFloat(descuento);
    if (!isNaN(pc) && !isNaN(desc)) {
      return pc - (pc * desc) / 100;
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLens((prev) => {
      const updatedLens = { ...prev, [name]: value };
      if (name === 'precio_compra' || name === 'descuento') {
        updatedLens.precio_final = calculatePrecioFinal(
          updatedLens.precio_compra,
          updatedLens.descuento
        );
      }
      return updatedLens;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('lentes').insert([newLens]);
    if (error) {
      console.error('Error adding new lens:', error);
    } else {
      console.log('Lens added:', data);
      setNewLens({
        modelo: '',
        marca_id: '',
        precio_compra: '',
        descuento: '',
        stock: '',
        numero_lote: '',
        estado: 'En inventario',
        precio_final: 0,
      });
      getLenses(); // Refresh the list
      setShowForm(false); // Ocultar el formulario después de enviar
    }
  };

  return (
    <div className="App">
      <h1>Inventario de Lentes</h1>

      <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
        {showForm ? 'Ocultar Formulario' : 'Añadir Nuevo Lente'}
      </button>

      {showForm && ( // Renderizado condicional del formulario
        <form onSubmit={handleSubmit}>
          <h2>Añadir Nuevo Lente</h2>
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
              name="precio_compra"
              value={newLens.precio_compra}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Descuento (%):</label>
            <input
              type="number"
              name="descuento"
              value={newLens.descuento}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Precio Final:</label>
            <input
              type="text"
              name="precio_final"
              value={newLens.precio_final.toFixed(2)}
              readOnly
            />
          </div>
          <div>
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={newLens.stock}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Número de Lote:</label>
            <input
              type="text"
              name="numero_lote"
              value={newLens.numero_lote}
              onChange={handleInputChange}
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
          <button type="submit">Añadir Lente</button>
        </form>
      )}

      <h2>Lentes Disponibles</h2>
      <ul>
        {lenses.map((lens) => (
          <li key={lens.id}>
            {lens.modelo} - {marcas.find((m) => m.id === lens.marca_id)?.nombre || 'N/A'} - Lote: {lens.numero_lote} - Estado: {lens.estado} - Precio Final: ${lens.precio_final.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
