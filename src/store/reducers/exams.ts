import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getItemById, IDBAssessmentType, updateItem } from "../../utilities/idb";

const initialState: ExamType = {
  examAnswers: [],
  domains: [],
  activeAssessment: null,
  showReview: false,
  isPaused: true,
  examTimeRemaining: 0,
  currentQuestionIndex: 0,
  didAssessmentStart: false,
  answeredAtLeastOnce: false,
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
      state.showReview = false;
    },
    setAnswer: (state, { payload }: PayloadAction<SetAnswerPayload>) => {
      state.examAnswers = payload.examAnswers;
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
      state.examAnswers[payload.questionIndex].answerstate = payload.answerstate;
    },
    setSelectedOpt: (
      state,
      {
        payload,
      }: PayloadAction<{
        questionIndex: number;
        selectedOpt: string;
      }>,
    ) => {
      state.examAnswers[payload.questionIndex].selectedOpt = payload.selectedOpt;
    },
    setShowAnsClicked: (
      state,
      { payload }: PayloadAction<{ assessment_id: number; ansIndex: number }>,
    ) => {
      const { assessment_id, ansIndex } = payload;
      getItemById(assessment_id).then((assessment) => {
        if (assessment) {
          const examAnswers = [...assessment.examAnswers];
          examAnswers[ansIndex].showAnsClicked = true;
          updateItem(assessment_id, { examAnswers });
        }
      });
      state.examAnswers[ansIndex].showAnsClicked = true;
    },
    setReview: (
      state,
      { payload }: PayloadAction<{ showReview: boolean }>,
    ) => {
      state.showReview = payload.showReview;
    },
    setIsFlagged: (
      state,
      { payload }: PayloadAction<{ assessment_id: number; ansIndex: number }>,
    ) => {
      const { assessment_id, ansIndex } = payload;
      getItemById(assessment_id).then((assessment) => {
        if (assessment) {
          const examAnswers = [...assessment.examAnswers];
          examAnswers[ansIndex].isFlagged = !examAnswers[ansIndex].isFlagged;
          updateItem(assessment_id, { examAnswers });
        }
      });
      state.examAnswers[ansIndex].isFlagged =
        !state.examAnswers[ansIndex].isFlagged;
    },
    setDomains: (state, { payload }: PayloadAction<DomainType[]>) => {
      state.domains = payload;
    },
    setActiveAssessment: (
      state,
      { payload }: PayloadAction<{assessment: AssessmentType | IDBAssessmentType} | null>,
    ) => {
      if (payload) {
        const {assessment} = payload;
        console.log(assessment);
        
        if ('examAnswers' in assessment) {
          const { examAnswers, examTimeRemaining, currentQuestionIndex, didAssessmentStart, showReview,  ...rest } = assessment;
          state.currentQuestionIndex = currentQuestionIndex;
          state.examAnswers = examAnswers;
          state.examTimeRemaining = examTimeRemaining;          
          state.didAssessmentStart = didAssessmentStart;
          state.showReview = showReview;
          state.isPaused = true;
          state.activeAssessment = rest;
        } else {
          state.activeAssessment = assessment;
        }
        localStorage.setItem("activeAssessmentId", JSON.stringify(assessment?.id));
      } else {
        state.activeAssessment = payload;
        localStorage.removeItem("activeAssessmentId");
      }
    },
    setIsPaused: (state, { payload }: PayloadAction<boolean>) => {
      state.isPaused = payload;
    },
    setExamTimeRemaining: (
      state,
      {
        payload,
      }: PayloadAction<{
        examTimeRemaining: number
      }>,
    ) => {
      state.examTimeRemaining = payload.examTimeRemaining;
    },
    setCurrentQuestionIndex: (
      state,
      {
        payload,
      }: PayloadAction<{
        currentQuestionIndex: number;
      }>,
    ) => {
      state.currentQuestionIndex = payload.currentQuestionIndex;
    },
    setStartAssessment: (
      state,
      {
        payload,
      }: PayloadAction<{didAssessmentStart: boolean }>,
    ) => {
      state.didAssessmentStart = payload.didAssessmentStart;
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
  setActiveAssessment,
  setReview,
  setIsPaused,
  setExamTimeRemaining,
  setCurrentQuestionIndex,
  setStartAssessment
} = examsSlice.actions;

export default examsSlice.reducer;