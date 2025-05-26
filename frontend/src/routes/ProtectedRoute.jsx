import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
const ProtectedRouter = ({ elemen, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return elemen;
}

export default ProtectedRouter