import React, { useState, useCallback } from 'react';
import { Link, Outlet } from 'react-router-dom';
import LensesTable from './LensesTable';
import AddButtons from './AddButtons';
import LensesFilters from './LensesFilters';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    batchNumber: '',
    model: '',
    brand: '',
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Inventario de lentes Amazon</h1>
        <div className="navbar-buttons">
          {/* Aquí podrías añadir un botón de cerrar sesión o enlaces a otras secciones */}
          <Link to="/login" className="navbar-button">Login</Link>
        </div>
      </nav>
      <div className="dashboard-content">
        <h1>Gestión de Lentes</h1>
        <AddButtons />
        <LensesFilters onFilterChange={handleFilterChange} />
        <LensesTable filters={filters} />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;