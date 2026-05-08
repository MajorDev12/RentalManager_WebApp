import { AuthProvider } from "../auth/AuthContext";
import { SearchProvider } from "../context/SearchContext";
import { ToastContainer } from "react-toastify";
import "../css/toast.css";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <SearchProvider>{children}</SearchProvider>
    </AuthProvider>
  );
}
