import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../hooks/useAuth";

export default function RequireAuth() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}