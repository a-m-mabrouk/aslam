import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../../../../../../../components/button/primaryBtn";
import PopupModal from "../../../../../../../../components/popupModal";
import { useCallback, useContext, useState } from "react";
import { useFormik } from "formik";
import TextInputLang from "../../../../../../../../components/form/textInputLang";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { chapterScheme } from "../../../../../../../../helper/validation/course";
import { API_COURSES } from "../../../../../../../../router/routes/apiRoutes";
import axiosDefault from "../../../../../../../../utilities/axios";
import { useParams } from "react-router";
import { ViewCourseContext } from "../../../..";

export default function CreateChapter() {
  const { t } = useTranslation("buttons");
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setData } = useContext(ViewCourseContext);

  const {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    values,
    resetForm,
  } = useFormik({
    initialValues: {
      name_ar: "",
      name_en: "",
    },
    validationSchema: chapterScheme,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await axiosDefault.post(API_COURSES.modules, {
          ...values,
          course_id: id,
        });

        console.log(data);

        setData((prev: CoursesListDatum) =>
          prev
            ? {
                ...prev,
                modules: [...prev.modules, { ...data.data, lessons: [] }],
              }
            : prev,
        );

        toggleModal();
        setLoading(false);
        toastifyBox("success", "chapter created successfully");
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
  return (
    <>
      <PopupModal
        isOpen={open}
        closeModal={toggleModal}
        title={t("addChapter")}
      >
        <PopupModal.Form onSubmit={handleSubmit}>
          <TextInputLang
            label_ar={"اسم الفصل"}
            label_en={"chapter Name"}
            type="text"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />

          <PrimaryBtn type="submit" className="mx-auto" isProcessing={loading}>
            {t("add")}
          </PrimaryBtn>
        </PopupModal.Form>
      </PopupModal>
      <PrimaryBtn pluse onClick={toggleModal}>
        {t("addChapter")}
      </PrimaryBtn>
    </>
  );
}
