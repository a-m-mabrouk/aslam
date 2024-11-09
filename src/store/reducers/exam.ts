import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

interface SetAnswerPayload {
  questionIndex: number;
  queAnsDetails: {
    selectedOpt: string;
    showAnsClicked: boolean;
    isFlagged: boolean;
    domain: string;
    chapter: string;
    answerstate: "wrong" | "correct" | "skipped"
  };
}

const initialState: ExamType = {
  examAnswers: [],
};

const examSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    resetExam: (state) => {
      state.examAnswers = [];
    },
    setAnswer: (state, { payload }: PayloadAction<SetAnswerPayload>) => {
      const { questionIndex, queAnsDetails } = payload;
      state.examAnswers[questionIndex] = queAnsDetails;
    },
    setAnswerState: (state, {payload}: PayloadAction<{questionIndex: number, answerstate: "wrong" | "correct" | "skipped"}>) => {
      const {questionIndex, answerstate} = payload;
      state.examAnswers[questionIndex].answerstate = answerstate;
    },
    setSelectedOpt: (state, {payload}: PayloadAction<{questionIndex: number, selectedOpt: string}>) => {
      const {questionIndex, selectedOpt} = payload;
      state.examAnswers[questionIndex].selectedOpt = selectedOpt;
    },
    setShowAnsClicked: (state, {payload}: PayloadAction<number>) => {
      state.examAnswers[payload].showAnsClicked = true;
    },
    setIsFlagged: (state, {payload}: PayloadAction<number>) => {
      state.examAnswers[payload].isFlagged = !state.examAnswers[payload].isFlagged;
    }
  },
});

export const { resetExam, setAnswer, setSelectedOpt, setShowAnsClicked, setIsFlagged, setAnswerState } = examSlice.actions;

export default examSlice.reducer;
