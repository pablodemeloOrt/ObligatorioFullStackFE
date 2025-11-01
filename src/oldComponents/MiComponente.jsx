import React, { useState } from "react";
export default function MiComponente() {
  const [valores, setValores] = useState({ nombre: "", tik: false });

  const handleChange = (e) => {
    setValores((valoresActuales) => {
      console.log(`valoresActuales`, valoresActuales);
      console.log(`e.target.name`, e.target.name);

      return {
        ...valoresActuales,
        [e.target.name]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      };
    });
  };

  return (
    <div>
      <input
        type="text"
        name="nombre"
        value={valores.nombre}
        placeholder="Ingrese nombre"
        onChange={handleChange}
      />
      <input
        type="checkbox"
        name="tik"
        checked={valores.tik}
        onChange={handleChange}
      />
    </div>
  );
}
