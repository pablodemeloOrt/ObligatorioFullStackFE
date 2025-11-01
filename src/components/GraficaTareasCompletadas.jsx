import React, { useEffect, useState } from "react";
import Grafica from "./Grafica";
import { useSelector } from "react-redux";

const Graficas = () => {
  const listaTareas = useSelector((state) => state.taskSlice);

  const [tareasCompletadas, setTareasCompletadas] = useState([]);

  const [listaUsuarios, setListaUsuarios] = useState([]);

  useEffect(() => {
    const objetoCompletadas = listaTareas.reduce(callback, {});

    const valores = Object.values(objetoCompletadas);
    const listaUserID = Object.keys(objetoCompletadas);

    console.log("valores", valores);
    console.log("listaUserID", listaUserID);

    console.log("objetoCompletadas", objetoCompletadas);

    setTareasCompletadas(valores);
    setListaUsuarios(listaUserID);
  }, []);

  const callback = (acc, tarea) => {
    console.log("acc", acc);
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
    <>
      <div>Graficas</div>
      <Grafica etiquetas={listaUsuarios} datos={tareasCompletadas}></Grafica>
    </>
  );
};

export default Graficas;
