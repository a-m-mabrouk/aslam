import { TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { API_COURSES } from "../../../../../../../../router/routes/apiRoutes";
import axiosDefault from "../../../../../../../../utilities/axios";
import { ViewCourseContext } from "../../../..";

export default function DeleteRecourse({ id }: { id: number }) {
  const { t } = useTranslation("buttons");
  const { t: tAlert } = useTranslation("alerts");
  const { setData } = useContext(ViewCourseContext);
  const deleteCourse = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      withReactContent(Swal).fire({
        title: tAlert("deleteResource"),
        preConfirm: async () => {
          try {
            await axiosDefault.post(`${API_COURSES.recourses}/${id}/delete`, {
              _method: "delete",
            });
            setData((prev: CoursesListDatum) => ({
              ...prev,
              file: prev.file.filter((module) => module.id !== id),
            }));
            toastifyBox("success", tAlert("resourceDeleted"));
          } catch (error) {
            const { message } = error as Error;
            toastifyBox("error", message);
          }
        },
        confirmButtonText: t("confirm"),
        icon: "warning",
        denyButtonText: t("cancel"),
        showDenyButton: true,
        showLoaderOnConfirm: true,
      });
    },
    [id, setData, t, tAlert],
  );

  return (
    <button
      title="delete course"
      type="button"
      className=" grid size-8 place-items-center rounded-md border border-error-color bg-white/30 text-error-color"
      onClick={deleteCourse}
    >
      <TrashIcon className="size-6" />
    </button>
  );
}
