// PublicRoute.jsx
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem("accessToken"); // or use your auth context/store

  return isLoggedIn ? <Navigate to="/" /> : children;
};

export default PublicRoute;
