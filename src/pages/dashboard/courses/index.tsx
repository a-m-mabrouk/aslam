import { CourseCard } from "../../../components/cards/course";
import PlaceHolderLoading from "../../../components/loading/placeHolder";
import SectionHeader from "../../../components/sectionHeader";
import useFetch from "../../../hooks/useFetch";
import { API_COURSES } from "../../../router/routes/apiRoutes";
import CreateCourse from "./create";
import { allCoursesContext } from "../../../context/courses";

export default function Courses() {
  const { data, loading, setData } = useFetch<CoursesList>(API_COURSES.courses);

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="courses"
        rightEle={<CreateCourse setData={setData} />}
      />

      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <PlaceHolderLoading loading={loading}>
          <allCoursesContext.Provider value={{ setData }}>
            {data?.map((course) => <CourseCard key={course.id} {...course} />)}
          </allCoursesContext.Provider>
        </PlaceHolderLoading>
      </div>
    </div>
  );
}
