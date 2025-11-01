const NombrePersona = ({ recibirNombreDesdeHijo }) => {
  const handleChange = (e) => {
    const texto = e.target.value;
    console.log(`nombre en hijo`, texto);
    recibirNombreDesdeHijo(texto);
  };

  return <input onChange={handleChange} />;
};
export default NombrePersona;
