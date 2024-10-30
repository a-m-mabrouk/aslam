/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import PrimaryBtn from "../../../../../../../components/button/primaryBtn";
import PopupModal from "../../../../../../../components/popupModal";
import { useTranslation } from "react-i18next";
import InputFile from "../../../../../../../components/form/fileInput";
import { useFormik } from "formik";
import TextInputLang from "../../../../../../../components/form/textInputLang";
import TextareaLang from "../../../../../../../components/form/textareaLang";
import { editCourseScheme } from "../../../../../../../helper/validation/course";
import { API_COURSES } from "../../../../../../../router/routes/apiRoutes";
import { toastifyBox } from "../../../../../../../helper/toastifyBox";
import EditBtn from "../../../../../../../components/button/editBtn";
import { ViewCourseContext } from "../../..";
import axiosJson from "../../../../../../../utilities/axiosJson";

export default function EditCourse() {
  const { t } = useTranslation("common");
  const { t: tBtn } = useTranslation("buttons");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setData, course } = useContext(ViewCourseContext);

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    values,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      photo: "",
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
    },

    validationSchema: editCourseScheme,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      const entries = Object.entries(values).filter(
        ([_, value]) => value !== undefined,
      );
      for (const [key, value] of entries) {
        formData.append(key, value as unknown as string);
      }
      formData.append("_method", "put");
      try {
        const { data } = await axiosJson.post(
          `${API_COURSES.courses}/${course?.id}`,
          formData,
        );

        setData((prev: unknown) =>
          prev
            ? {
                ...prev,
                ...data.data,
              }
            : prev,
        );

        toggleModal();
        setLoading(false);
        toastifyBox("success", "Course updated successfully");
        resetForm();
      } catch (err) {
        const { message } = err as Error;
        setLoading(false);
        toastifyBox("error", message);
      }
    },
  });

  const toggleModal = useCallback(() => {
    setOpen(!open);
  }, [open]);

  useEffect(() => {
    if (course) {
      setValues({
        description_ar: course?.description?.ar || "",
        description_en: course?.description?.en || "",
        name_ar: course?.name?.ar || "",
        name_en: course?.name?.en || "",
        photo: course?.photo || "",
      });
    }
  }, [course, setValues]);

  return (
    <>
      <EditBtn onClick={toggleModal} />

      <PopupModal
        closeModal={toggleModal}
        isOpen={open}
        title={t("editCourse")}
      >
        <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-4">
          <InputFile
            label={t("addPhoto")}
            name="photo"
            onChange={setFieldValue}
            value={values.photo}
            error={errors.photo}
          />

          <TextInputLang
            label_ar={"اسم الدورة"}
            label_en={"course Name"}
            type="text"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />
          <TextareaLang
            label_ar={"وصف الدورة"}
            label_en={"description of course"}
            name="description"
            onChange={handleChange}
            onBlur={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />

          <PrimaryBtn type="submit" className="mx-auto" isProcessing={loading}>
            {tBtn("save")}
          </PrimaryBtn>
        </form>
      </PopupModal>
    </>
  );
}
