import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { getCurrentUserService } from "../services/userServices";
import { Plan } from "../constants/constants";

// Recibe 'title' por props (con valor por defecto)
const Menu = ({ title = "Menu" }) => {
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState(null);

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
    }
  };

  const handleLogout = () => {
    let localStorage = window.localStorage;
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    navigate("/login");
  };

  const getPlanBadgeVariant = (plan) => {
    return plan === Plan.PREMIUM ? "warning" : "secondary";
  };

  const getPlanDisplayName = (plan) => {
    return plan === Plan.PREMIUM ? "Premium" : "Plus";
  };

  return (
    <header>
      
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
                <Badge bg={getPlanBadgeVariant(userPlan)} className="me-2">
                  Plan: {getPlanDisplayName(userPlan)}
                </Badge>
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
