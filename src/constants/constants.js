// Usar MODE de Vite para detectar el entorno
// En producción, MODE será "production"
// En desarrollo, MODE será "development"
export const urlBase = import.meta.env.MODE === 'production'
  ? "https://obligatorio-full-stack-ort.vercel.app/api/v1"
  : "/api/v1";

export const Plan = Object.freeze({
  PLUS: 'plus',
  PREMIUM: 'premium',
});