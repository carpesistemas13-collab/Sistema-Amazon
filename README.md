# Sistema de Gestión de Lentes

Sistema web para la gestión de inventario de lentes ópticos, desarrollado con React y Vite, utilizando Supabase como backend.

## Características

- **Gestión de Inventario**: Registro, edición y eliminación de lentes
- **Visualización de Datos**: Tabla interactiva con todos los productos registrados
- **Contador de Productos**: Muestra el número total de lentes registrados
- **Generación de Reportes**: Exportación de datos a PDF
- **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos

## Tecnologías Utilizadas

- **Frontend**: React, Vite
- **Backend**: Supabase
- **Estilos**: CSS personalizado
- **Generación de PDF**: jsPDF, jsPDF-AutoTable

## Requisitos Previos

- Node.js (v14.0.0 o superior)
- npm o yarn
- Cuenta en Supabase

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/sistema-gestion-lentes.git
   cd sistema-gestion-lentes
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Añadir las siguientes variables:
     ```
     VITE_SUPABASE_URL=tu_url_de_supabase
     VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
     ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
sistema-gestion-lentes/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos principales
│   ├── main.jsx        # Punto de entrada
│   └── supabaseClient.js # Configuración de Supabase
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## Uso

1. Accede a la aplicación a través de la URL local proporcionada por Vite (generalmente http://localhost:5173/)
2. Utiliza el formulario para añadir nuevos lentes al inventario
3. Visualiza, edita o elimina los registros desde la tabla principal
4. Genera reportes en PDF según sea necesario

## Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Nombre - [jfg210203@gmail.com](mailto:jfg210203@gmail.com)
