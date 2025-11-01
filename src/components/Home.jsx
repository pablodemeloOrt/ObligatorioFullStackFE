import { useEffect, useState } from "react";

import { getProjectsService } from "../services/projectServices.js";
import { useDispatch, useSelector } from "react-redux";
import { cargarProyectosIniciales } from "../redux/features/projectSlice.js";
import { getUsersSlice } from "../redux/features/user/userThunk.js";
import Spinner from "./Spinner.jsx";
import Menu from "./Menu.jsx";
import { Navigate, Outlet } from "react-router-dom";


const Home = () => {
  const [logueado, setLogueado] = useState(false);
  const [validandoLogin, setValidandoLogin] = useState(true);

  const cargandoUsuarios = useSelector((state) => state.userSlice.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    const estaLogueado = validarLogueado();

    let cargaUsuarios;

    if (estaLogueado) {
      let cargaUsuarios;
      cargaInicialProyectos();
      cargaUsuarios = cargaInicialUsuarios();
    }

    setValidandoLogin(false);
    setLogueado(estaLogueado);

    return () => {
      cargaUsuarios?.abort();
    };
  }, []);

  const validarLogueado = () => {
    let localStorage = window.localStorage;
    const token = localStorage.getItem("token");
    console.log("token", token);
    return token != null;
  };

  const cargaInicialUsuarios = () => {
    return dispatch(getUsersSlice());
  };

  const cargaInicialProyectos = async () => {
    try {
      const proyectosIniciales = await getProjectsService();

      dispatch(cargarProyectosIniciales(proyectosIniciales));
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
        <Menu title={"Mis proyectos"}></Menu>
        <Outlet></Outlet>
      </div>
    );
  } else {
    return <Navigate to="/login"></Navigate>;
  }
};

export default Home;
