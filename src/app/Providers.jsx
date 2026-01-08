import { AuthProvider } from "../auth/AuthContext";
import { ToastContainer } from "react-toastify";
import "../css/toast.css";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
