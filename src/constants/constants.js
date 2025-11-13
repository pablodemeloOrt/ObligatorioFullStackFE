// Usar variable de entorno VITE_API_URL para configurar la URL del API.
// Si no está definida, usamos el proxy relativo '/api/v1' para desarrollo
// y para que Vercel pueda aplicar rewrites (proxy) y evitar problemas de CORS.
// En Vercel puedes opcionalmente definir VITE_API_URL con la URL completa
// si prefieres llamar al backend directamente (asegúrate entonces que el
// backend permita CORS desde el dominio del frontend).
export const urlBase = import.meta.env.VITE_API_URL || '/api/v1';

export const Plan = Object.freeze({
  PLUS: 'plus',
  PREMIUM: 'premium',
});