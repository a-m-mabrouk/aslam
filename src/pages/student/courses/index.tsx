import { useTranslation } from "react-i18next";
import useFetch from "../../../hooks/useFetch";
import { API_COURSES } from "../../../router/routes/apiRoutes";
import TitleSection from "../../../components/title";
import { StudentCourseCard } from "../../../components/cards/studentCourse";
import WhatsappFAB from "../../../components/whatsappFAB";

export default function StudentCourses() {
  const { t } = useTranslation("students");
  const { data } = useFetch<CoursesList>(API_COURSES.courses);

  return (
    <div className={`container mx-auto p-4 `}>
      <WhatsappFAB />
      <TitleSection title={t("courses")} />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.map((course) => (
          <StudentCourseCard {...course} key={course.id} />
        ))}

        {data?.length === 0 && <p className="text-center">{t("noCourses")}</p>}
      </div>
    </div>
  );
}
