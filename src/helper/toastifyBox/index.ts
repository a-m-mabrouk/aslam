import { toast } from "react-toastify";

export const toastifyBox: (
  state: "error" | "success" | "warn" | "info",
  massage: string,
) => void = (state, massage) => {
  return toast[state](massage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
