import { Navigate } from "react-router-dom";
import {
  AUTH_ROUTES,
  DASHBOARD_ROUTES,
  STUDENT_ROUTES,
} from "../../router/routes/appRoutes";
import { useAppSelector } from "../../store";

export const PrivateRouteDashboard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLogin, role } = useAppSelector((state) => state.auth);
  return isLogin ? (
    role === "teacher" ? (
      children
    ) : (
      <Navigate to={STUDENT_ROUTES.student} />
    )
  ) : (
    <Navigate to={AUTH_ROUTES.auth} />
  );
};

export const PrivateRouteStudent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLogin, role } = useAppSelector((state) => state.auth);
  return isLogin ? (
    role === "student" ? (
      children
    ) : (
      <Navigate to={DASHBOARD_ROUTES.courses} />
    )
  ) : (
    <Navigate to={AUTH_ROUTES.auth} />
  );
};
