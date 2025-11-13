import React, { useEffect, useState } from "react";
import Grafica from "../components/Grafica";
import GraficaTareasPorEstado from "../components/GraficaTareasPorEstado";
import { useSelector } from "react-redux";

const Graficas = () => {
  const listaTareas = useSelector((state) => state.taskSlice.tasks);

  const [tareasCompletadas, setTareasCompletadas] = useState([]);

  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    const objetoCompletadas = listaTareas.reduce(callback, {});

    const valores = Object.values(objetoCompletadas);
    const listaUserID = Object.keys(objetoCompletadas);

    setTareasCompletadas(valores);
    setListaUsuarios(listaUserID);
  }, [listaTareas]);

  const callback = (acc, tarea) => {
    if (tarea.completed) {
      if (acc[tarea.userId]) {
        acc[tarea.userId] = acc[tarea.userId] + 1;
      } else {
        acc[tarea.userId] = 1;
      }
    }
    return acc;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Estadísticas de Tareas</h2>
      
      {/* Gráfica de tareas por estado */}
      <GraficaTareasPorEstado />
      
      {/* Gráfica de tareas completadas por usuario */}
      {tareasCompletadas.length > 0 && (
        <div style={{ maxWidth: '800px', margin: '40px auto 20px' }}>
          <Grafica 
            etiquetas={listaUsuarios} 
            datos={tareasCompletadas}
            nombreGrafica="Tareas Completadas por Usuario"
            nombreDatos="Tareas Completadas"
          />
        </div>
      )}
    </div>
  );
};

export default Graficas;
