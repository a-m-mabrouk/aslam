export const API_DOMAIN = "https://e-learning.powersgate.com/api";

export const API_AUTH = {
  register: `${API_DOMAIN}/register`,
  login: `${API_DOMAIN}/login`,
  forgetPassword: `${API_DOMAIN}/forget-password`,
  verifyCode: `${API_DOMAIN}/verify-code`,
  resetPassword: `${API_DOMAIN}/reset-password`,
};

export const API_COURSES = {
  courses: `${API_DOMAIN}/Courses`,
  modules: `${API_DOMAIN}/Modules`,
  lessons: `${API_DOMAIN}/Lessons`,
  recourses: `${API_DOMAIN}/Resource`,
};

export const API_STUDENTS = {
  students: `${API_DOMAIN}/Students`,
  studentCourse: `${API_DOMAIN}/StudentsCourses`,
  removeStudentCourse: `${API_DOMAIN}/StudentsCourses/removeStudentsFromCourse`,
};
export const API_WHATSAPP = {
  getNumber: `${API_DOMAIN}/update/1`,
  updateNumber: `${API_DOMAIN}/update/1`,
};
export const API_EXAMS = {
  domains: `${API_DOMAIN}/Domain`,
  subdomain: `${API_DOMAIN}/Subdomain`,
  assessments: `${API_DOMAIN}/Assessments`,
  mistakesExams: `${API_DOMAIN}/mistakesExams`,
  questions: `${API_DOMAIN}/Questions`,
  answer: `${API_DOMAIN}/answer`,
  deleteAllQuestions: `${API_DOMAIN}/DeleteAllQuestions`,
};
