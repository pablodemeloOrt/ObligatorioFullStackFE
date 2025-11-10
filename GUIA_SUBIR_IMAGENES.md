# 📸 Guía de uso - Subir Imágenes a Cloudinary

## Descripción

Este proyecto incluye un componente reutilizable para subir imágenes a Cloudinary a través del backend. La imagen se convierte automáticamente a base64 y se envía al servidor, que devuelve una URL segura de Cloudinary.

## 🏗️ Arquitectura

```
Frontend                    Backend                     Cloudinary
   |                           |                            |
   |--1. Seleccionar imagen--->|                            |
   |                           |                            |
   |--2. Convertir a base64--->|                            |
   |                           |                            |
   |--3. POST /api/v1/images-->|                            |
   |   { file: "data:..." }    |                            |
   |                           |--4. Subir a Cloudinary---->|
   |                           |                            |
   |                           |<--5. Retornar secure_url---|
   |<--6. { secure_url, ... }--|                            |
   |                           |                            |
   |--7. Mostrar preview------>|                            |
   |   y guardar URL           |                            |
```

## 📦 Archivos implementados

### 1. `src/services/imageService.js`
Servicio para comunicarse con el backend:

```javascript
import axios from 'axios';
import { urlBase } from '../constants/constants.js';

export const uploadImageService = async (base64Image) => {
  const response = await axios.post(
    `${urlBase}/images`,
    { file: base64Image },
    { headers: { "Content-type": "application/json; charset=UTF-8" } }
  );
  return response.data; // { secure_url, public_id }
};
```

### 2. `src/components/SubirImagenComponent.jsx`
Componente React reutilizable que:
- Permite seleccionar una imagen
- La convierte a base64
- La sube automáticamente al backend
- Muestra un preview
- Notifica al componente padre con la URL

### 3. Estilos CSS
Agregados en `src/styles/estilos.css`:
- `.subir-imagen-container`
- `.image-preview-container`
- `.image-preview`
- `.image-remove-btn`

## 🚀 Uso del componente

### Ejemplo 1: En el registro de usuario

```jsx
import SubirImagenComponent from "./SubirImagenComponent.jsx";

const Registrar = () => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const handleSubmit = async () => {
    // profileImageUrl contiene la URL de Cloudinary
    await registerService(name, email, password, profileImageUrl);
  };

  return (
    <Form>
      {/* Otros campos... */}
      
      <Form.Group className="mb-3">
        <Form.Label>Foto de perfil (opcional)</Form.Label>
        <SubirImagenComponent 
          onImageUploaded={setProfileImageUrl}
          buttonText="Seleccionar foto de perfil"
          maxSizeMB={5}
          previewSize={150}
        />
      </Form.Group>

      <Button onClick={handleSubmit}>Registrar</Button>
    </Form>
  );
};
```

### Ejemplo 2: En formulario de tareas (con imagen adjunta)

```jsx
import SubirImagenComponent from "./SubirImagenComponent.jsx";

const AgregarTarea = () => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const handleSave = async () => {
    await addTaskService({
      title,
      imageUrl  // URL de la imagen en Cloudinary
    });
  };

  return (
    <Modal>
      <Form>
        <Form.Group>
          <Form.Label>Título</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Imagen adjunta (opcional)</Form.Label>
          <SubirImagenComponent 
            onImageUploaded={setImageUrl}
            buttonText="Adjuntar imagen"
            maxSizeMB={3}
            previewSize={200}
          />
        </Form.Group>

        <Button onClick={handleSave}>Guardar Tarea</Button>
      </Form>
    </Modal>
  );
};
```

