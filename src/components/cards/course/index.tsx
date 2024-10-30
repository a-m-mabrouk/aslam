import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DASHBOARD_ROUTES } from "../../../router/routes/appRoutes";
import DeleteCourse from "./delete";

export function CourseCard({ name, photo, description, id }: CoursesListDatum) {
  const { i18n } = useTranslation();
  const lang = i18n.language as "ar" | "en";
  return (
    <div className="relative">
      <Link to={`${DASHBOARD_ROUTES.courses}/${id}`} className="h-full">
        <Card
          className="relative h-full max-w-full"
          imgAlt="course"
          imgSrc={photo}
        >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name[lang]}
          </h5>
          <p className="line-clamp-2 font-normal text-gray-700 dark:text-gray-400">
            {description[lang]}
          </p>
        </Card>
      </Link>
      <DeleteCourse id={id} />
    </div>
  );
}
