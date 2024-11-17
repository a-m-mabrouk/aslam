import { TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { API_COURSES } from "../../../../../../../../router/routes/apiRoutes";
import axiosDefault from "../../../../../../../../utilities/axios";
import { ViewCourseContext } from "../../../..";

export default function DeleteChapter({ id }: { id: number }) {
  const { t } = useTranslation("buttons");
  const { t: tAlert } = useTranslation("alerts");
  const { setData } = useContext(ViewCourseContext);
  const deleteCourse = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      withReactContent(Swal).fire({
        title: tAlert("deleteChapter"),
        preConfirm: async () => {
          try {
            await axiosDefault.delete(`${API_COURSES.modules}/${id}`);
            setData((prev: CoursesListDatum) => ({
              ...prev,
              modules: prev.modules.filter((module) => module.id !== id),
            }));
            toastifyBox("success", tAlert("chapterDeleted"));
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
    <span
      title="delete course"
      className=" grid size-8 place-items-center rounded-md border border-error-color bg-white/30 text-error-color"
      onClick={deleteCourse}
    >
      <TrashIcon className="size-6" />
    </span>
  );
}