## 🎛️ Props del componente

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onImageUploaded` | Function | - | **Requerido**. Callback que recibe la URL cuando la imagen se sube exitosamente. Recibe `null` cuando se elimina. |
| `buttonText` | String | "Seleccionar imagen" | Texto del botón de selección |
| `maxSizeMB` | Number | 5 | Tamaño máximo permitido en MB |
| `previewSize` | Number | 150 | Tamaño del preview en píxeles (ancho y alto) |

## 📋 Flujo completo

1. **Usuario selecciona imagen** → Input file abre explorador
2. **Validación cliente** → Verifica tamaño y formato (JPG, PNG, GIF, WEBP)
3. **Conversión a base64** → FileReader convierte el archivo
4. **Preview inmediato** → Muestra la imagen seleccionada
5. **Subida automática** → POST a `/api/v1/images` con el base64
6. **Backend procesa** → Sube a Cloudinary y devuelve `secure_url`
7. **Callback al padre** → `onImageUploaded(secure_url)` se ejecuta
8. **Uso posterior** → El componente padre usa la URL al guardar el formulario

## 🔒 Validaciones implementadas

### Cliente (Frontend)
- ✅ Tamaño máximo configurable (default 5MB)
- ✅ Formatos permitidos: JPG, PNG, GIF, WEBP
- ✅ Preview antes de subir
- ✅ Manejo de errores con mensajes claros

### Servidor (Backend)
Tu backend debe implementar:
- ✅ Validación adicional de tamaño
- ✅ Validación de formato
- ✅ Sanitización de datos
- ✅ Límites de rate limiting

## 🎨 Estados visuales

El componente muestra diferentes estados:

1. **Inicial**: Botón "Seleccionar imagen"
2. **Subiendo**: Spinner + "Subiendo imagen..."
3. **Error**: Mensaje en rojo con el error
4. **Éxito**: Preview con botón × para eliminar
5. **Con imagen**: Botón cambia a "Cambiar imagen"

## 🔧 Personalización de estilos

Puedes sobrescribir los estilos CSS:

```css
/* Personalizar contenedor */
.subir-imagen-container {
  /* tus estilos */
}

/* Personalizar preview */
.image-preview {
  border-radius: 50%; /* Hacer circular */
  border: 3px solid #007bff; /* Cambiar borde */
}

/* Personalizar botón eliminar */
.image-remove-btn {
  background-color: #ff4444;
}
```

## 🐛 Manejo de errores

El componente maneja estos casos:

```javascript
// Archivo muy grande
"La imagen es demasiado grande. Máximo 5MB."

// Formato no permitido
"Formato no permitido. Solo JPG, PNG, GIF o WEBP."

// Error al leer archivo
"Error al leer el archivo"

// Error en la subida
"Error al subir la imagen. Intenta de nuevo."
```

## 📝 Ejemplo completo con validación

```jsx
const Registrar = () => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [error, setError] = useState("");

  const handleImageUploaded = (url) => {
    setProfileImageUrl(url);
    setError(""); // Limpiar errores
  };

  const handleSubmit = async () => {
    // Opcional: hacer la imagen requerida
    if (!profileImageUrl) {
      setError("Debes subir una foto de perfil");
      return;
    }

    try {
      await registerService(name, email, password, profileImageUrl);
    } catch (err) {
      setError("Error al registrar usuario");
    }
  };

  return (
    <Form>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <SubirImagenComponent 
        onImageUploaded={handleImageUploaded}
        buttonText="Foto de perfil"
      />

      <Button onClick={handleSubmit}>Registrar</Button>
    </Form>
  );
};
```

## 🚀 Próximos pasos

Ahora puedes:

1. ✅ **Probar el registro con imagen** en `/signup`
2. 🔄 **Agregar a formulario de tareas** si necesitas imágenes adjuntas
3. 📸 **Permitir actualizar foto de perfil** en configuración de usuario
4. 🖼️ **Mostrar avatares** en la UI usando las URLs guardadas

## 🆘 Solución de problemas

### La imagen no se sube
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Revisa la consola del navegador para ver errores
- Confirma que el endpoint `/api/v1/images` esté funcionando

### Error de CORS
- Asegúrate que el backend tenga CORS habilitado para tu frontend

### La preview no aparece
- Verifica que el archivo sea una imagen válida
- Revisa la consola para errores en la conversión a base64

---

**¿Necesitas ayuda?** Revisa los logs en la consola del navegador y del servidor.
