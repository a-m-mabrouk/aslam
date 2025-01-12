import { useTranslation } from "react-i18next";
import PrimaryBtn from "../../../../../../../../components/button/primaryBtn";
import PopupModal from "../../../../../../../../components/popupModal";
import { useCallback, useContext, useState } from "react";
import { useFormik } from "formik";
import TextInputLang from "../../../../../../../../components/form/textInputLang";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { chapterScheme } from "../../../../../../../../helper/validation/course";
import { API_COURSES } from "../../../../../../../../router/routes/apiRoutes";
import { useParams } from "react-router";
import { ViewCourseContext } from "../../../..";
import { PlusIcon } from "@heroicons/react/24/solid";
import { UploadFile } from "../../../../../../../../components/form/uploadFile";
import TextareaLang from "../../../../../../../../components/form/textareaLang";
import axiosJson from "../../../../../../../../utilities/axiosJson";
import { Progress } from "flowbite-react";

export default function CreateLesson({ moduleIndex }: { moduleIndex: number }) {
  const { t } = useTranslation("inputs");
  const { t: tBtn } = useTranslation("buttons");
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<number>(0);
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
    setFieldValue,
  } = useFormik({
    initialValues: {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      file: null,
    },
    validationSchema: chapterScheme,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();

      for (const [key, value] of Object.entries(values)) {
        if (key === "file") {
          formData.append("file[]", value as string);
          continue;
        }
        formData.append(key, value as string | Blob);
      }

      formData.append("course_id", id as string);
      formData.append("module_id", `${moduleIndex}`);
      try {
        const { data } = await axiosJson.post(API_COURSES.lessons, formData, {
          onUploadProgress: (event) => {
            if (event.total) {
              const percentCompleted = Math.round(
                (event.loaded * 100) / event.total,
              );
              setProgress(percentCompleted);
              if (percentCompleted >= 100) {
                setProgress(0);
              }
            }
          },
        });

        setData((prev: CoursesListDatum) =>
          prev
            ? {
                ...prev,
                modules: prev.modules.map((module) => {
                  if (module.id === moduleIndex) {
                    return {
                      ...module,
                      lessons: [...module.lessons, data.data],
                    };
                  }
                  return module;
                }),
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
    if (loading) return;
    setOpen((prev) => !prev);
    resetForm();
  }, [loading, resetForm]);

  return (
    <>
      <PopupModal
        isOpen={open}
        closeModal={toggleModal}
        title={tBtn("addLesson")}
      >
        <PopupModal.Form onSubmit={handleSubmit}>
          <UploadFile
            name={`file`}
            setValue={setFieldValue}
            label={t("fileLesson")}
            setTouch={handleBlur}
            error={touched[`file`] && errors[`file`]}
          />
          <TextInputLang
            label_ar={"عنوان الدرس"}
            label_en={"lesson Name"}
            type="text"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />

          <TextareaLang
            label_ar={"وصف الدرس"}
            label_en={"lesson description"}
            name="description"
            onChange={handleChange}
            onBlur={handleBlur}
            values={values}
            errors={errors}
            touched={touched}
          />

          <PrimaryBtn type="submit" className="mx-auto" isProcessing={loading}>
            {t("add")}
          </PrimaryBtn>
          {progress > 0 && (
            <Progress
              progress={progress}
              color={progress === 100 ? "green" : "blue"}
              className="mb-4"
            />
          )}
        </PopupModal.Form>
      </PopupModal>
      <div
        onClick={toggleModal}
        className="rounded-md border border-primary p-1 text-primary"
      >
        <PlusIcon className="size-5" />
      </div>
    </>
  );
}
