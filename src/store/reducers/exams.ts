import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  getItemById,
  IDBAssessmentType,
  updateItem,
} from "../../utilities/idb";

const initialState: ExamType = {
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
      state.assessmentDetails = {
        activeAssessQuestionIndex: 0,
        examTimeRemaining: 0,
        total_degree: 0,
        showReview: false,
        didAssessmentStart: false,
        answeredAtLeastOnce: false,
      };
      if (state.activeAssessment) {
        state.activeAssessment = {
          ...state.activeAssessment,
          questions: state.activeAssessment?.questions.map((q) => ({
            ...q,
            answers: [],
          })),
        };
      }
    },
    setAnswer: (
      state,
      {
        payload,
      }: PayloadAction<{
        questionIndex: number;
        question_id: number;
        domain: string;
        chapter: string;
        answerState: "skipped";
        selectOpt: string;
        isFlagged: boolean;
        showAnsClicked: boolean;
      }>,
    ) => {
      const {
        questionIndex,
        question_id,
        domain,
        chapter,
        answerState,
        selectOpt,
        isFlagged,
        showAnsClicked,
      } = payload;
      const question = state.activeAssessment!.questions[questionIndex];

      question.answers.push({
        question_id,
        selectOpt,
        answerState,
        showAnsClicked,
        isFlagged,
        domain,
        chapter,
      });
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
      const question = state.activeAssessment!.questions[payload.questionIndex];
      if (question.answers[0]) {
        question.answers[0].answerState = payload.answerState;
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
      const question = state.activeAssessment!.questions[payload.questionIndex];
      if (question.answers[0]) {
        question.answers[0].selectOpt = payload.selectOpt;
      }
    },
    setShowAnsClicked: (
      state,
      { payload }: PayloadAction<{ assessment_id: number; ansIndex: number }>,
    ) => {
      getItemById(payload.assessment_id).then((assessment) => {
        if (assessment) {
          const { id, questions } = assessment;
          updateItem(id, {
            ...assessment,
            questions: questions.map((q) =>
              q.id !== id
                ? q
                : {
                    ...q,
                    answers: [
                      {
                        ...q.answers,
                        showAnsClicked: !q.answers[0].showAnsClicked,
                      },
                    ],
                  },
            ),
          });
        }
      });
      const question = state.activeAssessment!.questions[payload.ansIndex];
      if (question.answers[0]) {
        question.answers[0].showAnsClicked = true;
      }
    },
    setIsFlagged: (
      state,
      { payload }: PayloadAction<{ assessment_id: number; ansIndex: number }>,
    ) => {
      getItemById(payload.assessment_id).then((assessment) => {
        if (assessment) {
          const { id, questions } = assessment;
          updateItem(id, {
            ...assessment,
            questions: questions.map((q) =>
              q.id !== id
                ? q
                : {
                    ...q,
                    answers: [
                      {
                        ...q.answers,
                        isFlagged: !q.answers[0].isFlagged,
                      },
                    ],
                  },
            ),
          });
        }
      });
      const question = state.activeAssessment!.questions[payload.ansIndex];
      if (question.answers[0]) {
        question.answers[0].isFlagged = !question.answers[0].isFlagged;
      }
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
        if ("examTimeRemaining" in assessment) {
          const {
            examTimeRemaining,
            didAssessmentStart,
            showReview,
            answeredAtLeastOnce,
            activeAssessQuestionIndex,
            total_degree,
            ...rest
          } = assessment;
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
      if (activeAssessQuestionIndex !== undefined) {
        state.assessmentDetails.activeAssessQuestionIndex =
          activeAssessQuestionIndex;
      }
      if (examTimeRemaining !== undefined) {
        state.assessmentDetails.examTimeRemaining = examTimeRemaining;
      }
      if (total_degree !== undefined) {
        state.assessmentDetails.total_degree = total_degree;
      }
      if (didAssessmentStart !== undefined) {
        state.assessmentDetails.didAssessmentStart = didAssessmentStart;
      }
      if (answeredAtLeastOnce !== undefined) {
        state.assessmentDetails.answeredAtLeastOnce = answeredAtLeastOnce;
      }
      if (showReview !== undefined) {
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
  setActiveAssessment,
  setIsPaused,
  setAssessmentDetails,
} = examsSlice.actions;

export default examsSlice.reducer;
