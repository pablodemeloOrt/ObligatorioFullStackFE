import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import { getCurrentUserService, upgradePlanService } from "../services/userServices";
import { Plan } from "../constants/constants";

const CambioPlan = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
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
      setUserPlan(Plan.PLUS);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = async () => {
    try {
      setUpgrading(true);
      setMessage("");
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setMessage("No se encontró el usuario");
        setMessageType("danger");
        return;
      }

      await upgradePlanService(userId);
      await loadUserPlan(); // Recargar el plan actualizado
      
      // Emitir evento personalizado para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('planUpdated', { detail: { plan: Plan.PREMIUM } }));
      setMessageType("success");
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.log("Error upgrading plan:", error);
      console.log("Error response:", error.response);
      let errorMessage = "Error al actualizar el plan";
      
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || error.response?.data?.error || "Ya tienes el plan Premium o no se puede actualizar";
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para actualizar el plan";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setMessageType("danger");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <Card className="cambio-plan-card">
        <Card.Body>
          <Card.Text>Cargando información del plan...</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="cambio-plan-card">
      <Card.Body>
        <Card.Title>Gestión de Plan</Card.Title>
        
        {message && (
          <Alert variant={messageType} onClose={() => setMessage("")} dismissible className="mb-2" style={{ padding: '8px', fontSize: '0.85rem' }}>
            {message}
          </Alert>
        )}

        <div className="mb-2" style={{ fontSize: '0.9rem' }}>
          <strong>Plan actual:</strong>{" "}
          <Badge bg={userPlan === Plan.PREMIUM ? "warning" : "secondary"} className="ms-1">
            {userPlan === Plan.PREMIUM ? "Premium" : "Plus"}
          </Badge>
        </div>

        {userPlan === Plan.PLUS && (
          <Button 
            variant="primary" 
            onClick={handleUpgradePlan}
            disabled={upgrading}
            className="w-100"
          >
            {upgrading ? "Actualizando..." : "Upgrade a Premium"}
          </Button>
        )}

        {userPlan === Plan.PREMIUM && (
          <Alert variant="success" className="mb-0" style={{ padding: '8px', fontSize: '0.85rem' }}>
            Tienes el plan Premium
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default CambioPlan;
