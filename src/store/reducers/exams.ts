import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toastifyBox } from "../../helper/toastifyBox";
import { shuffle } from "../../utilities/shuffleArray";

function getParsedLocalStorage(item: string, defaultValue: unknown) {
  return localStorage.getItem(item)
    ? JSON.parse(localStorage.getItem(item)!)
    : defaultValue;
}

const initialState: ExamType = {
  examAnswers: getParsedLocalStorage("examAnswers", []),
  domains: [],
  activeAssessment: getParsedLocalStorage("activeAssessment", null),
  isAssessmentRunning: getParsedLocalStorage("isAssessmentRunning", false),
  review: getParsedLocalStorage("review", false),
  isPaused: true,
  examTimeRemaining: getParsedLocalStorage("examTimeRemaining", 0),
  activeAssessQuestionIndex: getParsedLocalStorage(
    "activeAssessQuestionIndex",
    0,
  ),
};

const examsSlice = createSlice({
  name: "exams",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
      state.review = false;
      localStorage.removeItem("examAnswers");
      localStorage.removeItem("review");
    },
    setAnswer: (state, { payload }: PayloadAction<SetAnswerPayload>) => {
      const { questionIndex, queAnsDetails } = payload;
      const localExamAnswer = getParsedLocalStorage("examAnswers", []);
      localExamAnswer[questionIndex] = queAnsDetails;
      localStorage.setItem("examAnswers", JSON.stringify(localExamAnswer));
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
      const localExamAnswer = getParsedLocalStorage("examAnswers", []);
      localExamAnswer[questionIndex].answerstate = answerstate;
      localStorage.setItem("examAnswers", JSON.stringify(localExamAnswer));
      state.examAnswers[questionIndex].answerstate = answerstate;
    },
    setSelectedOpt: (
      state,
      {
        payload,
      }: PayloadAction<{ questionIndex: number; selectedOpt: string }>,
    ) => {
      const { questionIndex, selectedOpt } = payload;
      const localExamAnswer = getParsedLocalStorage("examAnswers", []);
      localExamAnswer[questionIndex].selectedOpt = selectedOpt;
      localStorage.setItem("examAnswers", JSON.stringify(localExamAnswer));
      state.examAnswers[questionIndex].selectedOpt = selectedOpt;
    },
    setShowAnsClicked: (state, { payload }: PayloadAction<number>) => {
      const localExamAnswer = getParsedLocalStorage("examAnswers", []);
      localExamAnswer[payload].showAnsClicked = true;
      localStorage.setItem("examAnswers", JSON.stringify(localExamAnswer));
      state.examAnswers[payload].showAnsClicked = true;
    },
    setReview: (state, { payload }: PayloadAction<boolean>) => {
      state.review = payload;
      localStorage.setItem("review", JSON.stringify(payload));
    },
    setIsFlagged: (state, { payload }: PayloadAction<number>) => {
      const localExamAnswer = getParsedLocalStorage("examAnswers", []);
      localExamAnswer[payload].isFlagged =
        !state.examAnswers[payload].isFlagged;
      localStorage.setItem("examAnswers", JSON.stringify(localExamAnswer));
      state.examAnswers[payload].isFlagged =
        !state.examAnswers[payload].isFlagged;
    },
    setDomains: (state, { payload }: PayloadAction<DomainType[]>) => {
      state.domains = payload;
    },
    setActiveAssessment: (
      state,
      { payload }: PayloadAction<AssessmentType | null>,
    ) => {
      if (state.isAssessmentRunning) {
        toastifyBox("error", "Stop Exam first");
      } else {
        if (payload) {
          const questions = payload.questions.map((que) => ({
            ...que,
            question: {
              ...que.question,
              options: shuffle(que.question.options),
            },
          }));
          state.activeAssessment = !payload ? null : { ...payload, questions };
        } else {
          state.activeAssessment = payload;
        }

        localStorage.setItem("activeAssessment", JSON.stringify(payload));
      }
    },
    setIsAssessmentRunning: (state, { payload }: PayloadAction<boolean>) => {
      state.isAssessmentRunning = payload;
      localStorage.setItem("isAssessmentRunning", JSON.stringify(payload));
    },
    setIsPaused: (state, { payload }: PayloadAction<boolean>) => {
      state.isPaused = payload;
    },
    setExamTimeRemaining: (state, { payload }: PayloadAction<number>) => {
      state.examTimeRemaining = payload;
      localStorage.setItem("examTimeRemaining", JSON.stringify(payload));
    },
    setActiveAssessQuestionIndex: (
      state,
      { payload }: PayloadAction<number>,
    ) => {
      state.activeAssessQuestionIndex = payload;
      localStorage.setItem("activeAssessQuestionIndex", JSON.stringify(payload));
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
  setReview,
  setIsPaused,
  setExamTimeRemaining,
  setActiveAssessQuestionIndex,
} = examsSlice.actions;

export default examsSlice.reducer;
