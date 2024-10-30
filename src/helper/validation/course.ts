/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as yup from "yup";
export const courseScheme = yup.object({
  name_ar: yup
    .string()
    .required("filed_required")
    .matches(/[\u0600-\u06FF]/, "arabic"),
  name_en: yup
    .string()
    .required("filed_required")
    .matches(/[a-zA-Z]/, "english"),
  description_ar: yup
    .string()
    .required("filed_required")
    .matches(/[\u0600-\u06FF]/, "arabic"),
  description_en: yup
    .string()
    .required("filed_required")
    .matches(/[a-zA-Z]/, "english"),
  photo: yup.mixed().test("maxSize", "file_size", (value) => {
    if (!value) return true;

    //@ts-ignore
    return value.size <= 1048576;
  }),
});

export const editCourseScheme = yup.object({
  name_ar: yup.string().matches(/[\u0600-\u06FF]/, "arabic"),
  name_en: yup.string().matches(/[a-zA-Z]/, "english"),
  description_ar: yup.string().matches(/[\u0600-\u06FF]/, "arabic"),
  description_en: yup.string().matches(/[a-zA-Z]/, "english"),
  photo: yup.mixed().test("maxSize", "file_size", (value) => {
    if (!value) return true;

    //@ts-ignore
    return value.size <= 1048576;
  }),
});

export const chapterScheme = yup.object({
  name_ar: yup
    .string()
    .required("filed_required")
    .matches(/[\u0600-\u06FF]/, "arabic"),
  name_en: yup
    .string()
    .required("filed_required")
    .matches(/[a-zA-Z]/, "english"),
});

export const lessonScheme = yup.object({
  name_ar: yup
    .string()
    .required("filed_required")
    .matches(/[\u0600-\u06FF]/, "arabic"),
  name_en: yup
    .string()
    .required("filed_required")
    .matches(/[a-zA-Z]/, "english"),
  description_ar: yup.string().matches(/[\u0600-\u06FF]/, "arabic"),
  description_en: yup.string().matches(/[a-zA-Z]/, "english"),
  file: yup.mixed().test("maxSize", "file_size", (value) => {
    if (!value) return true;

    //@ts-ignore
    return value.size <= 1048576;
  }),
});

export const addCourseToStudentScheme = yup.object({
  course_id: yup.string().required("filed_required"),
  check_expiration_date: yup.boolean(),
  expiration_date: yup.date().when("check_expiration_date", {
    is: true,
    then: (schema) => schema.required("filed_required"),
    otherwise: (schema) => schema,
  }),
});
