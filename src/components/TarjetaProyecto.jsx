import React, { useState } from "react";
import { deleteProjectSlice } from "../redux/features/projectSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProjectService } from "../services/projectServices";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const TarjetaProyecto = ({ _id, id, name, description, members, createdAt }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projectId = _id || id; // Usar _id de la API o id como fallback
  const [error, setError] = useState("");

  const handleViewTasks = () => {
    navigate(`/project/${projectId}`);
  };

  const handleDelete = async () => {
    try {
      setError("");
      const result = await deleteProjectService(projectId);
      console.log("result", result);

      dispatch(deleteProjectSlice(projectId));
    } catch (error) {
      console.log("error", error);

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
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <Button variant="primary" size="sm" onClick={handleViewTasks}>
            Ver Tareas
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Eliminar Proyecto
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TarjetaProyecto;
