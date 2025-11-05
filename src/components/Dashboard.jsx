import React, { useEffect, useState } from "react";
import { getTasksService } from "../services/taskServices.js";
import { useDispatch, useSelector } from "react-redux";
import { cargarTareasIniciales } from "../redux/features/taskSlice.js";
import { getUsersSlice } from "../redux/features/user/userThunk.js";
import Spinner from "./Spinner.jsx";
import Menu from "./Menu.jsx";
import UsageIndicator from "./IndicadorUso.jsx";
import CambioPlan from "./CambioPlan.jsx";
import { Navigate, Outlet, useParams } from "react-router-dom";


const Dashboard = () => {
  const [logueado, setLogueado] = useState(false);
  const [validandoLogin, setValidandoLogin] = useState(true);
  const { id: projectId } = useParams(); // Obtener el ID del proyecto desde la URL

  const cargandoUsuarios = useSelector((state) => state.userSlice.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    const estaLogueado = validarLogueado();

    let cargaUsuarios;

    if (estaLogueado && projectId) {
      cargaInicialTareas(projectId);
      cargaUsuarios = cargaInicialUsuarios();
    }

    setValidandoLogin(false);
    setLogueado(estaLogueado);

    return () => {
      cargaUsuarios?.abort();
    };
  }, [projectId]); // Recargar cuando cambie el projectId

  const validarLogueado = () => {
    let localStorage = window.localStorage;
    const token = localStorage.getItem("token");
    console.log("token", token);
    return token != null;
  };

  const cargaInicialUsuarios = () => {
    return dispatch(getUsersSlice());
  };

  const cargaInicialTareas = async (projectId) => {
    try {
      const tareasIniciales = await getTasksService(projectId);

      dispatch(cargarTareasIniciales(tareasIniciales));
    } catch (error) {
      console.log("error", error);
    }
  };

  if (cargandoUsuarios || validandoLogin) {
    console.log("entro en cargando");
    return <Spinner></Spinner>;
  }

  if (logueado) {
    return (
      <div className="contenido">
        <Menu title={"Tareas"}></Menu>
        <div className="info-cards-container">
          <UsageIndicator />
          <CambioPlan />
        </div>
        <Outlet></Outlet>
      </div>
    );
  } else {
    return <Navigate to="/login"></Navigate>;
  }
};

export default Dashboard;
