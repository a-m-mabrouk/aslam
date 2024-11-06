import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExamAnswer {
  isCorrect: boolean;
  selectedOpt: string;
  showAnsClicked: boolean;
  isFlagged: boolean;
}

interface ExamType {
  examAnswers: ExamAnswer[];
}

interface SetAnswerPayload {
  questionIndex: number;
  queAnsDetails: {
    isCorrect: boolean;
    selectedOpt: string;
    showAnsClicked: boolean;
    isFlagged: boolean;
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
    setIsCorrect: (state, {payload}: PayloadAction<{questionIndex: number, isCorrect: boolean}>) => {
      const {questionIndex, isCorrect} = payload;
      state.examAnswers[questionIndex].isCorrect = isCorrect;
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

export const { resetExam, setAnswer, setIsCorrect, setSelectedOpt, setShowAnsClicked, setIsFlagged } = examSlice.actions;

export default examSlice.reducer;
