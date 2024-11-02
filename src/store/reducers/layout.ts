import { createSlice } from "@reduxjs/toolkit";

interface LayoutType {
  examsSideNavState: boolean
}

const initialState: LayoutType = {
  examsSideNavState: false,
};

const authSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    showSideNav: (state) => {
      state.examsSideNavState = true;
    },
    hideSideNav: (state) => {
      state.examsSideNavState = false;
    },
  },
});

export const { showSideNav, hideSideNav } = authSlice.actions;

export default authSlice.reducer;
