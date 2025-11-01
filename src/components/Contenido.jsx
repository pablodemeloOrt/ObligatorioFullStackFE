import React from "react";
import { useParams } from "react-router-dom";
import Agregar from "./Agregar";
import KanbanBoard from "./KanbanBoard";

const Contenido = () => {
  const { id } = useParams(); // Obtener el ID del proyecto desde la URL

  return (
    <div className="contenido">
      <Agregar projectId={id} />
      <KanbanBoard />
    </div>
  );
};

export default Contenido;
