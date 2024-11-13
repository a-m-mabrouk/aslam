import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/auth";
import forgetpasswordReducer from "./reducers/forgetpassword";
import examsReducer from "./reducers/exams";
import studentsReducer from "./reducers/students";
import examsDomainsReducer from "./reducers/examsDomains";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forgetpassword: forgetpasswordReducer,
    exams: examsReducer,
    students: studentsReducer,
    examsDomains: examsDomainsReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
