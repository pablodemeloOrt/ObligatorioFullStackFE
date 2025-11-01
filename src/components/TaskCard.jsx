import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { deleteTaskSlice, updateTaskStatusSlice, updateTaskSlice } from "../redux/features/taskSlice";
import { deleteTaskService, updateTaskStatusService, updateTaskService } from "../services/taskServices";

const TaskCard = ({ _id, id, title, description, assignedTo, status, createdAt }) => {
  const dispatch = useDispatch();
  const taskId = _id || id;
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");

  const handleDelete = async () => {
    try {
      setError("");
      await deleteTaskService(taskId);
      dispatch(deleteTaskSlice(taskId));
    } catch (error) {
      console.log("error", error);
      let errorMessage = "Error al eliminar la tarea";
      
      // El servicio usa fetch, el error viene en error.message como "Error 403: Forbidden"
      if (error.message && error.message.includes("403")) {
        errorMessage = "No tienes permisos para eliminar.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setError("");
      await updateTaskStatusService(taskId, newStatus);
      dispatch(updateTaskStatusSlice({ id: taskId, status: newStatus }));
    } catch (error) {
      console.log("error", error);
      let errorMessage = "Error al actualizar el status";
      
      // El servicio usa fetch, el error viene en error.message como "Error 403: Forbidden"
      if (error.message && error.message.includes("403")) {
        errorMessage = "No tienes permisos para cambiar el estado.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditDescription(description || "");
    setError("");
  };

  const handleSaveEdit = async () => {
    try {
      setError("");
      
      if (!editTitle.trim()) {
        setError("El título no puede estar vacío");
        return;
      }

      const taskData = {
        title: editTitle,
        description: editDescription
      };

      await updateTaskService(taskId, taskData);
      dispatch(updateTaskSlice({ id: taskId, title: editTitle, description: editDescription }));
      setIsEditing(false);
    } catch (error) {
      console.log("error", error);
      let errorMessage = "Error al actualizar la tarea";
      
      if (error.message && error.message.includes("403")) {
        errorMessage = "⛔ No tienes permisos para editar esta tarea. Solo puedes editar tus propias tareas asignadas.";
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
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      backlog: { bg: "secondary", text: "Backlog" },
      in_progress: { bg: "primary", text: "En Progreso" },
      testing: { bg: "warning", text: "Testing" },
      done: { bg: "success", text: "Completado" }
    };
    
    const config = statusConfig[status] || { bg: "secondary", text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  return (
    <Card className="mb-2 task-card">
      {error && (
        <Alert 
          variant="danger" 
          onClose={() => setError("")} 
          dismissible
          className="task-card-alert"
        >
          {error}
        </Alert>
      )}
      
      <Card.Body className="task-card-body">
        {isEditing ? (
          <>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Título</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título de la tarea"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                size="sm"
                rows={2}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descripción de la tarea"
              />
            </Form.Group>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="success" 
                size="sm" 
                onClick={handleSaveEdit}
                className="task-card-button"
              >
                Guardar 
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleCancelEdit}
                className="task-card-button"
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <Card.Title className="task-card-title">
              {title}
            </Card.Title>
            
            {description && (
              <Card.Text className="task-card-description">
                {description}
              </Card.Text>
            )}
            
            <div className="task-card-badge">
              {getStatusBadge(status)}
            </div>
            
            {createdAt && (
              <Card.Text className="task-card-date">
                {formatDate(createdAt)}
              </Card.Text>
            )}
            
            <Dropdown className="mb-2">
              <Dropdown.Toggle variant="outline-secondary" size="sm" className="task-card-button">
                Cambiar Estado
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleStatusChange("backlog")} disabled={status === "backlog"}>
                 Backlog
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusChange("in_progress")} disabled={status === "in_progress"}>
                  En Progreso
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusChange("testing")} disabled={status === "testing"}>
                  esting
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleStatusChange("done")} disabled={status === "done"}>
                  Completado
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleEdit}
                className="task-card-button"
              >
                Editar
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleDelete}
                className="task-card-button"
              >
                Eliminar
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskCard;
