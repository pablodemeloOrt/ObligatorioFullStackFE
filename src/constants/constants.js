const isDevelopment = import.meta.env.DEVELLOPMENT;

export const urlBase = "/api/v1"
// export const urlBase = "https://obligatorio-full-stack-ort.vercel.app/api/v1"

export const Plan = Object.freeze({
  PLUS: 'plus',
  PREMIUM: 'premium',
});