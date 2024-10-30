import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  email: string;
  step: number;
} = {
  email: "",
  step: 1,
};

const forgetpasswordSlice = createSlice({
  name: "forgetpassword",
  initialState,
  reducers: {
    checkEmail(state, { payload }: PayloadAction<string>) {
      state.email = payload;
    },
    nextStep(state, { payload }: PayloadAction<number | undefined>) {
      state.step = payload || state.step + 1;
    },
    reset(state) {
      state.email = "";
      state.step = 1;
    },
  },
});

export const { checkEmail, nextStep, reset } = forgetpasswordSlice.actions;

export default forgetpasswordSlice.reducer;
