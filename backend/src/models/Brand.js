const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la marca es obligatorio'],
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;