interface ExamAnswer {
  question_id: number;
  selectedOpt: string;
  showAnsClicked: boolean;
  isFlagged: boolean;
  domain: string;
  chapter: string;
  answerstate: "wrong" | "correct" | "skipped";
}

interface ExamType {
  examAnswers: ExamAnswer[];
  domains: DomainType[];
  activeAssessment: AssessmentType | null;
  review: boolean;
  isPaused: boolean;
  examTimeRemaining: number;
  currentQuestionIndex: number;
  didAssessmentStart: boolean;
}

interface SetAnswerPayload {
  assessment_id: number;
  examAnswers: {
    // questionIndex: number;
    // queAnsDetails: {
      question_id: number;
      selectedOpt: string;
      showAnsClicked: boolean;
      isFlagged: boolean;
      domain: string;
      chapter: string;
      answerstate: "wrong" | "correct" | "skipped";
    // };
  }[];
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
