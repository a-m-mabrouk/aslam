import * as yup from "yup";
const passwordValidationRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
export const registerSchema = yup.object({
  first_name: yup
    .string()
    .required("filed_required")
    .min(3, "minLength3")
    .max(10, "maxLength10"),
  last_name: yup
    .string()
    .required("filed_required")
    .min(3, "minLength3")
    .max(10, "maxLength10"),
  email: yup.string().email("email").required("filed_required"),
  phone_number: yup
    .string()
    .min(7, "phone")
    .required("filed_required")
    .test("phone", "phone", (value) => {
      return /^\d+$/.test(value || "");
    }),
  password: yup
    .string()
    .required("filed_required")
    .matches(passwordValidationRegex, {
      message: "password",
      excludeEmptyString: true,
    }),
  password_confirmation: yup
    .string()
    .required("filed_required")
    .oneOf([yup.ref("password")], "password_confirmation"),
});

export const loginSchema = yup.object({
  username: yup.string().email("email").required("filed_required"),
  password: yup
    .string()
    .required("filed_required")
    .matches(passwordValidationRegex, {
      message: "password",
      excludeEmptyString: true,
    }),
});

export const checkEmailSchema = yup.object({
  email: yup.string().email("email").required("filed_required"),
});

export const confirmCodeSchema = yup.object({
  otp: yup.string().required("filed_required"),
});

export const newPasswordSchema = yup.object({
  password: yup
    .string()
    .required("filed_required")
    .matches(passwordValidationRegex, {
      message: "password",
      excludeEmptyString: true,
    }),
  password_confirmation: yup
    .string()
    .required("filed_required")
    .oneOf([yup.ref("password")], "password_confirmation"),
});
