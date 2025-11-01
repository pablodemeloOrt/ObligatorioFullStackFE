import React from "react";
import { useSelector } from "react-redux";

const Tarjetas = () => {
  const taskList = useSelector((state) => state.taskSlice);

  return (
    <div className="tarjetas">
      {taskList?.map((task) => (
        <Tarjeta key={task._id || task.id} {...task}></Tarjeta>
      ))}
    </div>
  );
};

export default Tarjetas;
