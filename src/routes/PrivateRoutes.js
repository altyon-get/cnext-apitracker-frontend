import { Navigate } from "react-router-dom";
import Login from "../pages/Login";

export const LoginRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/api-list" /> : <Login />;
};

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
