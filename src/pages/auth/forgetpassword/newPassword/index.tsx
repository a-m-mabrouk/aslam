import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { reset } from "../../../../store/reducers/forgetpassword";
import axiosDefault from "../../../../utilities/axios";
import { toastifyBox } from "../../../../helper/toastifyBox";
import PrimaryBtn from "../../../../components/button/primaryBtn";
import { InputText } from "../../../../components/form/textInput";
import { API_AUTH } from "../../../../router/routes/apiRoutes";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { newPasswordSchema } from "../../../../helper/validation/validation";
import { useNavigate } from "react-router";
import { useState } from "react";

const container = {
  hidden: {
    opacity: 0,
    transition: { when: "afterChildren", duration: 0.3 },
  },
  show: {
    opacity: 1,
    transition: {
      delay: 1.5,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.5 },
  },
  show: { opacity: 1, x: 0 },
};
const title = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
  show: { opacity: 1 },
};
export default function NewPassword({ view }: { view: boolean }) {
  const { t } = useTranslation("auth");
  const { email } = useAppSelector((state) => state.forgetpassword);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { errors, touched, handleSubmit, handleChange, handleBlur, values } =
    useFormik({
      initialValues: {
        password: "",
        password_confirmation: "",
      },
      validationSchema: newPasswordSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          await axiosDefault.post(API_AUTH.resetPassword, {
            ...values,
            email,
          });

          dispatch(reset());
          navigate("/");
        } catch (error) {
          const {
            message: {
              email: [err],
            },
          } = error as { message: { email: string[] } };
          setLoading(false);
          toastifyBox("error", err);
        }
      },
    });
  return (
    <motion.div
      variants={container}
      initial={"hidden"}
      animate={view ? "show" : "hidden"}
      className={`absolute inset-0 grid gap-2 overflow-hidden p-4 ${view ? "z-10" : ""}`}
    >
      <motion.h2 variants={title} className="pt-4 text-3xl capitalize">
        {t("newPassword")}
      </motion.h2>

      <motion.form variants={container} onSubmit={handleSubmit}>
        <motion.div className="" variants={item}>
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
        <motion.div className="" variants={item}>
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
        <motion.div className="" variants={item}>
          <PrimaryBtn
            color="primary"
            className="w-full"
            type="submit"
            isProcessing={loading}
          >
            {t("confirm")}
          </PrimaryBtn>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
