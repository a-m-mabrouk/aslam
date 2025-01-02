import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getItemById,
  IDBAssessmentType,
  updateItem,
} from "../../utilities/idb";

const initialState: ExamType = {
  examAnswers: [],
  domains: [],
  activeAssessment: null,
  isPaused: true,
  assessmentDetails: {
    activeAssessQuestionIndex: 0,
    examTimeRemaining: 0,
    total_degree: 0,
    showReview: false,
    didAssessmentStart: false,
    answeredAtLeastOnce: false,
  },
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
      state.assessmentDetails = {
        activeAssessQuestionIndex: 0,
        examTimeRemaining: 0,
        total_degree: 0,
        showReview: false,
        didAssessmentStart: false,
        answeredAtLeastOnce: false,
      };
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
        answerState: "wrong" | "correct" | "skipped";
      }>,
    ) => {
      console.log(payload);
      
      // state.examAnswers[payload.questionIndex].answerState =
      //   payload.answerState;
      if (state.activeAssessment) {
        state.activeAssessment.questions[payload.questionIndex].answers[0].answerState =
        payload.answerState;
      }
    },
    setSelectedOpt: (
      state,
      {
        payload,
      }: PayloadAction<{
        questionIndex: number;
        selectOpt: string;
      }>,
    ) => {
      state.examAnswers[payload.questionIndex].selectOpt =
        payload.selectOpt;
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
      {
        payload,
      }: PayloadAction<{
        assessment: AssessmentType | IDBAssessmentType;
      } | null>,
    ) => {
      if (payload) {
        const { assessment } = payload;
        console.log(assessment);

        if ("examAnswers" in assessment) {
          const {
            examAnswers,
            examTimeRemaining,
            didAssessmentStart,
            showReview,
            answeredAtLeastOnce,
            activeAssessQuestionIndex,
            total_degree,
            ...rest
          } = assessment;
          state.examAnswers = examAnswers;
          state.isPaused = true;
          state.assessmentDetails = {
            activeAssessQuestionIndex,
            didAssessmentStart,
            showReview,
            answeredAtLeastOnce,
            examTimeRemaining,
            total_degree,
          };
          state.activeAssessment = rest;
        } else {
          state.activeAssessment = assessment;
        }
        localStorage.setItem(
          "activeAssessmentId",
          JSON.stringify(assessment?.id),
        );
      } else {
        state.activeAssessment = payload;
        localStorage.removeItem("activeAssessmentId");
      }
    },
    setIsPaused: (state, { payload }: PayloadAction<boolean>) => {
      state.isPaused = payload;
    },
    setAssessmentDetails: (
      state,
      {
        payload,
      }: PayloadAction<{
        activeAssessQuestionIndex?: number;
        examTimeRemaining?: number;
        total_degree?: number;
        didAssessmentStart?: boolean;
        showReview?: boolean;
        answeredAtLeastOnce?: boolean;
      }>,
    ) => {
      const {
        activeAssessQuestionIndex,
        examTimeRemaining,
        total_degree,
        didAssessmentStart,
        answeredAtLeastOnce,
        showReview,
      } = payload;
      if (activeAssessQuestionIndex) {
        state.assessmentDetails.activeAssessQuestionIndex =
          activeAssessQuestionIndex;
      }
      if (examTimeRemaining) {
        state.assessmentDetails.examTimeRemaining = examTimeRemaining;
      }
      if (total_degree) {
        state.assessmentDetails.total_degree = total_degree;
      }
      if (didAssessmentStart) {
        state.assessmentDetails.didAssessmentStart = didAssessmentStart;
      }
      if (answeredAtLeastOnce) {
        state.assessmentDetails.answeredAtLeastOnce = answeredAtLeastOnce;
      }
      if (showReview) {
        state.assessmentDetails.showReview = showReview;
      }
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
  setIsPaused,
  setAssessmentDetails,
} = examsSlice.actions;

export default examsSlice.reducer;
