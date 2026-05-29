import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHome = {
  admin: "/admin",
  customer: "/",
  courier: "/courier",
};

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/login"} replace />;
  }

  return children;
}

export default ProtectedRoute;
