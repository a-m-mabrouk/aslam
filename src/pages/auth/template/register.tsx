import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { InputText } from "../../../components/form/textInput";
import PrimaryBtn from "../../../components/button/primaryBtn";
import { useFormik } from "formik";
import { registerSchema } from "../../../helper/validation/validation";
import React from "react";
import { API_AUTH } from "../../../router/routes/apiRoutes";
import axiosDefault from "../../../utilities/axios";
import { useAppDispatch } from "../../../store";
import { login } from "../../../store/reducers/auth";
import { fadeIn } from "../../../utilities/motion";
import { toastifyBox } from "../../../helper/toastifyBox";
import LoginHelp from "./loginHelp";

export default function Register({
  view,
  setView,
}: {
  view: boolean;
  setView: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);

  const { errors, touched, handleSubmit, handleChange, handleBlur, values } =
    useFormik({
      initialValues: {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
      },
      validationSchema: registerSchema,
      onSubmit: async (values) => {
        setLoading(true);

        try {
          const { data } = await axiosDefault.post(API_AUTH.register, {
            ...values,
            // role: "teacher",
            role: "student",
          });

          dispatch(login(data.data));
          setLoading(false);
        } catch (err) {
          const { message } = err as Error;
          toastifyBox("error", message);
          setLoading(false);
        }
      },
    });

  return (
    <div
      className={`grid-cols-1 place-content-start gap-4 px-5  ${view ? "grid" : "relative -z-10 hidden md:grid"}`}
    >
      <motion.h2
        animate={{ opacity: !view ? 0 : 1 }}
        // eslint-disable-next-line tailwindcss/classnames-order
        className="mb-4 pt-10 text-center text-4xl capitalize text-primary"
      >
        {t("register")}
      </motion.h2>
      <motion.form
        initial="hidden"
        animate={view ? "show" : "hidden"}
        onSubmit={handleSubmit}
        className="grid gap-2"
      >
        <div className="grid grid-cols-2 gap-2">
          <motion.div className="" variants={fadeIn("left", "tween", 0, 0.7)}>
            <InputText
              label={t("first_name")}
              type="text"
              name="first_name"
              placeholder={t("placeholder.first_name")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.first_name}
              helperText={touched.first_name && errors.first_name}
            />
          </motion.div>
          <motion.div className="" variants={fadeIn("right", "tween", 0, 0.7)}>
            <InputText
              label={t("last_name")}
              type="text"
              name="last_name"
              placeholder={t("placeholder.last_name")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.last_name}
              helperText={touched.last_name && errors.last_name}
            />
          </motion.div>
        </div>
        <motion.div className="" variants={fadeIn("up", "tween", 0, 0.7)}>
          <InputText
            label={t("phone_number")}
            type="text"
            name="phone_number"
            placeholder={t("placeholder.phone_number")}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone_number}
            helperText={touched.phone_number && errors.phone_number}
          />
        </motion.div>

        <motion.div className="" variants={fadeIn("up", "tween", 0, 0.7)}>
          <InputText
            label={t("email")}
            type="email"
            name="email"
            placeholder={t("placeholder.email")}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            helperText={touched.email && errors.email}
          />
        </motion.div>
        <motion.div className="" variants={fadeIn("up", "tween", 0, 0.7)}>
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
        <motion.div className="" variants={fadeIn("up", "tween", 0, 0.7)}>
          <InputText
            label={t("password_confirmation")}
            type="password"
            name="password_confirmation"
            placeholder={t("placeholder.password_confirmation")}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password_confirmation}
            helperText={
              touched.password_confirmation && errors.password_confirmation
            }
          />
        </motion.div>
        <motion.div className="" variants={fadeIn("right", "tween", 0, 0.7)}>
          <PrimaryBtn
            color="primary"
            className="w-full"
            type="submit"
            isProcessing={loading}
          >
            {t("register")}
          </PrimaryBtn>
        </motion.div>
        <motion.p
          animate={{ opacity: !view ? 0 : 1 }}
          className="cursor-pointer text-primary"
          onClick={() => setView((prev) => !prev)}
        >
          {t("have_account")}
        </motion.p>
      </motion.form>
      <LoginHelp />
    </div>
  );
}
