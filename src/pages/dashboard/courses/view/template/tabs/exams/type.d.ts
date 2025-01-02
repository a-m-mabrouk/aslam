interface Option {
  option: string;
  answer: string;
}

interface QuestionForUpload {
  type: "mcq" | "dragdrop";
  chapter?: string;
  domain?: string;
  name: string;
  description: string;
  degree: number;
  options: Option[];
}

interface Question {
  id: number;
  question: QuestionForUpload;
  answers: ExamAnswer[];
}

interface DraggableAreaProps {
  id: number;
  label: string;
}

interface DroppableAreaProps {
  id: number;
  label: string;
  items: DraggableAreaProps[];
}

interface DraggableItemComponentProps {
  item: DraggableAreaProps;
  onDropBack: (item: DraggableAreaProps) => void;
  checkDisabled: boolean;
}

interface DroppableAreaComponentProps {
  id: number;
  label: string;
  items: DraggableAreaProps[];
  onDropItem: (areaId: number, item: DraggableAreaProps) => void;
  onDropBack: (item: DraggableAreaProps) => void;
  checkDisabled: boolean;
}

interface DomainType {
  id: number;
  course_id: number;
  name: {
    ar: string;
    en: string;
  };
  assessments: AssessmentType[];
  subdomains?: DomainType[];
}
interface AssessmentType {
  id: number;
  module_id: null;
  course_id: number;
  domain_id: number | null;
  subdomain_id: number | null;
  name: {
    ar: string;
    en: string;
  };
  questions: Question[];
  student?: {pivot: {
    activeAssessQuestionIndex: string;
    answeredAtLeastOnce: 0 | 1;
    assessment_id: number;
    didAssessmentStart: 0 | 1;
    examTimeRemaining: string;
    showReview: 0 | 1;
    total_degree: number;
    user_id: number;
  }}[];
}
interface AddNewModalProps {
  modalType: "assessment" | "subdomain" | "domain";
  domainId?: number | null;
  subDomainId?: number | null;
  isEdit?: boolean;
  obj?: DomainType | AssessmentType;
  isButtonDisabled?: boolean;
}
