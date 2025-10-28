const express = require('express');
const router = express.Router();
const lensController = require('../controllers/lensController');

// Rutas para lentes
router.route('/')
  .get(lensController.getAllLenses)
  .post(lensController.createLens);

router.route('/:id')
  .get(lensController.getLensById)
  .put(lensController.updateLens)
  .delete(lensController.deleteLens);

// Ruta para registrar venta
router.route('/:id/sell')
  .put(lensController.sellLens);

// Ruta para generar reporte PDF
router.route('/report/:numeroLote')
  .get(lensController.generatePdfReport);

module.exports = router;