import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, role, children }) => {
  // 1. Si no hay usuario, fuera.
  if (!user) return <Navigate to="/" replace />;

  // 2. Validación de Roles
  if (role) {
    // Convierte "admin, veterinaria" en un array ["admin", "veterinaria"]
    const allowedRoles = Array.isArray(role) ? role : role.split(',').map(r => r.trim());

    // Si el rol del usuario NO está en la lista, fuera.
    if (!allowedRoles.includes(user.role)) {
      console.warn(`Acceso denegado: Rol '${user.role}' no permitido.`);
      return <Navigate to="/" replace />;
    }
  }

  // 3. Todo bien, muestra el contenido
  return children;
};

export default ProtectedRoute;