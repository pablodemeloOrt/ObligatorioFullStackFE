import React, { useEffect, useState } from "react";
import Grafica from "./Grafica";
import { useSelector } from "react-redux";

const GraficaTareasPorEstado = () => {
  const taskList = useSelector((state) => state.taskSlice.tasks);

  const [cantidadesPorEstado, setCantidadesPorEstado] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    calcularEstadisticas();
  }, [taskList]);

  const calcularEstadisticas = () => {
    // Definir los estados y sus etiquetas en español
    const estados = {
      'backlog': 'Backlog',
      'in_progress': 'En Progreso',
      'testing': 'Testing',
      'done': 'Completado'
    };

    // Contar tareas por estado
    const conteo = {
      'backlog': 0,
      'in_progress': 0,
      'testing': 0,
      'done': 0
    };

    // Contar las tareas
    taskList.forEach(tarea => {
      const estado = tarea.status || 'backlog';
      if (conteo.hasOwnProperty(estado)) {
        conteo[estado]++;
      }
    });

    // Preparar datos para la gráfica
    const labels = Object.keys(estados).map(key => estados[key]);
    const datos = Object.keys(estados).map(key => conteo[key]);

    setEtiquetas(labels);
    setCantidadesPorEstado(datos);
  };

  return (
    <div style={{ margin: '0 auto' }}>
      <Grafica 
        etiquetas={etiquetas} 
        datos={cantidadesPorEstado}
        nombreGrafica="Distribución de Tareas"
        nombreDatos="Cantidad"
        compacta={true}
      />
    </div>
  );
};

export default GraficaTareasPorEstado;
