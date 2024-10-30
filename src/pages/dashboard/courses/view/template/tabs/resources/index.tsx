import { useContext } from "react";
import { ViewCourseContext } from "../../..";
import DeleteRecourse from "./deleteResource";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";
import AddResources from "./createResources";

export default function Resources() {
  const { t } = useTranslation("viewCourse");
  const { course } = useContext(ViewCourseContext);
  const { file } = course || {};
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-4">
        <TitleSection title={t("resources")} />
        <AddResources />
      </div>
      {file?.map((file) => {
        const name = file.path.split("/");
        return (
          <div className="flex items-center gap-4">
            <a
              href={file.path}
              download
              className="text-primary hover:underline"
              target="_blank"
            >
              {name[name.length - 1]}
            </a>
            <DeleteRecourse id={file.id} />
          </div>
        );
      })}
    </div>
  );
}
