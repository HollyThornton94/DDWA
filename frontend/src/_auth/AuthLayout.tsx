import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/AuthHooks";

export const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  return <>{isAuthenticated ? <Navigate to="/" /> : <Outlet />}</>;
};

export default AuthLayout;
