import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getItemById, IDBAssessmentType, updateItem } from "../../utilities/idb";

const initialState: ExamType = {
  examAnswers: [],
  domains: [],
  activeAssessment: null,
  review: false,
  isPaused: true,
  examTimeRemaining: 0,
  currentQuestionIndex: 0,
  didAssessmentStart: false,
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
      state.review = false;
      // localStorage.removeItem("examAnswers");
      // localStorage.removeItem("review");
    },
    setAnswer: (state, { payload }: PayloadAction<SetAnswerPayload>) => {
      const { examAnswers } = payload;
      // updateItem(assessment_id, { examAnswers });
      state.examAnswers = examAnswers;
    },
    setAnswerState: (
      state,
      {
        payload,
      }: PayloadAction<{
        assessment_id: number;
        questionIndex: number;
        answerstate: "wrong" | "correct" | "skipped";
      }>,
    ) => {
      const { assessment_id, questionIndex, answerstate } = payload;
      getItemById(assessment_id).then((assessment) => {
        if (assessment) {
          const examAnswers = [...assessment.examAnswers];          
          examAnswers[questionIndex].answerstate = answerstate;
          updateItem(assessment_id, { examAnswers });
        }
      });
      state.examAnswers[questionIndex].answerstate = answerstate;
    },
    setSelectedOpt: (
      state,
      {
        payload,
      }: PayloadAction<{
        assessment_id: number;
        questionIndex: number;
        selectedOpt: string;
      }>,
    ) => {
      const { assessment_id, questionIndex, selectedOpt } = payload;
      getItemById(assessment_id).then((assessment) => {
        if (assessment) {
          const examAnswers = [...assessment.examAnswers];
          examAnswers[questionIndex].selectedOpt = selectedOpt;
          updateItem(assessment_id, { examAnswers });
        }
      });
      state.examAnswers[questionIndex].selectedOpt = selectedOpt;
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
      { payload }: PayloadAction<{ assessment_id: number; review: boolean }>,
    ) => {
      const { assessment_id, review } = payload;
      state.review = review;
      updateItem(assessment_id, { review });
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
        if ('examAnswers' in assessment) {
          const { examAnswers, examTimeRemaining, currentQuestionIndex, didAssessmentStart, review, ...rest } = assessment;
          state.currentQuestionIndex = currentQuestionIndex;
          state.examAnswers = examAnswers;
          state.examTimeRemaining = examTimeRemaining;          
          state.didAssessmentStart = didAssessmentStart;
          state.review = review;
          state.isPaused = true;
          state.activeAssessment = rest;
        } else {
          // const questions = assessment.questions.map((que) => ({
          //   ...que,
          //   question: {
          //     ...que.question,
          //     options: shuffle(que.question.options),
          //   },
          // }));
          state.activeAssessment = assessment;
          // state.activeAssessment = { ...assessment, questions };
          // updateItem(assessment.id, { ...assessment, questions });
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
        // assessment_id: number;
        examTimeRemaining: number
      }>,
    ) => {
      const { examTimeRemaining } = payload;
      state.examTimeRemaining = examTimeRemaining;
      // updateItem(assessment_id, { examTimeRemaining });
    },
    setCurrentQuestionIndex: (
      state,
      {
        payload,
      }: PayloadAction<{
        // assessment_id: number;
        currentQuestionIndex: number;
      }>,
    ) => {
      const { currentQuestionIndex } = payload;
      state.currentQuestionIndex = currentQuestionIndex;
      // updateItem(assessment_id, { currentQuestionIndex });
    },
    setStartAssessment: (
      state,
      {
        payload,
      }: PayloadAction<{didAssessmentStart: boolean }>,
    ) => {
      const {didAssessmentStart} = payload;
      state.didAssessmentStart = didAssessmentStart;
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