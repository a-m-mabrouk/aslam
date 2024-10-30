import { useFormik } from "formik";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { nextStep } from "../../../../store/reducers/forgetpassword";
import axiosDefault from "../../../../utilities/axios";
import { toastifyBox } from "../../../../helper/toastifyBox";
import PrimaryBtn from "../../../../components/button/primaryBtn";
import { InputText } from "../../../../components/form/textInput";
import { API_AUTH } from "../../../../router/routes/apiRoutes";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { confirmCodeSchema } from "../../../../helper/validation/validation";
import { useCallback, useState } from "react";

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
export default function VerifyCode({ view }: { view: boolean }) {
  const { t } = useTranslation("auth");
  const { email } = useAppSelector((state) => state.forgetpassword);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { errors, touched, handleSubmit, handleChange, handleBlur, values } =
    useFormik({
      initialValues: {
        otp: "",
      },
      validationSchema: confirmCodeSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          await axiosDefault.post(API_AUTH.verifyCode, {
            ...values,
            email,
          });

          setLoading(false);
          dispatch(nextStep());
        } catch (error) {
          const { message } = error as { message: string };

          setLoading(false);
          toastifyBox("error", message);
        }
      },
    });

  const resendCode = useCallback(async () => {
    try {
      await axiosDefault.post(API_AUTH.forgetPassword, {
        email,
      });
      toastifyBox("success", "code sent successfully");
    } catch (err) {
      const { message } = err as { message: string };
      toastifyBox("error", message);
    }
  }, [email]);
  return (
    <motion.div
      variants={container}
      initial={"hidden"}
      animate={view ? "show" : "hidden"}
      className={`absolute inset-0 grid gap-2 overflow-hidden p-4 ${view ? "z-10" : ""}`}
    >
      <motion.h2 variants={title} className="pt-4 text-3xl capitalize">
        {t("confirmCode")}
      </motion.h2>

      <motion.form variants={container} onSubmit={handleSubmit}>
        <motion.div className="" variants={item}>
          <InputText
            label={t("otp")}
            type="text"
            name="otp"
            placeholder={t("placeholder.otp")}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.otp}
            helperText={touched.otp && errors.otp}
          />
        </motion.div>
        <span
          className="cursor-pointer text-sm text-primary"
          onClick={resendCode}
        >
          {t("resendCode")}
        </span>
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
