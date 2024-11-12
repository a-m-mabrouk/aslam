import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DomainType } from "../../pages/dashboard/courses/view/template/tabs/exams/ExamsSidebar";

export interface ExamAnswer {
  selectedOpt: string;
  showAnsClicked: boolean;
  isFlagged: boolean;
  domain: string;
  chapter: string;
  answerstate: "wrong" | "correct" | "skipped";
}

interface ExamType {
  examAnswers: ExamAnswer[];
  examsSideNavState: boolean;
  domains: DomainType[];
  examQuestions: Question[] | null;
  assessmentId: number | null;
}

interface SetAnswerPayload {
  questionIndex: number;
  queAnsDetails: {
    selectedOpt: string;
    showAnsClicked: boolean;
    isFlagged: boolean;
    domain: string;
    chapter: string;
    answerstate: "wrong" | "correct" | "skipped";
  };
}

const initialState: ExamType = {
  examAnswers: [],
  examsSideNavState: false,
  domains: [],
  examQuestions: null,
  assessmentId: null
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
    },
    setAnswer: (state, { payload }: PayloadAction<SetAnswerPayload>) => {
      const { questionIndex, queAnsDetails } = payload;
      state.examAnswers[questionIndex] = queAnsDetails;
    },
    setAnswerState: (
      state,
      {
        payload,
      }: PayloadAction<{
        questionIndex: number;
        answerstate: "wrong" | "correct" | "skipped";
      }>,
    ) => {
      const { questionIndex, answerstate } = payload;
      state.examAnswers[questionIndex].answerstate = answerstate;
    },
    setSelectedOpt: (
      state,
      {
        payload,
      }: PayloadAction<{ questionIndex: number; selectedOpt: string }>,
    ) => {
      const { questionIndex, selectedOpt } = payload;
      state.examAnswers[questionIndex].selectedOpt = selectedOpt;
    },
    setShowAnsClicked: (state, { payload }: PayloadAction<number>) => {
      state.examAnswers[payload].showAnsClicked = true;
    },
    setIsFlagged: (state, { payload }: PayloadAction<number>) => {
      state.examAnswers[payload].isFlagged =
        !state.examAnswers[payload].isFlagged;
    },
    showSideNav: (state) => {
      state.examsSideNavState = true;
    },
    hideSideNav: (state) => {
      state.examsSideNavState = false;
    },
    setDomains: (state, { payload }: PayloadAction<DomainType[]>) => {
      state.domains = payload;
    },
    setExamQuestions: (state, {payload}: PayloadAction<Question[] | null>) => {
      state.examQuestions = payload;
    },
    setAssessmentId: (state, {payload}: PayloadAction<number | null>) => {
      state.assessmentId = payload;
    }
  },
});

export const {
  resetExam,
  setAnswer,
  setSelectedOpt,
  setShowAnsClicked,
  setIsFlagged,
  setAnswerState,
  showSideNav,
  hideSideNav,
  setDomains,
  setExamQuestions,
  setAssessmentId
} = examsSlice.actions;

export default examsSlice.reducer;
