type CoursesList = CoursesListDatum[];

interface CoursesListDatum {
  id: number;
  subject: string;
  rate: string;
  grade: null;
  class: null;
  hours: null;
  target: null;
  expire: boolean;
  expiration_date: string | null;
  active: number;
  number_of_student: number;
  photo: string;
  name: objectLang;
  description: objectLang;
  created_from: string;
  updated_from: string;
  teacher: CoursesListDatumTeacher;
  modules: Module[];
  file: CourseFile[];
  students: StudentCourse[];
}

interface StudentCourse {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: string;
  grade: string;
  class: string;
  online: number;
  photo: string;
  pivot: Pivot;
}

interface CourseFile {
  id: number;
  path: string;
  type: string;
}

interface Module {
  id: number;
  name: objectLang;
  lessons: Lesson[];
  assessments: null;
}
interface Lesson {
  course_id: string;
  module_id: string;
  id: number;
  name: objectLang;
  description: objectLang;
  resources: Resource[];
}

interface Resource {
  id: number;
  path: string;
  type: string;
}

interface CoursesListDatumTeacher {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  code: string;
  photo: string;
}

interface objectLang {
  ar: string;
  en: string;
}

type viewCourseContextType = {
  course: CoursesListDatum | undefined;
  setData: Dispatch<SetStateAction<CoursesListDatum | undefined>>;
};
type allCoursesContextType = {
  setData: Dispatch<SetStateAction<CoursesList | undefined>>;
};