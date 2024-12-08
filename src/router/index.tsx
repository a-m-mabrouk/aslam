import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loading from "../components/loading";
import PrivateAuth from "../components/privateAuth";
import DashboardLayout from "../components/layout/dashboard";
import {
  PrivateRouteDashboard,
  PrivateRouteStudent,
} from "../components/PrivateRoute";
import StudentLayout from "../components/layout/student";

const Auth = lazy(() => import("../pages/auth"));
const Forgetpassword = lazy(() => import("../pages/auth/forgetpassword"));
const DashboardCourses = lazy(() => import("../pages/dashboard/courses"));
const CourseView = lazy(() => import("../pages/dashboard/courses/view"));
const DashboardStudents = lazy(() => import("../pages/dashboard/students"));
const ViewStudent = lazy(() => import("../pages/dashboard/students/view"));
const Whatsapp = lazy(() => import("../pages/dashboard/whatsapp"));
const Student = lazy(() => import("../pages/student"));
const StudentCourses = lazy(() => import("../pages/student/courses"));
const StudentCourse = lazy(() => import("../pages/student/courses/view"));

const SuspenseRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading position="absolute" />}>{children}</Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SuspenseRoute>
        <PrivateAuth>
          <Auth />
        </PrivateAuth>
      </SuspenseRoute>
    ),
  },
  {
    path: "forgot-password",
    element: (
      <SuspenseRoute>
        <PrivateAuth>
          <Forgetpassword />
        </PrivateAuth>
      </SuspenseRoute>
    ),
  },
  {
    path: "student",
    element: (
      <PrivateRouteStudent>
        <StudentLayout />
      </PrivateRouteStudent>
    ),
    children: [
      {
        path: "home",
        element: (
          <SuspenseRoute>
            <Student />
          </SuspenseRoute>
        ),
      },
      {
        path: "courses",
        element: (
          <SuspenseRoute>
            <StudentCourses />
          </SuspenseRoute>
        ),
      },
      {
        path: "courses/:id",
        element: (
          <SuspenseRoute>
            <StudentCourse />
          </SuspenseRoute>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRouteDashboard>
        <DashboardLayout />
      </PrivateRouteDashboard>
    ),
    children: [
      {
        path: "courses",
        element: (
          <SuspenseRoute>
            <DashboardCourses />
          </SuspenseRoute>
        ),
      },
      {
        path: "courses/:id",
        element: (
          <SuspenseRoute>
            {" "}
            <CourseView />{" "}
          </SuspenseRoute>
        ),
      },
      {
        path: "students",
        element: (
          <SuspenseRoute>
            <DashboardStudents />
          </SuspenseRoute>
        ),
      },
      {
        path: "students/:id",
        element: (
          <SuspenseRoute>
            <ViewStudent />
          </SuspenseRoute>
        ),
      },
      {
        path: "whatsapp",
        element: (
          <SuspenseRoute>
            <Whatsapp />
          </SuspenseRoute>
        ),
      },
    ],
  },
]);

export default function Routers() {
  return <RouterProvider router={router} />;
}
