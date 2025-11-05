import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { getAllUsersService, addMemberToProjectService } from "../services/projectServices";

const AgregarMiembroModal = ({ show, onHide, projectId, currentMembers, onMemberAdded }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (show) {
      loadUsers();
    }
  }, [show]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");
      const allUsers = await getAllUsersService();
      
      // Filtrar usuarios que ya son miembros del proyecto
      const memberIds = currentMembers?.map(m => m._id || m.id) || [];
      const availableUsers = allUsers.filter(user => !memberIds.includes(user._id || user.id));
      
      setUsers(availableUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error al cargar la lista de usuarios");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      setError("Por favor selecciona un usuario");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      await addMemberToProjectService(projectId, selectedUserId);
      
      setSuccess("¡Miembro agregado exitosamente!");
      setSelectedUserId("");
      
      // Notificar al componente padre
      if (onMemberAdded) {
        onMemberAdded();
      }
      
      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        onHide();
        setSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Error adding member:", error);
      let errorMessage = "Error al agregar miembro";
      
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
    setSelectedUserId("");
    setError("");
    setSuccess("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Miembro al Proyecto</Modal.Title>
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
        
        {loadingUsers ? (
          <div className="text-center p-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando usuarios...</span>
            </Spinner>
            <p className="mt-2">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <Alert variant="info">
            No hay usuarios disponibles para agregar. Todos los usuarios ya son miembros de este proyecto.
          </Alert>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Usuario</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                disabled={loading}
                required
              >
                <option value="">-- Selecciona un usuario --</option>
                {users.map((user) => (
                  <option key={user._id || user.id} value={user._id || user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        {users.length > 0 && (
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={loading || !selectedUserId}
          >
            {loading ? "Agregando..." : "Agregar Miembro"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AgregarMiembroModal;
