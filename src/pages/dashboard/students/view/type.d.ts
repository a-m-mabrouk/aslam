type viewStudentContextType = {
  student: StudentView | undefined;
  setData: Dispatch<SetStateAction<StudentView | undefined>>;
};

interface StudentView {
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
  courses: StudentCourse[];
}

interface StudentCourse {
  id: number;
  subject: null;
  rate: string;
  grade: null;
  class: null;
  hours: null;
  target: null;
  active: number;
  number_of_student: number;
  photo: string;
  name: Name;
  description: Name;
  created_from: string;
  updated_from: string;
  pivot: Pivot;
}

interface Pivot {
  progress: number;
  expiration_date: null | string;
  assess_progress: number;
}

interface Name {
  ar: string;
  en: string;
}
