import axios from "axios";
import { handleErrorAxiosV2 } from "./handleErrorAxiosDashboard.ts";
import Cookies from "js-cookie";

const axiosDefault = axios.create({
  transformRequest: function (body) {
    const formData = new FormData();
    for (const key in body) {
      formData.append(key, body[key]);
    }
    return formData;
  },
});

axiosDefault.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${Cookies.get("tk") || ""}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosDefault.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(handleErrorAxiosV2(error));
  },
);

export default axiosDefault;
