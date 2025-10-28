import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [lentes, setLentes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newLens, setNewLens] = useState({
    modelo: '',
    marca_id: '',
    precio: '',
    descuento: '',
    existencias: '',
    numero_de_lote: '',
    estado: 'En inventario',
  });

  useEffect(() => {
    getLentes();
    getMarcas();
  }, []);

  const calculatePrecioFinal = () => {
    const precio = parseFloat(newLens.precio);
    const descuento = parseFloat(newLens.descuento);
    if (!isNaN(precio) && !isNaN(descuento)) {
      return (precio * (1 - descuento)).toFixed(2);
    }
    return '0.00';
  };

  async function getLentes() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lentes')
        .select('*, marcas(nombre)'); // Incluir el nombre de la marca

      if (error) {
        throw error;
      }
      setLentes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getMarcas() {
    try {
      const { data, error } = await supabase
        .from('marcas')
        .select('id, nombre');

      if (error) {
        throw error;
      }
      setMarcas(data);
    } catch (error) {
      console.error("Error al cargar marcas:", error.message);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLens({ ...newLens, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('lentes')
        .insert([{
          modelo: newLens.modelo,
          marca_id: newLens.marca_id,
          precio: parseFloat(newLens.precio),
          descuento: parseFloat(newLens.descuento || 0),
          existencias: parseInt(newLens.existencias),
          numero_de_lote: newLens.numero_de_lote,
          estado: newLens.estado,
        }]);

      if (error) {
        throw error;
      }
      setNewLens({
        modelo: '',
        marca_id: '',
        precio: '',
        descuento: '',
        existencias: '',
        numero_de_lote: '',
        estado: 'En inventario',
      });
      getLentes(); // Refrescar la lista de lentes
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Cargando lentes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="App">
      <h1>Inventario de Lentes</h1>

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
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={newLens.precio}
            onChange={handleInputChange}
            step="0.01"
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
            step="0.01"
            min="0"
            max="1"
          />
        </div>
        <div>
          <label>Precio Final:</label>
          <input
            type="text"
            value={calculatePrecioFinal()}
            readOnly
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
            required
          >
            <option value="En inventario">En inventario</option>
            <option value="Publicado">Publicado</option>
            <option value="Vendido">Vendido</option>
          </select>
        </div>
        <button type="submit">Añadir Lente</button>
      </form>

      <h2>Lista de Lentes</h2>
      <ul>
        {lentes.map((lente) => (
          <li key={lente.id}>
            {lente.modelo} - {lente.marcas ? lente.marcas.nombre : 'N/A'} - ${lente.precio_final} ({lente.existencias} en stock) - Lote: {lente.numero_de_lote} - Estado: {lente.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
