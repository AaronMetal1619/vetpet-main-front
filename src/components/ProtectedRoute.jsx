import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, children }) => {
  // 1. Si no hay usuario, fuera.
  if (!user) return <Navigate to="/" />;

  // 2. Validación de Roles (Ahora soporta listas separadas por coma)
  if (role) {
    // Convierte "admin, veterinaria" en ["admin", "veterinaria"]
    const allowedRoles = role.split(',').map(r => r.trim());

    // Si el rol del usuario NO está en la lista, fuera.
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
  }

  // 3. Todo bien, muestra el Dashboard
  return children;
};

export default ProtectedRoute;