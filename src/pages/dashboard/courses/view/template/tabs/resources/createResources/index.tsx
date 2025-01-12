import { useCallback, useContext, useState } from "react";
import PrimaryBtn from "../../../../../../../../components/button/primaryBtn";
import PopupModal from "../../../../../../../../components/popupModal";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { API_COURSES } from "../../../../../../../../router/routes/apiRoutes";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { ViewCourseContext } from "../../../..";
import { MultipleFiles } from "../../../../../../../../components/form/multipleFiles";
import axiosJson from "../../../../../../../../utilities/axiosJson";
import { Progress } from "flowbite-react";

export default function AddResources() {
  const { t } = useTranslation("common");
  const { t: tBtn } = useTranslation("buttons");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { setData, course } = useContext(ViewCourseContext);

  const { errors, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: {
      file: [],
    },
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();

      for (const value of values.file) {
        formData.append("file[]", value);
      }
      formData.append("_method", "put");
      try {
        const { data } = await axiosJson.post(
          `${API_COURSES.courses}/${course?.id}`,
          formData,
          {
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
          },
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
        toastifyBox("success", "Add file successfully");
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

  return (
    <>
      <PrimaryBtn onClick={toggleModal} className="w-fit min-w-fit">
        {tBtn("addResource")}
      </PrimaryBtn>

      <PopupModal
        closeModal={toggleModal}
        isOpen={open}
        title={tBtn("addResource")}
      >
        <form onSubmit={handleSubmit} className="grid w-full grid-cols-1 gap-4">
          <MultipleFiles
            setValue={setFieldValue}
            label={t("addFiles")}
            name="file"
            error={errors.file}
          />

          <PrimaryBtn type="submit" className="mx-auto" isProcessing={loading}>
            {tBtn("save")}
          </PrimaryBtn>
          {progress > 0 && (
            <Progress
              progress={progress}
              color={progress === 100 ? "green" : "blue"}
              className="mb-4"
            />
          )}
        </form>
      </PopupModal>
    </>
  );
}
