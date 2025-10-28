import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Card, message } from 'antd';
import { lensService, brandService } from '../services/api';

const { Option } = Select;

const LensForm = ({ lens = null, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  
  const isEditing = !!lens;

  // Cargar marcas al iniciar
  useEffect(() => {
    fetchBrands();
  }, []);

  // Configurar formulario si estamos editando
  useEffect(() => {
    if (lens) {
      form.setFieldsValue({
        modelo: lens.modelo,
        marca: lens.marca._id,
        precio: lens.precio,
        descuento: lens.descuento,
        existencias: lens.existencias,
        numeroLote: lens.numeroLote,
        estado: lens.estado
      });
      
      // Calcular precio final inicial
      calculateFinalPrice(lens.precio, lens.descuento);
    }
  }, [lens, form]);

  // Obtener marcas para el selector
  const fetchBrands = async () => {
    try {
      const response = await brandService.getAll();
      setBrands(response.data.data);
    } catch (error) {
      message.error('Error al cargar las marcas');
      console.error(error);
    }
  };

  // Calcular precio final automáticamente
  const calculateFinalPrice = (price, discount) => {
    if (price !== undefined && discount !== undefined) {
      const finalPrice = price - (price * discount / 100);
      setCalculatedPrice(finalPrice.toFixed(2));
    }
  };

  // Manejar cambios en precio o descuento
  const handlePriceChange = (value) => {
    const discount = form.getFieldValue('descuento') || 0;
    calculateFinalPrice(value, discount);
  };

  const handleDiscountChange = (value) => {
    const price = form.getFieldValue('precio') || 0;
    calculateFinalPrice(price, value);
  };

  // Enviar formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await lensService.update(lens._id, values);
        message.success('Lente actualizado correctamente');
      } else {
        await lensService.create(values);
        message.success('Lente creado correctamente');
      }
      
      if (onSave) onSave();
    } catch (error) {
      message.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el lente`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={isEditing ? 'Editar Lente' : 'Agregar Nuevo Lente'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          modelo: '',
          precio: 0,
          descuento: 0,
          existencias: 1,
          estado: 'En inventario'
        }}
      >
        <Form.Item
          name="modelo"
          label="Modelo"
          rules={[{ required: true, message: 'Por favor ingresa el modelo' }]}
        >
          <Input placeholder="Modelo del lente" />
        </Form.Item>

        <Form.Item
          name="marca"
          label="Marca"
          rules={[{ required: true, message: 'Por favor selecciona la marca' }]}
        >
          <Select placeholder="Selecciona una marca">
            {brands.map(brand => (
              <Option key={brand._id} value={brand._id}>{brand.nombre}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="precio"
          label="Precio"
          rules={[{ required: true, message: 'Por favor ingresa el precio' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            onChange={handlePriceChange}
          />
        </Form.Item>

        <Form.Item
          name="descuento"
          label="Descuento (%)"
        >
          <InputNumber
            min={0}
            max={100}
            style={{ width: '100%' }}
            formatter={value => `${value}%`}
            parser={value => value.replace('%', '')}
            onChange={handleDiscountChange}
          />
        </Form.Item>

        <Form.Item label="Precio Final (calculado automáticamente)">
          <InputNumber
            value={calculatedPrice}
            disabled
            style={{ width: '100%' }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>

        <Form.Item
          name="existencias"
          label="Existencias"
          rules={[{ required: true, message: 'Por favor ingresa las existencias' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="numeroLote"
          label="Número de Lote"
          rules={[{ required: true, message: 'Por favor ingresa el número de lote' }]}
        >
          <Input placeholder="Número de lote" />
        </Form.Item>

        <Form.Item
          name="estado"
          label="Estado"
          rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
        >
          <Select>
            <Option value="Publicado">Publicado</Option>
            <Option value="Vendido">Vendido</Option>
            <Option value="En inventario">En inventario</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LensForm;