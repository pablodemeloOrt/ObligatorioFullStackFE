import React from "react";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { addTaskSlice } from "../redux/features/taskSlice";
import { addTaskService } from "../services/taskServices";

const Agregar = ({ projectId }) => {
  const dispatch = useDispatch();

  const inputRef = useRef();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTitle = (e) => {
    const auxTitle = e.target.value;
    setTitle(auxTitle);
  };

  const handleClick = async () => {
    if (!title.trim()) return;
    setError("");
    setLoading(true);
    try {
      // addTaskService(title) -> backend crea la tarea y la devuelve
    
      const created = await addTaskService(title, projectId);
      // Normalizar la tarea creada (por si viene en created.payload / created.data)
      const createdTask = created?.payload || created?.data || created;
      // Dispatch con la tarea retornada por el servidor (asegúrate que el backend devuelve la tarea completa)
      dispatch(addTaskSlice(createdTask));
      setTitle("");
    } catch (err) {
      console.error("error creating task", err);
      setError("Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };
        
  return (
    <div className="agregar">
      <label htmlFor="txtAgregar">Agregar:</label>
      <input
        ref={inputRef}
        type="text"
        name="txtAgregar"
        id="txtAgregar"
        value={title}
        onChange={handleTitle}
        disabled={loading}
      />
      <input type="button" value={loading ? "..." : "Agregar"} onClick={handleClick} disabled={loading} />
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default Agregar;
