import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCurrentUserService } from "../services/userServices";
import { Plan } from "../constants/constants";
import ProgressBar from "react-bootstrap/ProgressBar";
import Card from "react-bootstrap/Card";

const UsageIndicator = () => {
  const [userPlan, setUserPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const tasks = useSelector((state) => state.taskSlice.tasks);

  const PLUS_LIMIT = 10;

  useEffect(() => {
    loadUserPlan();
    
    const handlePlanUpdate = (event) => {
      console.log("Plan actualizado, recargando...", event.detail);
      loadUserPlan();
    };
    
    window.addEventListener('planUpdated', handlePlanUpdate);
    
    return () => {
      window.removeEventListener('planUpdated', handlePlanUpdate);
    };
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

  if (loading) {
    return (
      <Card className="usage-indicator">
        <Card.Body>
          <Card.Text>Cargando...</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  const taskCount = tasks.length;

  // Para usuarios PLUS: mostrar porcentaje
  if (userPlan === Plan.PLUS) {
    const percentage = Math.min((taskCount / PLUS_LIMIT) * 100, 100);
    const variant = percentage >= 90 ? "danger" : percentage >= 70 ? "warning" : "success";

    return (
      <Card className="usage-indicator">
        <Card.Body>
          <Card.Title>Uso de Tareas</Card.Title>
          <Card.Text>
            {taskCount} de {PLUS_LIMIT} tareas
          </Card.Text>
          <ProgressBar 
            now={percentage} 
            variant={variant}
            label={`${percentage.toFixed(0)}%`}
          />
          {percentage >= 90 && (
            <Card.Text className="text-danger mt-1" style={{ fontSize: '0.85rem' }}>
              Cerca o superior al limite, solo usuarios PREMIUM pueden agregar más tareas.
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Para usuarios PREMIUM: mostrar cantidad
  if (userPlan === Plan.PREMIUM) {
    return (
      <Card className="usage-indicator">
        <Card.Body>
          <Card.Title>Uso de Tareas</Card.Title>
          <Card.Text>
            <strong>Tareas:</strong> {taskCount}
          </Card.Text>
          <Card.Text className="text-success" style={{ fontSize: '0.85rem' }}>
            ✓ Ilimitadas
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return null;
};

export default UsageIndicator;
