import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { brandService } from '../services/api';

const BrandForm = ({ brand = null, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!brand;

  // Configurar formulario si estamos editando
  useEffect(() => {
    if (brand) {
      form.setFieldsValue({
        nombre: brand.nombre,
        descripcion: brand.descripcion
      });
    }
  }, [brand, form]);

  // Enviar formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await brandService.update(brand._id, values);
        message.success('Marca actualizada correctamente');
      } else {
        await brandService.create(values);
        message.success('Marca creada correctamente');
      }
      
      if (onSave) onSave();
    } catch (error) {
      message.error(`Error al ${isEditing ? 'actualizar' : 'crear'} la marca`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={isEditing ? 'Editar Marca' : 'Agregar Nueva Marca'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          nombre: '',
          descripcion: ''
        }}
      >
        <Form.Item
          name="nombre"
          label="Nombre"
          rules={[{ required: true, message: 'Por favor ingresa el nombre de la marca' }]}
        >
          <Input placeholder="Nombre de la marca" />
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción"
        >
          <Input.TextArea rows={4} placeholder="Descripción de la marca" />
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

export default BrandForm;