import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/ROUTES";

type Props = {
  children: React.ReactNode;
  role?: "ADMIN" | "EMPLOYEE"; 
};

const ProtectedRoute = ({ children, role }: Props) => {
  const { user } = useAuth();
  const location = useLocation();

  //  Not logged in → go login ONLY if not already there
  if (!user) {
    if (location.pathname !== "/") {
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
    return null;
  }

  //  Role mismatch
  if (role && user.role !== role) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;