import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
}

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    const userRole = decodedToken.role;
    if (allowedRoles.includes(userRole)) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
