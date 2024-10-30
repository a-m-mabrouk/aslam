import { useParams } from "react-router";
import { API_STUDENTS } from "../../../../router/routes/apiRoutes";
import useFetch from "../../../../hooks/useFetch";
import PlaceHolderLoading from "../../../../components/loading/placeHolder";
import { createContext } from "react";
import Tabs from "./template/tabs";
import StudentInfo from "./template/info";

export const ViewStudentContext = createContext<viewStudentContextType>(
  {} as viewStudentContextType,
);
export default function ViewStudent() {
  const { id } = useParams();
  const { data, loading, setData } = useFetch<StudentView>(
    `${API_STUDENTS.students}/${id}`,
  );

  return (
    <PlaceHolderLoading loading={loading}>
      <ViewStudentContext.Provider value={{ student: data, setData }}>
        <div className="grid gap-4">
          <StudentInfo />
          <Tabs />
        </div>
      </ViewStudentContext.Provider>
    </PlaceHolderLoading>
  );
}
