const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario-lentes';

// Conexión a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conexión a MongoDB establecida con éxito');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });