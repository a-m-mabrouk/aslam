interface ExamAnswer {
  question_id: number;
  selectOpt: string;
  showAnsClicked: boolean;
  isFlagged: boolean;
  domain: string;
  chapter: string;
  answerState: "wrong" | "correct" | "skipped";
}

interface ExamType {
  domains: DomainType[];
  activeAssessment: AssessmentType | null;
  isPaused: boolean;
  assessmentDetails: {
    activeAssessQuestionIndex: number;
    examTimeRemaining: number;
    total_degree: number;
    showReview: boolean;
    didAssessmentStart: boolean;
    answeredAtLeastOnce: boolean;
  };
}

interface SearchPayloadActionProps {
  success: boolean;
  errors: boolean;
  message: string;
  data: {
    current_page: number;
    data: Student[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: [
      {
        url: null | string;
        label: string;
        active: boolean;
      }[],
    ];
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: number;
    total: number;
  };
}

interface Student {
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
}

interface StudentState {
  data: {
    students: Student[];
    currentPage: number;
    lastPage: number;
  };
  loading: boolean;
  error: string | null;
}

interface FetchStudentsParams {
  search?: string;
  page?: number;
}
