// src/auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext  } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthContext ();

  if (isLoading) return null; // or loader

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
