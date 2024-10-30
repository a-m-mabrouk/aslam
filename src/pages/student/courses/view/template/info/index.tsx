import { Avatar } from "flowbite-react";
import { useContext } from "react";
import { ViewCourseContext } from "../..";
import useGetLang from "../../../../../../hooks/useGetLang";
import InfoItem from "../../../../../../components/infoItem";
import { useTranslation } from "react-i18next";

const flagClass = `text-white text-xs w-fit font-bold px-2.5 py-0.5 rounded `;

export default function CourseInfo() {
  const { t } = useTranslation("viewCourse");
  const { t: tStudents } = useTranslation("students");
  const { t: tInputs } = useTranslation("inputs");
  const { course } = useContext(ViewCourseContext);
  const {
    name,
    photo,
    number_of_student,
    created_from,
    updated_from,
    teacher,
    expiration_date,
    expire: isExpired,
  } = course || {};
  const { lang } = useGetLang();

  return (
    <div className="flex items-start justify-between gap-4">
      <Avatar
        bordered
        alt={name?.[lang] || ""}
        img={photo || ""}
        size="xl"
        className="flex-col md:flex-row"
      >
        <div className=" ms-4 grid gap-4">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {name?.[lang] || ""}
          </h5>
          <div className="flex flex-wrap gap-4">
            <InfoItem
              title={t("teacher")}
              value={`${teacher?.first_name || ""} ${teacher?.last_name || ""}`}
            />
            <InfoItem
              title={t("number_of_student")}
              value={number_of_student}
            />
            <InfoItem title={t("created_from")} value={created_from} />
            <InfoItem title={t("updated_from")} value={updated_from} />
          </div>
          <div className="flex flex-wrap gap-4">
            {isExpired ? (
              <div className={`${flagClass} bg-green-500`}>
                {tStudents("subscribed")}
              </div>
            ) : (
              <div className={`${flagClass} bg-red-500`}>
                {tStudents("notSubscribed")}
              </div>
            )}
            {expiration_date && (
              <div className={`${flagClass} bg-primary`}>
                {tInputs("expiration_date")} : {expiration_date}
              </div>
            )}
          </div>
        </div>
      </Avatar>
    </div>
  );
}
