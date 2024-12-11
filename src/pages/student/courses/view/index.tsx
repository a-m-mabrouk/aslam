import { useNavigate, useParams } from "react-router";
import { API_COURSES } from "../../../../router/routes/apiRoutes";
import useFetch from "../../../../hooks/useFetch";
import PlaceHolderLoading from "../../../../components/loading/placeHolder";
import CourseInfo from "./template/info";
import { createContext, useEffect } from "react";
import Tabs from "./template/tabs";
import BgCard from "../../../../components/cards/bg";
import { toastifyBox } from "../../../../helper/toastifyBox";
import { useTranslation } from "react-i18next";
import WhatsappFAB from "../../../../components/whatsappFAB";

export const ViewCourseContext = createContext<viewCourseContextType>({} as viewCourseContextType);

export default function ViewCourse() {
  const { t } = useTranslation("alerts");
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, loading, setData } = useFetch<CoursesListDatum>(`${API_COURSES.courses}/${id}`);

  useEffect(() => {
    if (data && !data?.expire) {
      toastifyBox("error", t("notSubscibedToCourse"));
      navigate('/student/courses');
    }
  }, [data, navigate, t]); // Add dependencies to the useEffect hook

  return (
    <PlaceHolderLoading loading={loading}>
      <ViewCourseContext.Provider value={{ course: data, setData }}>
        <div className="container mx-auto mt-4 grid gap-4 p-4">
          <BgCard>
            <CourseInfo />
          </BgCard>
          <BgCard>
            <Tabs />
            <WhatsappFAB />
          </BgCard>
        </div>
      </ViewCourseContext.Provider>
    </PlaceHolderLoading>
  );
}
