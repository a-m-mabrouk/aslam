import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store";
import { DASHBOARD_ROUTES } from "../../router/routes/appRoutes";

const PrivateAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLogin } = useAppSelector((state) => state.auth);
  return !isLogin ? children : <Navigate to={DASHBOARD_ROUTES.courses} />;
};

export default PrivateAuth;
