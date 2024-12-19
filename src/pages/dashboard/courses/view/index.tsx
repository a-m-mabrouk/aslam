import { useNavigate, useParams } from "react-router";
import { API_COURSES } from "../../../../router/routes/apiRoutes";
import useFetch from "../../../../hooks/useFetch";
import PlaceHolderLoading from "../../../../components/loading/placeHolder";
import CourseInfo from "./template/info";
import { createContext, useEffect } from "react";
import Tabs from "./template/tabs";
import { toastifyBox } from "../../../../helper/toastifyBox";
import { useTranslation } from "react-i18next";

export const ViewCourseContext = createContext<viewCourseContextType>(
  {} as viewCourseContextType,
);
export default function ViewCourse() {
  const { id } = useParams();
  const { t } = useTranslation("alerts");
  const navigate = useNavigate();
  const { data, loading, setData } = useFetch<CoursesListDatum>(
    `${API_COURSES.courses}/${id}`,
  );
  useEffect(() => {
    if (!loading && !data) {
      toastifyBox("error", t("courseIsNotExisted"));
      navigate("/dashboard/courses");
    }
  }, [data, loading, navigate, t]);
  return (
    <PlaceHolderLoading loading={loading}>
      <ViewCourseContext.Provider value={{ course: data, setData }}>
        <div className="grid gap-4">
          <CourseInfo />
          <Tabs />
        </div>
      </ViewCourseContext.Provider>
    </PlaceHolderLoading>
  );
}
