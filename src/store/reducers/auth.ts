import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface userLoginType {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  code: string;
  username: string;
  phone_number: string;
  id: number;
  photo: string;
  access_token: string;
}

const authToken = Cookies.get("authToken") || "{}";
const { role } = JSON.parse(authToken);

const initialState: userLoginType & { isLogin: boolean } = {
  isLogin: Cookies.get("authToken") ? true : false,
  first_name: "",
  last_name: "",
  email: "",
  role: role || "",
  code: "",
  username: "",
  phone_number: "",
  id: 0,
  photo: "",
  access_token: "",
};
// const initialState: userLoginType & { isLogin: boolean } = {
//   isLogin: true,
//   first_name: "test",
//   last_name: "abo test",
//   email: "test@mail.com",
//   role: "teacher",
//   code: "1",
//   username: "test123",
//   phone_number: "01234567890",
//   id: 1,
//   photo: "",
//   access_token: "",
// };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<userLoginType>) => {
      state.isLogin = true;
      state.first_name = payload.first_name;
      state.last_name = payload.last_name;
      state.email = payload.email;
      state.role = payload.role;
      state.code = payload.code;
      state.username = payload.username;
      state.phone_number = payload.phone_number;
      state.id = payload.id;
      state.photo = payload.photo;
      state.access_token = payload.access_token;

      Cookies.set("authToken", JSON.stringify(state), {
        expires: 1,
      });
      Cookies.set("userRole", state.role, {
        expires: 1,
      });
      Cookies.set("tk", state.access_token, { expires: 1 });
    },
    logout: (state) => {
      state.isLogin = false;
      state.first_name = "";
      state.last_name = "";
      state.email = "";
      state.role = "";
      state.code = "";
      state.username = "";
      state.phone_number = "";
      state.id = 0;
      state.photo = "";
      state.access_token = "";
      Cookies.remove("authToken");
      Cookies.remove("userRole");
      Cookies.remove("tk");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
