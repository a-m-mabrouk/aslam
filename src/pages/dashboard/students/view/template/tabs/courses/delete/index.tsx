import { TrashIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toastifyBox } from "../../../../../../../../helper/toastifyBox";
import { API_STUDENTS } from "../../../../../../../../router/routes/apiRoutes";
import axiosJson from "../../../../../../../../utilities/axiosJson";
import { useParams } from "react-router";

export default function DeleteCourse({ id }: { id: number }) {
  const { t } = useTranslation("buttons");
  const { id: student_id } = useParams();
  const { t: tAlert } = useTranslation("alerts");
  // const { setData } = useContext(ViewStudentContext);
  const deleteCourse = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      withReactContent(Swal).fire({
        title: tAlert("removeStudentCourse"),
        preConfirm: async () => {
          try {
            await axiosJson.post(`${API_STUDENTS.removeStudentCourse}`, {
              _method: "delete",
              course_id: id,
              student_id,
            });
            // setData((prev: CoursesListDatum) => ({
            //   ...prev,
            //   modules: prev.modules.filter((module) => module.id !== id),
            // }));
            toastifyBox("success", tAlert("studentCourseRemoved"));
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
    [id, student_id, t, tAlert],
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
