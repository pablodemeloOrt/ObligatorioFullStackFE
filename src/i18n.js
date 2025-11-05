import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      login: {
        title: "Login",
        email: "Email address",
        password: "Password",
        emailPlaceholder: "Enter email",
        passwordPlaceholder: "Password",
        submit: "Log In",
        loading: "Logging in...",
        noAccount: "Don't have an account? Sign up here",
        invalidCredentials: "Invalid credentials",
        serverError: "Could not connect to server",
        loginError: "Error attempting to log in"
      },
      validations: {
        email_required: "Email is required",
        email_invalid: "Invalid email format",
        password_required: "Password is required",
        min: "Must be at least {{min}} characters"
      }
    }
  },
  es: {
    translation: {
      login: {
        title: "Iniciar Sesión",
        email: "Correo electrónico",
        password: "Contraseña",
        emailPlaceholder: "Ingrese su correo",
        passwordPlaceholder: "Contraseña",
        submit: "Iniciar Sesión",
        loading: "Iniciando sesión...",
        noAccount: "¿No tienes una cuenta? Regístrate aquí",
        invalidCredentials: "Credenciales inválidas",
        serverError: "No se pudo conectar con el servidor",
        loginError: "Error al intentar iniciar sesión"
      },
      validations: {
        email_required: "El correo es requerido",
        email_invalid: "Formato de correo inválido",
        password_required: "La contraseña es requerida",
        min: "Debe tener al menos {{min}} caracteres"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
