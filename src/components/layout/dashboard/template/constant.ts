import { AcademicCapIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { DASHBOARD_ROUTES } from "../../../../router/routes/appRoutes";

export const SIDEBAR_ITEMS = [
  {
    name: "courses",
    path: DASHBOARD_ROUTES.courses,
    icon: AcademicCapIcon,
  },
  {
    name: "students",
    path: DASHBOARD_ROUTES.students,
    icon: UserGroupIcon,
  },
  {
    name: "whatsapp",
    path: DASHBOARD_ROUTES.whatsapp,
    icon: ChatBubbleOvalLeftIcon,
  },
];
