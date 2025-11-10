import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerService } from "../services/userServices.js";
import SubirImagenComponent from "./SubirImagenComponent.jsx";

const Registrar = () => {
  const [valores, setValores] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validación: las contraseñas deben coincidir antes de intentar registrar
    if (valores.password !== valores.confirmPassword) {
      setLoading(false);
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      console.log("Intentando registrar con:", valores);
      const response = await registerService(
        valores.name, 
        valores.email, 
        valores.password, 
        profileImageUrl
      );
      console.log("Respuesta del registro:", response);

      // Mostrar mensaje de éxito y navegar a login
      setSuccess("Registro exitoso. Redirigiendo a login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      console.log("Error en registro:", error);

      if (error.response) {
        setError(error.response.data.message || "No se pudo registrar");
      } else if (error.request) {
        setError("No se pudo conectar con el servidor");
      } else {
        setError("Error al intentar registrar");
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
      <h2 style={{ marginBottom: "20px" }}>Registrar</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          {success}
        </Alert>
      )}

      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="Ingrese su nombre"
            value={valores.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </Form.Group>

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
        
        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Repetir Password</Form.Label>
          <Form.Control
            name="confirmPassword"
            type="password"
            placeholder="Repite la contraseña"
            value={valores.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            isInvalid={valores.confirmPassword && valores.password !== valores.confirmPassword}
            isValid={valores.confirmPassword && valores.password === valores.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            Las contraseñas no coinciden.
          </Form.Control.Feedback>
          <Form.Control.Feedback>
            Las contraseñas coinciden.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Campo de imagen de perfil */}
        <Form.Group className="mb-3" controlId="formBasicProfileImage">
          <Form.Label>Foto de perfil (opcional)</Form.Label>
          <SubirImagenComponent 
            onImageUploaded={setProfileImageUrl}
            buttonText="Seleccionar foto de perfil"
            maxSizeMB={5}
            previewSize={150}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </Form>
      <br />
      <Link to="/login">¿ya tienes una cuenta? Inicia sesión aquí</Link>
    </div>
  );
};

export default Registrar;
