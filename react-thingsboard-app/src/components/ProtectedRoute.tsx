import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();

  // Check both isAuthenticated state and token in localStorage
  const hasAuth = isAuthenticated || (token && localStorage.getItem("token"));

  if (!hasAuth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
