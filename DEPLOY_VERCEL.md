# 🚀 Guía de Deploy en Vercel

## 📋 Pre-requisitos completados ✅

1. ✅ `vercel.json` configurado
2. ✅ `constants.js` actualizado para desarrollo/producción
3. ✅ Scripts de build en `package.json`
4. ✅ `.gitignore` configurado

## 🔧 Pasos para hacer el deploy

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube tu código a GitHub**:
   ```bash
   git add .
   git commit -m "Preparar para deploy en Vercel"
   git push origin main
   ```

2. **Conecta Vercel con GitHub**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Add New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

3. **Configuración en Vercel**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (autodetectado)
   - Output Directory: `dist` (autodetectado)
   - Install Command: `npm install` (autodetectado)

4. **Deploy**:
   - Haz clic en "Deploy"
   - Espera 1-2 minutos
   - ¡Listo! 🎉

### Opción 2: Deploy desde CLI

1. **Instalar Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Sigue las instrucciones
   - Acepta los valores por defecto
   - Para producción, usa: `vercel --prod`

## ⚙️ Variables de entorno (si las necesitas)

Si en el futuro necesitas variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega variables como:
   - `VITE_API_URL` (opcional, ya está en constants.js)
   - `VITE_CLOUDINARY_CLOUD_NAME` (si decides usarlo)

## 🔄 Configuración explicada

### `vercel.json`
```json
{
  "buildCommand": "npm run build",      // Comando de compilación
  "outputDirectory": "dist",             // Carpeta de salida
  "devCommand": "npm run dev",           // Servidor de desarrollo
  "installCommand": "npm install",       // Instalar dependencias
  "framework": "vite",                   // Framework detectado
  "rewrites": [                          // Reglas de reescritura (opcional)
    {
      "source": "/api/v1/:path*",
      "destination": "https://obligatorio-full-stack-ort.vercel.app/api/v1/:path*"
    }
  ]
}
```

**Nota**: Las `rewrites` están comentadas en el archivo actual porque el backend ya está en Vercel. Solo las necesitarías si el frontend y backend estuvieran en dominios diferentes.

### `constants.js` - Detección automática de entorno
```javascript
const isDevelopment = import.meta.env.DEV;

export const urlBase = isDevelopment 
  ? "/api/v1"                           // Desarrollo: usa proxy de Vite
  : "https://obligatorio-full-stack-ort.vercel.app/api/v1";  // Producción: URL completa
```

## 🌐 Después del deploy

### URLs que obtendrás:
- **Producción**: `https://tu-proyecto.vercel.app`
- **Preview**: Una URL única por cada commit/PR

### Configurar dominio personalizado (opcional):
1. Ve a Settings → Domains en Vercel
2. Agrega tu dominio
3. Configura los DNS según las instrucciones

## 🔍 Verificar que funciona

Después del deploy, verifica:

1. ✅ La página carga correctamente
2. ✅ El login funciona (se conecta al backend)
3. ✅ Las imágenes de Cloudinary se muestran
4. ✅ Las rutas funcionan (Home, Graficas, etc.)
5. ✅ El i18n funciona (cambio de idioma en login)

## 🐛 Solución de problemas comunes

### Error: "Cannot GET /home"
**Solución**: Agrega esto a `vercel.json`:
```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Error de CORS
**Solución**: Asegúrate de que tu backend permita el dominio de Vercel:
```javascript
// En el backend
cors({
  origin: ['https://tu-proyecto.vercel.app', 'http://localhost:5173']
})
```

### Imágenes no cargan
**Solución**: Verifica que las URLs de Cloudinary sean absolutas (https://...)

### Build falla
**Solución**: 
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que todas las dependencias estén en `package.json`

## 📊 Monitoreo

Vercel te proporciona automáticamente:
- 📈 Analytics de rendimiento
- 🚀 Edge Network (CDN global)
- 🔄 Deployments automáticos con cada push
- 🌿 Preview deployments para cada PR

## 🎯 Próximos pasos después del deploy

1. **Compartir la URL** con tu equipo o profesor
2. **Probar todas las funcionalidades** en producción
3. **Monitorear errores** en la consola de Vercel
4. **Configurar dominio personalizado** si lo deseas
5. **Habilitar Analytics** para ver el tráfico

## 📝 Comandos útiles

```bash
# Deploy a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Ver lista de deployments
vercel ls

# Eliminar un deployment
vercel rm [deployment-url]

# Ver información del proyecto
vercel inspect
```

## ✅ Checklist final

Antes de hacer deploy, verifica:

- [ ] El código está en GitHub
- [ ] `npm run build` funciona sin errores localmente
- [ ] `vercel.json` está creado
- [ ] `constants.js` tiene la URL del backend correcta
- [ ] `.gitignore` no incluye archivos innecesarios
- [ ] Todas las dependencias están en `package.json`
- [ ] El backend en Vercel está funcionando

---

**¿Listo para deployar?** 🚀

Ejecuta:
```bash
git add .
git commit -m "Deploy to Vercel"
git push
```

Luego ve a [vercel.com](https://vercel.com) y conecta tu repositorio!
