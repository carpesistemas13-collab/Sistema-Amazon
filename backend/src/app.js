const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://sistema-amazon-frontend.vercel.app' 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/api/lentes', require('./routes/lensRoutes'));
app.use('/api/marcas', require('./routes/brandRoutes'));

// Ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Inventario de Lentes',
    status: 'online',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

module.exports = app;