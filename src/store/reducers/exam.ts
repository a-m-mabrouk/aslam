import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExamAnswer {
  isCorrect: boolean;
  selectedOpt: string;
  showAnsClicked: boolean;
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
    showQueAns: (state, {payload}: PayloadAction<number>) => {
      state.examAnswers[payload].showAnsClicked = true;
    }
  },
});

export const { resetExam, setAnswer, showQueAns } = examSlice.actions;

export default examSlice.reducer;
