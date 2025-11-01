import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { getCurrentUserService, upgradePlanService } from "../services/userServices";
import { Plan } from "../constants/constants";

// Recibe 'title' por props (con valor por defecto)
const Menu = ({ title = "Menu" }) => {
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    loadUserPlan();
  }, []);

  const loadUserPlan = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const userData = await getCurrentUserService(userId);
        setUserPlan(userData.plan || Plan.PLUS);
      }
    } catch (error) {
      console.log("Error loading user plan:", error);
      // En caso de error, asumir plan PLUS por defecto
      setUserPlan(Plan.PLUS);
    }
  };

  const handleLogout = () => {
    let localStorage = window.localStorage;
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  const handleUpgradePlan = async () => {
    try {
      setLoading(true);
      setMessage("");
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setMessage("No se encontró el usuario");
        setMessageType("danger");
        return;
      }

      await upgradePlanService(userId);
      await loadUserPlan(); // Recargar el plan actualizado
      setMessage("🎉 ¡Plan actualizado exitosamente!");
      setMessageType("success");
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.log("Error upgrading plan:", error);
      console.log("Error response:", error.response);
      let errorMessage = "Error al actualizar el plan";
      
      if (error.response?.status === 400) {
        // Mostrar el mensaje exacto del servidor si está disponible
        errorMessage = error.response?.data?.message || error.response?.data?.error || "⚠️ Ya tienes el plan Premium o no se puede actualizar";
      } else if (error.response?.status === 403) {
        errorMessage = "⛔ No tienes permisos para actualizar el plan";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setMessageType("danger");
      
      // No limpiar automáticamente los errores para que el usuario pueda leerlos
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadgeVariant = (plan) => {
    return plan === Plan.PREMIUM ? "warning" : "secondary";
  };

  const getPlanDisplayName = (plan) => {
    return plan === Plan.PREMIUM ? "Premium" : "Plus";
  };

  return (
    <header>
      {message && (
        <Alert 
          variant={messageType} 
          onClose={() => setMessage("")} 
          dismissible
          style={{ marginBottom: 0, borderRadius: 0 }}
        >
          {message}
        </Alert>
      )}
      
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            {title}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/graficas">
                  Graficas
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2">
              {userPlan && (
                <>
                  <Badge bg={getPlanBadgeVariant(userPlan)} className="me-2">
                    Plan: {getPlanDisplayName(userPlan)}
                  </Badge>
                  
                  {userPlan === Plan.PLUS && (
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={handleUpgradePlan}
                      disabled={loading}
                      className="me-2"
                    >
                      {loading ? "Actualizando..." : "⬆️ Upgrade a Premium"}
                    </Button>
                  )}
                </>
              )}
              
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Menu;
