const Brand = require('../models/Brand');

// Obtener todas las marcas
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ activo: true });
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las marcas',
      error: error.message
    });
  }
};

// Obtener una marca por ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la marca',
      error: error.message
    });
  }
};

// Crear una nueva marca
exports.createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    
    res.status(201).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la marca',
      error: error.message
    });
  }
};

// Actualizar una marca
exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar la marca',
      error: error.message
    });
  }
};

// Eliminar una marca (desactivar)
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      {
        new: true,
        runValidators: true
      }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Marca no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la marca',
      error: error.message
    });
  }
};