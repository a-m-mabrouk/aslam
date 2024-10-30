import axios from "axios";
import { handleErrorAxiosV2 } from "./handleErrorAxiosDashboard.ts";
import Cookies from "js-cookie";

const axiosJson = axios.create();

axiosJson.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${Cookies.get("tk") || ""}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosJson.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(handleErrorAxiosV2(error));
  },
);

export default axiosJson;
