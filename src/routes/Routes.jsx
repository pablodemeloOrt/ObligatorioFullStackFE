import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import Home from "../components/Home";
import Contenido from "../components/Contenido";
import Proyectos from "../components/Proyectos";
import Signup from "../components/Registrar.jsx";

const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/" element={<Home />}>
          <Route index element={<Proyectos />} />
        </Route>
        <Route path="/project/:id" element={<Dashboard />}>
          <Route index element={<Contenido />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace></Navigate>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Rutas;
