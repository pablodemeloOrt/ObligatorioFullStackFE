import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLoginSchema } from "../schemas/loginSchemas.js";
import { loginService } from "../services/userServices.js";

const Login = () => {
  const { t, i18n } = useTranslation();
  const [valores, setValores] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = useMemo(() => {
    console.log("cambio el memo");
    return getLoginSchema(t);
  }, [i18n.language]);
  
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Intentando login con:", valores);
      const response = await loginService(valores.email, valores.password);
      console.log("Respuesta del login:", response);

      // Guardar token y userId en localStorage
      let localStorage = window.localStorage;
      
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.userId || response.id) {
        localStorage.setItem("userId", response.userId || response.id);
      }

      // Navegar al dashboard
      navigate("/");
    } catch (error) {
      console.log("Error en login:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de error
        setError(error.response.data.message || t('login.invalidCredentials'));
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        setError(t('login.serverError'));
      } else {
        // Algo más sucedió
        setError(t('login.loginError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setValores((valoresActuales) => {
      return {
        ...valoresActuales,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      };
    });
  };

  return (
    <div className="contenido">
      <h2 style={{ marginBottom: '20px' }}>{t('login.title')}</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>{t('login.email')}</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder={t('login.emailPlaceholder')}
            value={valores.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>{t('login.password')}</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            value={valores.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? t('login.loading') : t('login.submit')}
        </Button>
      </Form>
      <br />
      <Link to="/signup">{t('login.noAccount')}</Link>

      <div className="login-language-buttons">
        <button onClick={() => i18n.changeLanguage("es")} className="login-language-button">
          Español
        </button>
        <button onClick={() => i18n.changeLanguage("en")} className="login-language-button">
          English
        </button>
      </div>
    </div>
    
  );
};

export default Login;
