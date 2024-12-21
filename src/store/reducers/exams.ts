import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shuffle } from "../../utilities/shuffleArray";
import { getItemById, updateItem } from "../../utilities/idb";

console.log('first loaded');

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
      const { assessment_id, examAnswers } = payload;
      updateItem(assessment_id, { examAnswers });
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
      { payload }: PayloadAction<AssessmentType | null>,
    ) => {
      if (payload) {
        const questions = payload.questions.map((que) => ({
          ...que,
          question: {
            ...que.question,
            options: shuffle(que.question.options),
          },
        }));
        localStorage.setItem("activeAssessmentId", JSON.stringify(payload?.id));
        state.activeAssessment = { ...payload, questions };
        updateItem(payload.id, { ...payload, questions });
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
      }: PayloadAction<{ assessment_id: number; examTimeRemaining: number }>,
    ) => {
      const { assessment_id, examTimeRemaining } = payload;
      state.examTimeRemaining = examTimeRemaining;
      updateItem(assessment_id, { examTimeRemaining });
    },
    setCurrentQuestionIndex: (
      state,
      {
        payload,
      }: PayloadAction<{
        assessment_id: number;
        currentQuestionIndex: number;
      }>,
    ) => {
      const { assessment_id, currentQuestionIndex } = payload;
      state.currentQuestionIndex = currentQuestionIndex;
      updateItem(assessment_id, { currentQuestionIndex });
    },
    setStartAssessment: (
      state,
      {
        payload,
      }: PayloadAction<{ assessment_id: number; didAssessmentStart: boolean }>,
    ) => {
      const {assessment_id, didAssessmentStart} = payload;
      state.didAssessmentStart = didAssessmentStart;
      console.log(assessment_id, didAssessmentStart);
      
      updateItem(assessment_id, {didAssessmentStart: true})
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