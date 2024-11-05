import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/auth";
import forgetpasswordReducer from "./reducers/forgetpassword";
import layoutReducer from "./reducers/layout";
import examReducer from "./reducers/exam";
import studentsReducer from "./reducers/students";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgetpassword: forgetpasswordReducer,
    layout: layoutReducer,
    exam: examReducer,
    students: studentsReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
