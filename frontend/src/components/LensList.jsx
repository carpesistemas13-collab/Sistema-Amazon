import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Modal, message } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined, FilePdfOutlined } from '@ant-design/icons';
import { lensService, brandService } from '../services/api';

const { Option } = Select;

const LensList = ({ onEdit }) => {
  const [lenses, setLenses] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchModel, setSearchModel] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedLot, setSelectedLot] = useState('');
  const [lots, setLots] = useState([]);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportLot, setReportLot] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    fetchLenses();
    fetchBrands();
  }, []);

  // Obtener lentes con filtros aplicados
  const fetchLenses = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await lensService.getAll(filters);
      setLenses(response.data.data);
      
      // Extraer números de lote únicos para el filtro
      const uniqueLots = [...new Set(response.data.data.map(lens => lens.numeroLote))];
      setLots(uniqueLots);
    } catch (error) {
      message.error('Error al cargar los lentes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener marcas para el filtro
  const fetchBrands = async () => {
    try {
      const response = await brandService.getAll();
      setBrands(response.data.data);
    } catch (error) {
      message.error('Error al cargar las marcas');
      console.error(error);
    }
  };

  // Aplicar filtros
  const applyFilters = () => {
    const filters = {};
    if (searchModel) filters.modelo = searchModel;
    if (selectedBrand) filters.marca = selectedBrand;
    if (selectedLot) filters.numeroLote = selectedLot;
    
    fetchLenses(filters);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchModel('');
    setSelectedBrand('');
    setSelectedLot('');
    fetchLenses();
  };

  // Manejar venta de lente
  const handleSell = async (id) => {
    try {
      await lensService.sell(id);
      message.success('Venta registrada correctamente');
      fetchLenses(); // Recargar la lista para actualizar existencias
    } catch (error) {
      message.error('Error al registrar la venta');
      console.error(error);
    }
  };

  // Eliminar lente
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este lente?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await lensService.delete(id);
          message.success('Lente eliminado correctamente');
          fetchLenses();
        } catch (error) {
          message.error('Error al eliminar el lente');
          console.error(error);
        }
      }
    });
  };

  // Generar reporte PDF
  const handleGenerateReport = async () => {
    if (!reportLot) {
      message.warning('Selecciona un número de lote');
      return;
    }

    try {
      const response = await lensService.generateReport(reportLot);
      
      // Crear URL para el blob y descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-lote-${reportLot}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Reporte generado correctamente');
      setReportModalVisible(false);
    } catch (error) {
      message.error('Error al generar el reporte');
      console.error(error);
    }
  };

  // Columnas para la tabla
  const columns = [
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      key: 'modelo',
      sorter: (a, b) => a.modelo.localeCompare(b.modelo)
    },
    {
      title: 'Marca',
      dataIndex: ['marca', 'nombre'],
      key: 'marca',
      sorter: (a, b) => a.marca.nombre.localeCompare(b.marca.nombre)
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => `$${precio.toFixed(2)}`,
      sorter: (a, b) => a.precio - b.precio
    },
    {
      title: 'Descuento',
      dataIndex: 'descuento',
      key: 'descuento',
      render: (descuento) => `${descuento}%`,
      sorter: (a, b) => a.descuento - b.descuento
    },
    {
      title: 'Precio Final',
      dataIndex: 'precioFinal',
      key: 'precioFinal',
      render: (precioFinal) => `$${precioFinal.toFixed(2)}`,
      sorter: (a, b) => a.precioFinal - b.precioFinal
    },
    {
      title: 'Existencias',
      dataIndex: 'existencias',
      key: 'existencias',
      sorter: (a, b) => a.existencias - b.existencias
    },
    {
      title: 'Número de Lote',
      dataIndex: 'numeroLote',
      key: 'numeroLote',
      sorter: (a, b) => a.numeroLote.localeCompare(b.numeroLote)
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        let color = 'blue';
        if (estado === 'Vendido') color = 'red';
        if (estado === 'Publicado') color = 'green';
        
        return <span style={{ color }}>{estado}</span>;
      },
      filters: [
        { text: 'Publicado', value: 'Publicado' },
        { text: 'Vendido', value: 'Vendido' },
        { text: 'En inventario', value: 'En inventario' }
      ],
      onFilter: (value, record) => record.estado === value
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
          />
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record._id)}
          />
          <Button 
            type="success" 
            icon={<ShoppingCartOutlined />} 
            onClick={() => handleSell(record._id)}
            disabled={record.existencias <= 0 || record.estado === 'Vendido'}
          />
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Buscar por modelo"
            value={searchModel}
            onChange={(e) => setSearchModel(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Filtrar por marca"
            value={selectedBrand}
            onChange={setSelectedBrand}
            allowClear
            style={{ width: 200 }}
          >
            {brands.map(brand => (
              <Option key={brand._id} value={brand._id}>{brand.nombre}</Option>
            ))}
          </Select>
          <Select
            placeholder="Filtrar por lote"
            value={selectedLot}
            onChange={setSelectedLot}
            allowClear
            style={{ width: 200 }}
          >
            {lots.map(lot => (
              <Option key={lot} value={lot}>{lot}</Option>
            ))}
          </Select>
          <Button type="primary" onClick={applyFilters}>Filtrar</Button>
          <Button onClick={clearFilters}>Limpiar</Button>
          <Button 
            type="primary" 
            icon={<FilePdfOutlined />} 
            onClick={() => setReportModalVisible(true)}
          >
            Generar Reporte
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={lenses}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal para generar reporte */}
      <Modal
        title="Generar Reporte PDF"
        visible={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        onOk={handleGenerateReport}
        okText="Generar"
        cancelText="Cancelar"
      >
        <p>Selecciona el número de lote para generar el reporte:</p>
        <Select
          placeholder="Seleccionar lote"
          value={reportLot}
          onChange={setReportLot}
          style={{ width: '100%' }}
        >
          {lots.map(lot => (
            <Option key={lot} value={lot}>{lot}</Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default LensList;