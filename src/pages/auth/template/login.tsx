/* eslint-disable tailwindcss/classnames-order */
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { InputText } from "../../../components/form/textInput";
import PrimaryBtn from "../../../components/button/primaryBtn";
import { useFormik } from "formik";
import axiosDefault from "../../../utilities/axios";
import { API_AUTH } from "../../../router/routes/apiRoutes";
import { loginSchema } from "../../../helper/validation/validation";
import { useAppDispatch } from "../../../store";
import { login } from "../../../store/reducers/auth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { fadeIn } from "../../../utilities/motion";
import { toastifyBox } from "../../../helper/toastifyBox";

export default function Login({
  view,
  setView,
}: {
  view: boolean;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { errors, touched, handleSubmit, handleChange, handleBlur, values } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const { data } = await axiosDefault.post(API_AUTH.login, {
            ...values,
          });

          setLoading(false);
          dispatch(login(data.data));
        } catch (err) {
          const { message } = err as Error;
          setLoading(false);
          toastifyBox("error", message);
        }
      },
    });
  return (
    <div
      className={`grid-cols-1 place-content-center  gap-4  px-5 py-10 ${view ? "grid" : "hidden md:grid"}`}
    >
      <motion.h2
        animate={{ opacity: view ? 1 : 0 }}
        // eslint-disable-next-line tailwindcss/classnames-order
        className="mb-4 pt-10 text-center text-4xl capitalize text-primary"
      >
        {t("login")}
      </motion.h2>
      <motion.form
        initial="hidden"
        animate={view ? "show" : "hidden"}
        onSubmit={handleSubmit}
        className="grid gap-2"
      >
        <motion.div className="" variants={fadeIn("left", "tween", 0, 0.7)}>
          <InputText
            label={t("email")}
            type="email"
            name="username"
            placeholder={t("placeholder.email")}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
            helperText={touched.username && errors.username}
          />
        </motion.div>
        <motion.div className="" variants={fadeIn("right", "tween", 0, 0.7)}>
          <InputText
            label={t("password")}
            type="password"
            name="password"
            placeholder={t("placeholder.password")}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
            helperText={touched.password && errors.password}
          />
        </motion.div>
        <motion.div className="" variants={fadeIn("left", "tween", 0, 0.7)}>
          <PrimaryBtn
            color="primary"
            className="w-full"
            type="submit"
            isProcessing={loading}
          >
            {t("login")}
          </PrimaryBtn>
        </motion.div>
        <motion.p
          animate={{ opacity: !view ? 0 : 1 }}
          className="cursor-pointer capitalize text-primary"
        >
          <Link to="/forgot-password">{t("forgot_password")}</Link>
        </motion.p>
        <motion.p
          animate={{ opacity: !view ? 0 : 1 }}
          className="cursor-pointer text-primary"
          onClick={() => setView(!view)}
        >
          {t("do_not_have_account")}
        </motion.p>
      </motion.form>
    </div>
  );
}
