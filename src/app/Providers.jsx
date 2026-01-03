import { AuthProvider } from "../auth/AuthContext";

const Providers = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export default Providers;
