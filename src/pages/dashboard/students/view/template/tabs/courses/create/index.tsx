import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../../../../../../../components/button/primaryBtn";
import PopupModal from "../../../../../../../../components/popupModal";
import { useCallback, useContext, useMemo, useState } from "react";
import { useFormik } from "formik";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { addCourseToStudentScheme } from "../../../../../../../../helper/validation/course";
import {
  API_COURSES,
  API_STUDENTS,
} from "../../../../../../../../router/routes/apiRoutes";
import axiosDefault from "../../../../../../../../utilities/axios";
import { useParams } from "react-router";
import { ViewStudentContext } from "../../../..";
import useFetch from "../../../../../../../../hooks/useFetch";
import SelectInput from "../../../../../../../../components/form/selectInput";
import useGetLang from "../../../../../../../../hooks/useGetLang";
import { ToggleSwitchInput } from "../../../../../../../../components/form/toggleSwitch";
import { InputText } from "../../../../../../../../components/form/textInput";

export default function CreateChapter() {
  const { t } = useTranslation("buttons");
  const { t: tInputs } = useTranslation("inputs");
  const { id } = useParams();
  const { data } = useFetch<CoursesList>(API_COURSES.courses);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setData } = useContext(ViewStudentContext);
  const { lang } = useGetLang();

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    values,
    resetForm,
    setFieldValue,
  } = useFormik({
    initialValues: {
      course_id: "",
      expiration_date: "",
      check_expiration_date: false,
    },
    validationSchema: addCourseToStudentScheme,
    onSubmit: async (values) => {
      setLoading(true);
      const { check_expiration_date, expiration_date, course_id } = values;
      try {
        const { data } = await axiosDefault.post(API_STUDENTS.studentCourse, {
          course_id,
          expiration_date: check_expiration_date ? expiration_date : "",
          student_id: id,
        });

        setData((prev: StudentView) =>
          prev
            ? {
                ...data.data,
              }
            : prev,
        );

        toggleModal();
        setLoading(false);
        toastifyBox("success", data.massage);
      } catch (err) {
        const { message } = err as Error;
        setLoading(false);
        toastifyBox("error", message);
      }
    },
  });

  const toggleModal = useCallback(() => {
    setOpen((prev) => !prev);
    resetForm();
  }, [resetForm]);

  const courses = useMemo(
    () =>
      data?.filter((item) => !item.free)?.map((item) => ({
        id: item.id,
        title: item.name[lang],
      })) || [],
    [data, lang],
  );

  return (
    <>
      <PopupModal isOpen={open} closeModal={toggleModal} title={t("addCourse")}>
        <PopupModal.Form onSubmit={handleSubmit}>
          <SelectInput
            list={courses}
            error={(touched.course_id && errors.course_id) || ""}
            label={tInputs("chooseCourse")}
            name="course_id"
            setValue={handleChange}
            handleBlur={handleBlur}
            value={values.course_id}
          />
          <ToggleSwitchInput
            label={tInputs("checkExpirationDate")}
            name="check_expiration_date"
            onChange={setFieldValue}
            value={values.check_expiration_date}
          />
          {values.check_expiration_date && (
            <InputText
              label={tInputs("expiration_date")}
              type="date"
              min={new Date().toISOString().split("T")[0]}
              name="expiration_date"
              placeholder={t("placeholder.expiration_date")}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.expiration_date}
              helperText={touched.expiration_date && errors.expiration_date}
            />
          )}
          <PrimaryBtn type="submit" className="mx-auto" isProcessing={loading}>
            {t("add")}
          </PrimaryBtn>
        </PopupModal.Form>
      </PopupModal>
      <PrimaryBtn pluse onClick={toggleModal}>
        {t("addCourse")}
      </PrimaryBtn>
    </>
  );
}
