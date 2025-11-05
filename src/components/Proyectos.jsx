import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TarjetasProyectos from "./TarjetasProyectos";
import CrearProyectoModal from "./CrearProyectoModal";
import Button from "react-bootstrap/Button";
import { getProjectsService } from "../services/projectServices";
import { cargarProyectosIniciales } from "../redux/features/projectSlice";

const Proyectos = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  const handleProjectCreated = async () => {
    // Recargar la lista de proyectos
    try {
      const proyectos = await getProjectsService();
      dispatch(cargarProyectosIniciales(proyectos));
    } catch (error) {
      console.error("Error recargando proyectos:", error);
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: 0 }}>Mis Proyectos</h3>
        <Button 
          variant="success" 
          onClick={() => setShowModal(true)}
          size="sm"
        >
          + Nuevo Proyecto
        </Button>
      </div>
      
      <TarjetasProyectos />
      
      <CrearProyectoModal 
        show={showModal}
        onHide={() => setShowModal(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Proyectos;
