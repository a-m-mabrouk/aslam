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

// type MCQOption = {
//   text: string;
//   isCorrect: boolean;
// };

// type MCQQuestion = {
//   type: 'MCQ';
//   questionText: string;
//   options: MCQOption[];
// };

// type DragDropPair = {
//   left: string;
//   right: string;
// };

// type DragDropQuestion = {
//   type: 'DragDrop';
//   questionText: string;
//   pairs: DragDropPair[];  // Array of left-right pairs for matching
//   optionsLeft: string[];  // Shuffled options for display on the left
//   optionsRight: string[]; // Shuffled options for display on the right
// };

// type Question = MCQQuestion | DragDropQuestion;

// interface ExcelUploadProps {
//   onProcessQuestions: (questions: Question[]) => void;
// }