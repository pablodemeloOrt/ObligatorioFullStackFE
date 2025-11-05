import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { addProjectService } from "../services/projectServices";
import { createProjectSchema } from "../schemas/projectSchemas";

const CrearProyectoModal = ({ show, onHide, onProjectCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar con Yup
    try {
      const userId = localStorage.getItem('userId');
      await createProjectSchema.validate(
        { name, description, owner: userId },
        { abortEarly: false }
      );
      
      // Si la validación pasa, limpiar errores de validación
      setValidationErrors({});
    } catch (validationError) {
      // Manejar errores de validación
      const errors = {};
      validationError.inner.forEach((err) => {
        errors[err.path] = err.message;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      await addProjectService(name, description);
      
      setSuccess("¡Proyecto creado exitosamente!");
      setName("");
      setDescription("");
      setValidationErrors({});
      
      // Notificar al componente padre
      if (onProjectCreated) {
        onProjectCreated();
      }
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        onHide();
        setSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error creating project:", error);
      let errorMessage = "Error al crear el proyecto";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setError("");
    setSuccess("");
    setValidationErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Proyecto</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success">
            {success}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Proyecto *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa el nombre del proyecto (3-30 caracteres)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              isInvalid={!!validationErrors.name}
              required
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descripción del proyecto (opcional, máx. 200 caracteres)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              isInvalid={!!validationErrors.description}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading || !name.trim()}
        >
          {loading ? "Creando..." : "Crear Proyecto"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CrearProyectoModal;
