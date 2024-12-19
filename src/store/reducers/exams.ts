import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { shuffle } from "../../utilities/shuffleArray";
import { getItemById, updateItem } from "../../utilities/idb";

// function getParsedLocalStorage(item: string, defaultValue: unknown) {
//   return localStorage.getItem(item)
//     ? JSON.parse(localStorage.getItem(item)!)
//     : defaultValue;
// }
async function getParsedIndexedDB(item: string, defaultValue: unknown) {
  const assessment_id = localStorage.getItem(item)
    ? JSON.parse(localStorage.getItem(item)!)
    : defaultValue;

  if (assessment_id) {
    const data = await getItemById(assessment_id);
    console.log(data);
    return data? data: null;
  }
}

const initialState: ExamType = {
  examAnswers: [],
  domains: [],
  activeAssessment: null,
  review: false,
  isPaused: true,
  examTimeRemaining: 0,
  activeAssessQuestionIndex: 0,
};
(async () => {
  const activeAssessment = await getParsedIndexedDB("activeAssessmentId", null);
  // Update the state using your state management (e.g., Redux or React state)
  initialState.activeAssessment = activeAssessment? activeAssessment: null;
})();

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
      console.log(payload);

      if (payload) {
        const questions = payload.questions.map((que) => ({
          ...que,
          question: {
            ...que.question,
            options: shuffle(que.question.options),
          },
        }));
        state.activeAssessment = !payload ? null : { ...payload, questions };
        updateItem(payload.id, { ...payload, questions });
        localStorage.setItem("activeAssessmentId", JSON.stringify(payload?.id));
      } else {
        state.activeAssessment = payload;
        // localStorage.setItem(
        //   "activeAssessmentId",
        //   JSON.stringify(null),
        // );
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
    setActiveAssessQuestionIndex: (
      state,
      {
        payload,
      }: PayloadAction<{
        assessment_id: number;
        activeAssessQuestionIndex: number;
      }>,
    ) => {
      const { assessment_id, activeAssessQuestionIndex } = payload;
      state.activeAssessQuestionIndex = activeAssessQuestionIndex;
      updateItem(assessment_id, { activeAssessQuestionIndex });
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
  setReview,
  setIsPaused,
  setExamTimeRemaining,
  setActiveAssessQuestionIndex,
} = examsSlice.actions;

export default examsSlice.reducer;
