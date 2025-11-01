import React, { useState } from "react";
import { deleteTaskSlice } from "../redux/features/taskSlice";
import { useDispatch } from "react-redux";
import { checkTaskSlice } from "../redux/features/taskSlice";
import { deleteTaskService } from "../services/taskServices";
import Alert from "react-bootstrap/Alert";

// deleteTaskService

const Tarjeta = ({ _id, id, title, completed, status }) => {
  const dispatch = useDispatch();
  const taskId = _id || id; // Usar _id de la API o id como fallback
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setError("");
      const result = await deleteTaskService(taskId);
      console.log("result", result);

      dispatch(deleteTaskSlice(taskId));
    } catch (error) {
      console.log("error", error);

      
      // Mostrar error en pantalla by chatGPT
      let errorMessage = "Error al eliminar la tarea";
      
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

  const handleCheck = (e) => {
    const completed = e.target.checked;

    console.log("completed", completed);
    const payload = { id: taskId, completed: completed };

    dispatch(checkTaskSlice(payload));
  };

  return (
    <div className="tarjeta">
      {error && (
        <Alert 
          variant="danger" 
          onClose={() => setError("")} 
          dismissible
          style={{ marginBottom: '10px' }}
        >
          {error}
        </Alert>
      )}
      
      <input
        type="checkbox"
        id={taskId}
        className="checkbox"
        checked={completed || status === "completada"}
        onChange={handleCheck}
      />
      <label className="checkLabel" htmlFor={taskId}>
        {title}
      </label>

      <input
        type="button"
        className="btn btn-danger"
        value="Borrar tarea"
        onClick={handleDelete}
      />
    </div>
  );
};

export default Tarjeta;
