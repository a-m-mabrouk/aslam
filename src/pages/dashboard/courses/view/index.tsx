import { useParams } from "react-router";
import { API_COURSES } from "../../../../router/routes/apiRoutes";
import useFetch from "../../../../hooks/useFetch";
import PlaceHolderLoading from "../../../../components/loading/placeHolder";
import CourseInfo from "./template/info";
import { createContext } from "react";
import Tabs from "./template/tabs";

export const ViewCourseContext = createContext<viewCourseContextType>(
  {} as viewCourseContextType,
);
export default function ViewCourse() {
  const { id } = useParams();
  const { data, loading, setData } = useFetch<CoursesListDatum>(
    `${API_COURSES.courses}/${id}`,
  );

  return (
    <PlaceHolderLoading loading={loading}>
      <ViewCourseContext.Provider value={{ course: data, setData }}>
        <div className="grid gap-4">
          <CourseInfo />
          <Tabs />
        </div>
      </ViewCourseContext.Provider>
    </PlaceHolderLoading>
  )
}
