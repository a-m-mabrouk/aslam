import { useContext } from "react";
import { ViewCourseContext } from "../../..";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";

export default function Resources() {
  const { t } = useTranslation("viewCourse");
  const { course } = useContext(ViewCourseContext);
  const { file, expire } = course || {};
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-4">
        <TitleSection title={t("resources")} />
      </div>
      {file?.map((file, i) => {
        const name = file.path.split("/");
        return (
          <div className="flex items-center gap-4" key={i}>
            {expire ? (
              <a
                href={file.path}
                download
                className="text-primary hover:underline"
                target="_blank"
              >
                {name[name.length - 1]}
              </a>
            ) : (
              <span>{name[name.length - 1]}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
