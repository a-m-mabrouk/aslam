import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toastifyBox } from "../../helper/toastifyBox";

const initialState: ExamType = {
  examAnswers: [],
  domains: [],
  activeAssessment: null,
  isAssessmentRunning: false,
  review: false,
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
      state.review = false;
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
    setReview: (state, { payload }: PayloadAction<boolean>) => {
      state.review = payload;
    },
    setIsFlagged: (state, { payload }: PayloadAction<number>) => {
      state.examAnswers[payload].isFlagged =
        !state.examAnswers[payload].isFlagged;
    },
    setDomains: (state, { payload }: PayloadAction<DomainType[]>) => {
      state.domains = payload;
    },
    setActiveAssessment: (state, {payload}: PayloadAction<AssessmentType | null>) => {
      if (state.isAssessmentRunning) {
        toastifyBox("error", "Stop Exam first")
      } else {
        state.activeAssessment = payload;
      }
    },
    setIsAssessmentRunning: (state, {payload}: PayloadAction<boolean>) => {
      state.isAssessmentRunning = payload;
    },
  },
});

export const {
  resetExam,
  setAnswer,
  setSelectedOpt,
  setShowAnsClicked,
  setIsFlagged,
  setAnswerState,
  setDomains,
  setActiveAssessment,
  setIsAssessmentRunning,
  setReview
} = examsSlice.actions;

export default examsSlice.reducer;
