import { useContext } from "react";
import { useTranslation } from "react-i18next";
import CreateChapter from "./create";
import TitleSection from "../../../../../../../components/title";
import { ViewStudentContext } from "../../..";
import InfoItem from "../../../../../../../components/infoItem";
import useGetLang from "../../../../../../../hooks/useGetLang";
import DeleteCourse from "./delete";

export default function Chapters() {
  const { student } = useContext(ViewStudentContext);
  const { courses } = student || {};
  const { t } = useTranslation("students");
  const { lang } = useGetLang();
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-2">
        <TitleSection title={t("courses")} />
        <CreateChapter />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses?.map((course) => (
          <div
          key={course.id}
          className="flex justify-between gap-4 rounded-md bg-primary/10 p-4"
          >
            <div className="flex grow gap-4 ">
              <InfoItem title={t("course")} value={course.name[lang]} />
              <InfoItem
                title={t("expiration_date")}
                value={course.pivot.expiration_date || t("unlimited")}
              />
            </div>

            {(new Date().getTime() <
              new Date(course.pivot.expiration_date || "").getTime() ||
              !course.pivot.expiration_date) && <DeleteCourse id={course.id} />}
          </div>
        ))}

        {courses?.length === 0 && (
          <p className="py-4 text-gray-600">{t("noCourses")}</p>
        )}
      </div>
    </div>
  );
}
