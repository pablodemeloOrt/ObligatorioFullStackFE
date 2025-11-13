import React, { useState } from "react";
import { deleteProjectSlice, cargarProyectosIniciales } from "../redux/features/projectSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProjectService, getProjectsService } from "../services/projectServices";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import AgregarMiembroModal from "./AgregarMiembroModal";


const TarjetaProyecto = ({ _id, id, name, description, members, createdAt }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectId = _id || id; // Usar _id de la API o id como fallback
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleViewTasks = () => {
    navigate(`/project/${projectId}`);
  };

  const handleDelete = async () => {
    try {
      setError("");
      const result = await deleteProjectService(projectId);
      dispatch(deleteProjectSlice(projectId));
    } catch (error) {

      // Mostrar error en pantalla
      let errorMessage = "Error al eliminar el proyecto";
      
      if (error.response) {
        errorMessage = `Error ${error.response.status}: ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleMemberAdded = async () => {
    // Recargar los proyectos para actualizar la lista de miembros
    try {
      const proyectos = await getProjectsService();
      dispatch(cargarProyectosIniciales(proyectos));
    } catch (error) {
      console.error("Error recargando proyectos:", error);
    }
  };

  return (
    <Card style={{ marginBottom: '15px' }}>
      {error && (
        <Alert 
          variant="danger" 
          onClose={() => setError("")} 
          dismissible
          style={{ marginBottom: '0', borderRadius: '0' }}
        >
          {error}
        </Alert>
      )}
      
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          {description}
        </Card.Text>
        
        <div style={{ marginBottom: '10px' }}>
          <strong>Miembros: </strong>
          <Badge bg="info" style={{ marginLeft: '5px' }}>
            {members?.length || 0} miembros
          </Badge>
        </div>
        
        <Card.Text style={{ fontSize: '0.9rem', color: '#666' }}>
          <strong>Creado:</strong> {formatDate(createdAt)}
        </Card.Text>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" onClick={handleViewTasks}>
            Ver Tareas
          </Button>
          <Button variant="success" size="sm" onClick={() => setShowModal(true)}>
            + Agregar Miembro
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Eliminar Proyecto
          </Button>
        </div>
      </Card.Body>
      
      <AgregarMiembroModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        projectId={projectId}
        currentMembers={members}
        onMemberAdded={handleMemberAdded}
      />
    </Card>
  );
};

export default TarjetaProyecto;
