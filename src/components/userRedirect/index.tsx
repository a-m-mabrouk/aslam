import { Navigate } from "react-router";
import { getUserRole } from "../../helper/isAuthenticated";
import {
  AUTH_ROUTES,
  DASHBOARD_ROUTES,
  STUDENT_ROUTES,
} from "../../router/routes/appRoutes";
import { useAppSelector } from "../../store";

export default function UserRedirect() {
  const { isLogin } = useAppSelector((state) => state.auth);
  return isLogin ? (
    getUserRole() ? (
      <Navigate to={STUDENT_ROUTES.student} />
    ) : (
      <Navigate to={DASHBOARD_ROUTES.courses} />
    )
  ) : (
    <Navigate to={AUTH_ROUTES.auth} />
  );
}
