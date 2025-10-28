const express = require('express');
const path = require('path');

const app = express();

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/lentes', require('./routes/lensRoutes'));
app.use('/api/marcas', require('./routes/brandRoutes'));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

// Para cualquier otra ruta, servir el index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
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