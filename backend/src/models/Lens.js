const mongoose = require('mongoose');

const lensSchema = new mongoose.Schema({
  modelo: {
    type: String,
    required: [true, 'El modelo es obligatorio'],
    trim: true
  },
  marca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'La marca es obligatoria']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  descuento: {
    type: Number,
    default: 0,
    min: [0, 'El descuento no puede ser negativo'],
    max: [100, 'El descuento no puede ser mayor a 100%']
  },
  precioFinal: {
    type: Number,
    default: function() {
      return this.precio - (this.precio * this.descuento / 100);
    }
  },
  existencias: {
    type: Number,
    required: [true, 'Las existencias son obligatorias'],
    min: [0, 'Las existencias no pueden ser negativas']
  },
  numeroLote: {
    type: String,
    required: [true, 'El número de lote es obligatorio'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['Publicado', 'Vendido', 'En inventario'],
    default: 'En inventario'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware para calcular el precio final antes de guardar
lensSchema.pre('save', function(next) {
  this.precioFinal = this.precio - (this.precio * this.descuento / 100);
  next();
});

// Middleware para actualizar el precio final cuando se actualiza el precio o descuento
lensSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.precio !== undefined || update.descuento !== undefined) {
    // Si se está actualizando el precio o el descuento, necesitamos recalcular el precio final
    this.findOne().then(doc => {
      const precio = update.precio !== undefined ? update.precio : doc.precio;
      const descuento = update.descuento !== undefined ? update.descuento : doc.descuento;
      update.precioFinal = precio - (precio * descuento / 100);
      next();
    });
  } else {
    next();
  }
});

const Lens = mongoose.model('Lens', lensSchema);

module.exports = Lens;