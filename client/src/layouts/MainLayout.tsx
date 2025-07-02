import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
}

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const publicRoutes = ["/home", "/login", "/signup", "/"];

    if (token && publicRoutes.includes(location.pathname)) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userRole = decodedToken.role;
        if (userRole === 'admin') {
          navigate("/admin/dashboard", { replace: true });
        } else if (userRole === 'student') {
          navigate("/student/dashboard", { replace: true });
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    } else {
      setLoading(false);
    }
  }, [navigate, location.pathname]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default MainLayout;
