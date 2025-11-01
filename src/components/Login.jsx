import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginService } from "../services/userServices.js";

const Login = () => {
  const [valores, setValores] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError(error.response.data.message || "Credenciales inválidas");
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        setError("No se pudo conectar con el servidor");
      } else {
        // Algo más sucedió
        setError("Error al intentar iniciar sesión");
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
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter email"
            value={valores.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Password"
            value={valores.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>
      </Form>
      <br />
      <Link to="/signup">¿No tienes una cuenta? Regístrate aquí</Link>
      
    </div>
    
  );
};

export default Login;
