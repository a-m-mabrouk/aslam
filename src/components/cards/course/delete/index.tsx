import { TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosDefault from "../../../../utilities/axios";
import { API_COURSES } from "../../../../router/routes/apiRoutes";
import { toastifyBox } from "../../../../helper/toastifyBox";
import { allCoursesContext } from "../../../../context/courses";

export default function DeleteCourse({ id }: { id: number }) {
  const { t } = useTranslation("buttons");
  const { t: tAlert } = useTranslation("alerts");
  const { setData } = useContext(allCoursesContext);
  const deleteCourse = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      withReactContent(Swal).fire({
        title: tAlert("deleteCourse"),
        preConfirm: async () => {
          try {
            await axiosDefault.delete(`${API_COURSES.courses}/${id}`);
            setData((prev: CoursesList) =>
              prev.filter((course) => course.id !== id),
            );
            toastifyBox("success", tAlert("courseDeleted"));
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
    <>
      <button
        title="delete course"
        type="button"
        className="absolute right-2 top-2 z-[4] grid size-8 place-items-center rounded-md border border-error-color bg-white/30 text-error-color"
        onClick={deleteCourse}
      >
        <TrashIcon className="size-6" />
      </button>
    </>
  );
}
