import { useCallback, useState } from "react";
import PrimaryBtn from "../../../../components/button/primaryBtn";
import PopupModal from "../../../../components/popupModal";
import { useTranslation } from "react-i18next";
import InputFile from "../../../../components/form/fileInput";
import { useFormik } from "formik";
import TextInputLang from "../../../../components/form/textInputLang";
import TextareaLang from "../../../../components/form/textareaLang";
import { courseScheme } from "../../../../helper/validation/course";
import { API_COURSES } from "../../../../router/routes/apiRoutes";
import { toastifyBox } from "../../../../helper/toastifyBox";
import axiosJson from "../../../../utilities/axiosJson";
import { ToggleSwitch } from "flowbite-react";

export default function CreateCourse({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<CoursesList | undefined>>;
}) {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      photo: undefined,
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      free: false,
    },
    validationSchema: courseScheme,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();

      for (const [key, value] of Object.entries(values)) {
        if (key === "free") {
          const isFreeVal = value? "1": "0";
          formData.append(key, isFreeVal as string);
        } else {
          formData.append(key, value as string);
        }
      }

      try {
        const { data } = await axiosJson.post(API_COURSES.courses, formData);
        setData((prev) => (prev ? [data.data, ...prev] : prev));
        toggleModal();
        setLoading(false);
        toastifyBox("success", "Course created successfully");
      } catch (err) {
        const { message } = err as Error;
        setLoading(false);
        toastifyBox("error", message);
      }
    },
  });

  const toggleModal = useCallback(() => {
    setOpen(!open);
    resetForm();
  }, [open, resetForm]);

  const handleChangeImage = useCallback(
    (_: string, value: File | undefined) => {
      setFieldValue("photo", value, true);
    },
    [setFieldValue],
  );

  return (
    <>
      <PrimaryBtn pluse onClick={toggleModal}>
        {t("addCourse")}
      </PrimaryBtn>

      <PopupModal closeModal={toggleModal} isOpen={open} title={t("addCourse")}>
        <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-4">
          <InputFile
            label={t("addPhoto")}
            name="photo"
            onChange={handleChangeImage}
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

          <ToggleSwitch
            name="free"
            onBlur={handleBlur}
            checked={values.free} // Bind the checked state to Formik's value
            onChange={(state) => setFieldValue("free", state)}
          />

          <PrimaryBtn type="submit" className="mx-auto" isProcessing={loading}>
            {t("addCourse")}
          </PrimaryBtn>
        </form>
      </PopupModal>
    </>
  );
}
