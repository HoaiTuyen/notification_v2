// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("access_token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = jwtDecode(token);

    const roles = payload.role || [];

    const authority = roles.length > 0 ? roles[0].authority : "STUDENT";
    if (!allowedRoles.includes(authority)) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error parsing token:", error);
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;
