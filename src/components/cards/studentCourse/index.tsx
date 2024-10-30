import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { STUDENT_ROUTES } from "../../../router/routes/appRoutes";
import useGetLang from "../../../hooks/useGetLang";

const flagClass = `text-white text-xs w-fit font-bold px-2.5 py-0.5 rounded `;
export function StudentCourseCard({
  name,
  photo,
  description,
  id,
  expire: isExpired,
  expiration_date,
}: CoursesListDatum) {
  const { t } = useTranslation("students");
  const { t: tInputs } = useTranslation("inputs");
  const { lang } = useGetLang();

  return (
    <div className="relative">
      <Link to={`${STUDENT_ROUTES.courses}/${id}`} className="h-full">
        <Card
          className="relative h-full max-w-sm"
          imgAlt="course"
          imgSrc={photo}
        >
          <div className="absolute right-2 top-2 grid gap-2">
            {isExpired ? (
              <div className={`${flagClass} bg-green-500`}>
                {t("subscribed")}
              </div>
            ) : (
              <div className={`${flagClass} bg-red-500`}>
                {t("notSubscribed")}
              </div>
            )}
            {expiration_date && (
              <div className={`${flagClass} bg-primary`}>
                {tInputs("expiration_date")} : {expiration_date}
              </div>
            )}
          </div>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name[lang]}
          </h5>
          <p className="line-clamp-2 font-normal text-gray-700 dark:text-gray-400">
            {description[lang]}
          </p>
        </Card>
      </Link>
    </div>
  );
}
