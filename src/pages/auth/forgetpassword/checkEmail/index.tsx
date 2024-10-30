import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  checkEmail,
  nextStep,
} from "../../../../store/reducers/forgetpassword";
import axiosDefault from "../../../../utilities/axios";
import { toastifyBox } from "../../../../helper/toastifyBox";
import PrimaryBtn from "../../../../components/button/primaryBtn";
import { InputText } from "../../../../components/form/textInput";
import { API_AUTH } from "../../../../router/routes/apiRoutes";
import { useAppDispatch } from "../../../../store";
import { checkEmailSchema } from "../../../../helper/validation/validation";
import { useState } from "react";

const container = {
  hidden: {
    opacity: 0,
    transition: { when: "afterChildren", duration: 0.3 },
  },
  show: {
    opacity: 1,
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: -100,
    transition: { duration: 2 },
  },
  show: { opacity: 1, y: 0 },
};
const title = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.5 },
  },
  show: { opacity: 1 },
};
export default function CheckEmail({ view }: { view: boolean }) {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { errors, touched, handleSubmit, handleChange, handleBlur, values } =
    useFormik({
      initialValues: {
        email: "",
      },
      validationSchema: checkEmailSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          await axiosDefault.post(API_AUTH.forgetPassword, {
            ...values,
          });

          setLoading(false);
          dispatch(checkEmail(values.email));
          dispatch(nextStep());
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
        {t("checkEmail")}
      </motion.h2>

      <motion.form variants={container} onSubmit={handleSubmit}>
        <motion.div className="" variants={item}>
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
