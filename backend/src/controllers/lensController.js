const Lens = require('../models/Lens');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Obtener todos los lentes
exports.getAllLenses = async (req, res) => {
  try {
    const { modelo, marca, numeroLote, estado } = req.query;
    const filters = {};

    if (modelo) filters.search = modelo; // Asumiendo que 'modelo' se mapea a 'name' en Supabase para búsqueda
    if (marca) filters.brand = marca;
    if (numeroLote) filters.numeroLote = numeroLote;
    if (estado) filters.estado = estado;

    const lenses = await Lens.findAll(filters);
    res.status(200).json({
      success: true,
      count: lenses.length,
      data: lenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los lentes',
      error: error.message
    });
  }
};

// Obtener un lente por ID
exports.getLensById = async (req, res) => {
  try {
    const lens = await Lens.findById(req.params.id);
    
    if (!lens) {
      return res.status(404).json({
        success: false,
        message: 'Lente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: lens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el lente',
      error: error.message
    });
  }
};

// Crear un nuevo lente
exports.createLens = async (req, res) => {
  try {
    const lens = await Lens.create(req.body);
    
    res.status(201).json({
      success: true,
      data: lens
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el lente',
      error: error.message
    });
  }
};

// Actualizar un lente
exports.updateLens = async (req, res) => {
  try {
    const lens = await Lens.update(
      req.params.id,
      req.body
    );

    if (!lens) {
      return res.status(404).json({
        success: false,
        message: 'Lente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: lens
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el lente',
      error: error.message
    });
  }
};

// Eliminar un lente
exports.deleteLens = async (req, res) => {
  try {
    const lens = await Lens.delete(req.params.id);

    if (!lens) {
      return res.status(404).json({
        success: false,
        message: 'Lente no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el lente',
      error: error.message
    });
  }
};

// Registrar venta de lente
exports.sellLens = async (req, res) => {
  try {
    const lens = await Lens.findById(req.params.id);

    if (!lens) {
      return res.status(404).json({
        success: false,
        message: 'Lente no encontrado'
      });
    }

    // Verificar si hay existencias
    if (lens.existencias <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay existencias disponibles para este lente'
      });
    }

    // Actualizar existencias y estado
    const updatedLens = await Lens.updateStock(req.params.id, -1);

    res.status(200).json({
      success: true,
      data: updatedLens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar la venta',
      error: error.message
    });
  }
};

// Generar reporte PDF por número de lote
exports.generatePdfReport = async (req, res) => {
  try {
    const { numeroLote } = req.params;
    
    // Buscar lentes por número de lote
    const lenses = await Lens.findAll({ numeroLote });
    
    if (lenses.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron lentes con el número de lote ${numeroLote}`
      });
    }

    // Crear PDF
    const doc = new PDFDocument();
    const filename = `reporte-lote-${numeroLote}-${Date.now()}.pdf`;
    const filePath = `./temp/${filename}`;
    
    // Asegurar que existe el directorio temp
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
    }
    
    // Configurar cabeceras para descargar el archivo
    res.setHeader('Content-disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-type', 'application/pdf');
    
    // Pipe el PDF a la respuesta
    doc.pipe(fs.createWriteStream(filePath));
    doc.pipe(res);
    
    // Contenido del PDF
    doc.fontSize(20).text(`Reporte de Lentes - Lote ${numeroLote}`, {
      align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, {
      align: 'right'
    });
    
    doc.moveDown();
    
    // Tabla de lentes
    let y = 150;
    
    // Encabezados
    doc.fontSize(10)
      .text('Modelo', 50, y)
      .text('Marca', 150, y)
      .text('Precio', 250, y)
      .text('Descuento', 300, y)
      .text('Precio Final', 350, y)
      .text('Existencias', 420, y)
      .text('Estado', 480, y);
    
    y += 20;
    
    // Datos
    lenses.forEach(lens => {
      doc.fontSize(8)
        .text(lens.modelo, 50, y)
        .text(lens.marca.nombre, 150, y)
        .text(`$${lens.precio.toFixed(2)}`, 250, y)
        .text(`${lens.descuento}%`, 300, y)
        .text(`$${lens.precioFinal.toFixed(2)}`, 350, y)
        .text(lens.existencias.toString(), 420, y)
        .text(lens.estado, 480, y);
      
      y += 20;
      
      // Nueva página si es necesario
      if (y > 700) {
        doc.addPage();
        y = 50;
        
        // Encabezados en la nueva página
        doc.fontSize(10)
          .text('Modelo', 50, y)
          .text('Marca', 150, y)
          .text('Precio', 250, y)
          .text('Descuento', 300, y)
          .text('Precio Final', 350, y)
          .text('Existencias', 420, y)
          .text('Estado', 480, y);
        
        y += 20;
      }
    });
    
    // Resumen
    doc.moveDown(2);
    doc.fontSize(12).text(`Total de lentes: ${lenses.length}`);
    
    // Finalizar PDF
    doc.end();
    
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte PDF',
      error: error.message
    });
  }
};