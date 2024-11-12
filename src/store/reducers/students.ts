import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { API_STUDENTS } from "../../router/routes/apiRoutes";
import axiosDefault from "../../utilities/axios";

interface SearchPayloadActionProps {
  success: boolean;
  errors: boolean;
  message: string;
  data: {
    current_page: number;
    data: Student[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: [
      {
        url: null | string;
        label: string;
        active: boolean;
      }[],
    ];
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: number;
    total: number;
  };
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: string;
  grade: string;
  class: string;
  online: number;
  photo: string;
}

interface StudentState {
  data: {
    students: Student[];
    currentPage: number;
    lastPage: number;
  };
  loading: boolean;
  error: string | null;
}

interface FetchStudentsParams {
  search?: string;
  page?: number;
}

// Define the initial state for students
const initialState: StudentState = {
  data: {
    students: [],
    currentPage: 1,
    lastPage: 1,
  },
  loading: false,
  error: null,
};

// Async thunk for fetching students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async ({ page, search }: FetchStudentsParams) => {
    const response = await axiosDefault.get(
      `${API_STUDENTS.students}/search`,
      {
        params: {
          name: search || undefined,
          page: page || undefined,
        }
      }
    );
    return response.data;
  },
);

// Create students slice
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStudents.fulfilled,
        (state, action: PayloadAction<SearchPayloadActionProps>) => {
          const { data } = action.payload;
          state.data.students = data.data;
          state.data.currentPage = data.current_page;
          state.data.lastPage = data.last_page;
          state.loading = false;
        },
      )
      .addCase(fetchStudents.rejected, (state, action) => {
        state.data.students = [];
        state.error = action.error.message || "Failed to fetch students";
        state.loading = false;
      });
  },
});

export default studentsSlice.reducer;
