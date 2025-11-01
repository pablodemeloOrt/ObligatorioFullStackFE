import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Agregar from "./Agregar";
import KanbanBoard from "./KanbanBoard";
import { useDispatch } from "react-redux";
import { getTasksService } from "../services/taskServices";
import { cargarTareasIniciales } from "../redux/features/taskSlice";

const Contenido = () => {
  const { id } = useParams(); // ID del proyecto
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const tasks = await getTasksService(id);
        const normalized = Array.isArray(tasks)
          ? tasks
          : (tasks?.tasks || tasks?.data || tasks?.payload || tasks?.payload?.data || []);
        dispatch(cargarTareasIniciales(normalized));
      } catch (err) {
        console.error("Error cargando tareas:", err);
      }
    })();
  }, [id, dispatch]);

  return (
    <div className="contenido">
      <Agregar projectId={id} />
      <KanbanBoard />
    </div>
  );
};

export default Contenido;
