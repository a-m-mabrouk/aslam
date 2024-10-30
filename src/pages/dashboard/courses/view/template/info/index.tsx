import { Avatar } from "flowbite-react";
import BgCard from "../../../../../../components/cards/bg";
import { useContext } from "react";
import { ViewCourseContext } from "../..";
import useGetLang from "../../../../../../hooks/useGetLang";
import InfoItem from "../../../../../../components/infoItem";
import { useTranslation } from "react-i18next";
import EditCourse from "./edit";

export default function CourseInfo() {
  const { t } = useTranslation("viewCourse");
  const { course } = useContext(ViewCourseContext);
  const {
    name,
    description,
    photo,
    number_of_student,
    created_from,
    updated_from,
    teacher,
  } = course || {};
  const { lang } = useGetLang();

  return (
    <BgCard>
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
            <InfoItem
              title={t("description")}
              value={
                <span className=" rounded-md border p-2">
                  {description?.[lang] || ""}
                </span>
              }
            />
          </div>
        </Avatar>
        <EditCourse />
      </div>
    </BgCard>
  );
}
