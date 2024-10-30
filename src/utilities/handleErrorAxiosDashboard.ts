/* eslint-disable @typescript-eslint/no-explicit-any */

import { store } from "../store";
import { logout } from "../store/reducers/auth";
import { toastifyBox } from "../helper/toastifyBox";

export function handleErrorAxiosV2(error: any) {
  let errorSchema: ErrorResponse = {
    message: "",
    code: 0,
  };

  if (
    (error.response.status === 500 &&
      error.response.data.message === "The token has been blacklisted") ||
    error.response.status === 401
  ) {
    toastifyBox("error", "Token Expired");
    store.dispatch(logout());
  }
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx

    errorSchema = {
      ...errorSchema,
      code: error.response.status,
      message: error.response.data.message,
    };
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    errorSchema = {
      ...errorSchema,
      message: "Something went wrong with the request",
      code: 500,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    errorSchema = {
      ...errorSchema,
      code: 500,
      message: error.message || "Internal Server Error",
    };
  }

  return errorSchema;
}
