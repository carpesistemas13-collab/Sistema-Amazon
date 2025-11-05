import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const LensesFilters = ({ onFilterChange }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('marcas')
        .select('nombre');

      if (error) {
        console.error('Error fetching brands:', error.message);
      } else {
        setBrands(data.map(b => b.nombre));
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    onFilterChange({ batchNumber, model, brand });
  }, [batchNumber, model, brand, onFilterChange]);

  const handleClearFilters = () => {
    setBatchNumber('');
    setModel('');
    setBrand('');
    // onFilterChange will be called by the useEffect after state updates
  };

  return (
    <div className="filters-wrapper">
      <div className="filter-container">
        <label htmlFor="filterLotNumber">Filtrar por Número de Lote:</label>
        <input
          type="text"
          id="filterLotNumber"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          placeholder="Introduce número de lote"
        />
      </div>
      <div className="filter-container">
        <label htmlFor="filterModel">Filtrar por Modelo:</label>
        <input
          type="text"
          id="filterModel"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Introduce modelo"
        />
      </div>
      <div className="filter-container">
        <label htmlFor="filterBrand">Filtrar por Marca:</label>
        <select
          id="filterBrand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <button className="clear-filters-button" onClick={handleClearFilters}>Limpiar Filtros</button>
    </div>
  );
};

export default LensesFilters;