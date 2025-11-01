import React from "react";
import TarjetaProyecto from "./TarjetaProyecto";
import { useSelector } from "react-redux";

const Tarjetas = () => {
  const projectList = useSelector((state) => state.projectSlice);

  return (
    <div className="tarjetas">
      {projectList?.map((project) => (
        <TarjetaProyecto key={project._id || project.id} {...project}></TarjetaProyecto>
      ))}
    </div>
  );
};

export default Tarjetas;
