import Router from "./Router";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setNavigator } from "../helpers/navigation";
import "../css/App.css";

export default function App() {
    const navigate = useNavigate();
  
    useEffect(() => {
      setNavigator(navigate);
    }, [navigate]);
  return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          newestOnTop
          pauseOnHover
        />
        <Router />
      </>
  );
}
