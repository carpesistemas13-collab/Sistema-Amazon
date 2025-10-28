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
    precio_final: 0,
    codigo_identificacion: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getLenses();
    getMarcas();
  }, []);

  // console.log('Marcas:', marcas); // Para depurar el problema de las marcas

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
      console.error('Error al añadir lente:', error);
    } else {
      setNewLens({
        modelo: '',
        marca_id: '',
        precio: '',
        descuento: '',
        numero_de_lote: '',
        estado: 'En inventario',
        precio_final: 0,
        codigo_identificacion: '',
      });
      getLenses();
      setShowForm(false);
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
