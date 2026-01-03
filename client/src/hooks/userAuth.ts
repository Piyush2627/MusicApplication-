import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  const authUser = useMemo(() => {
    let storageUser = null;
    if (user) {
      try {
        storageUser = JSON.parse(user);
      } catch {
        storageUser = null;
      }
    }

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // console.log("Decoded Token:", decoded); // Debugging
        // console.log("Storage User:", storageUser); // Debugging
        return {
          name: decoded.name || storageUser?.name || storageUser?.userName,
          email: decoded.email || storageUser?.email,
          role: decoded.role || storageUser?.role,
          studentId: decoded.studentId || storageUser?.studentId,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    return storageUser;
  }, [user, token]);

  return { token, user: authUser };
}
