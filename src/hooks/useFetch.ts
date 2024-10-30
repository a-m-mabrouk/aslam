import { useEffect, useState } from "react";
import axiosDefault from "../utilities/axios";
import { store } from "../store";
import { logout } from "../store/reducers/auth";
import { toastifyBox } from "../helper/toastifyBox";

export default function useFetch<t>(
  url: string,
  delay = 100,
  method: "get" | "post" | "put" = "get",
) {
  const [data, setData] = useState<t>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ code: 0, message: "" });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const cleanUp = setTimeout(() => {
      axiosDefault[method](url.replaceAll("undefined", ""), {
        signal: controller.signal,
      })
        .then(({ data }) => {
          if (data.message === "Token Expired") {
            store.dispatch(logout());
            toastifyBox("error", data.message);
          }
          setData(data.data);
          setError((prev) => ({ ...prev, code: 0, message: "" }));
          setLoading(false);
        })
        .catch((err) => {
          if (
            err.message === "cancelled" ||
            (err.code === 500 && !err.message.includes("Internal Server Error"))
          )
            return;
          setLoading(false);
          setError({ code: err.code, message: err.message });
        });
    }, delay);
    return () => {
      clearTimeout(cleanUp);
      controller.abort();
    };
  }, [delay, method, url]);

  return { data, loading, error, setData };
}
