import React from "react";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { addTaskSlice } from "../redux/features/taskSlice";

const Agregar = () => {
  const dispatch = useDispatch();

  const inputRef = useRef();

  const [title, setTitle] = useState("");

  const handleTitle = (e) => {
    const auxTitle = e.target.value;
    console.log("auxTitle", auxTitle);
    setTitle(auxTitle);
  };

  const handleClick = () => {
    const id = 201;
    const userId = 1;

    console.log("inputRef.current", inputRef.current);

    const payload = {
      title: title,
      id: id,
      userId: userId,
      completed: false,
    };

    dispatch(addTaskSlice(payload));

    console.log("title", title);
  };

  return (
    <div className="agregar">
      <label htmlFor="txtAgregar">Agregar:</label>
      <input
        type="text"
        name="txtAgregar"
        id="txtAgregar"
        value={title}
        onChange={handleTitle}
      />

      <input type="button" value="Agregar" onClick={handleClick} />
    </div>
  );
};

export default Agregar;
