import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ExamType = {
  examAnswers: [],
  domains: [],
  examQuestions: [],
  assessmentId: null,
  assessmentName: null,
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
    setExamQuestions: (state, {payload}: PayloadAction<Question[]>) => {
      state.examQuestions = payload;
    },
    setAssessmentId: (state, {payload}: PayloadAction<number | null>) => {
      state.assessmentId = payload;
    },
    setAssessmentName: (state, {payload}: PayloadAction<{en:string, ar: string} | null>) => {
      state.assessmentName = payload;
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
  setDomains,
  setExamQuestions,
  setAssessmentId,
  setAssessmentName,
  setReview
} = examsSlice.actions;

export default examsSlice.reducer;
