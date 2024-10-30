import { useAppDispatch } from "./store";
import { useTranslation } from "react-i18next";
import { useLayoutEffect } from "react";
import Routers from "./router";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { login } from "./store/reducers/auth";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const user = Cookies.get("authToken");
    if (user) {
      dispatch(login(JSON.parse(user)));
    }
  }, [dispatch]);
  return (
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"} className="relative">
      <Routers />
      <ToastContainer />
    </div>
  );
}

export default App;
