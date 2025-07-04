import { useContext } from "react";
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from "../AuthContext";

export const PrivateRoute = ({ allowedRoles }) => {
  const adminLocal = localStorage.getItem("admin");

  const { admin } = useContext(AuthContext);
  if (!admin && !adminLocal) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    // Jika role tidak diizinkan
    return <Navigate to="/unauthorized" />;
  }

  // Akses OK
  return <Outlet />;
}