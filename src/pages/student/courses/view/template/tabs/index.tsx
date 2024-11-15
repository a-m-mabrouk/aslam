import { useTranslation } from "react-i18next";
import BgCard from "../../../../../../components/cards/bg";
import { TabsCard } from "../../../../../../components/tabs";
import Videos from "./videos";
import Resources from "./resources";
import {
  DocumentIcon,
  DocumentTextIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { ViewCourseContext } from "../..";
import { useContext } from "react";
import useGetLang from "../../../../../../hooks/useGetLang";
import ExamComponent from "../../../../../dashboard/courses/view/template/tabs/exams";

export default function Tabs() {
  const { t } = useTranslation("viewCourse");
  const { lang } = useGetLang();
  const { course } = useContext(ViewCourseContext);
  return (
    <BgCard>
      <TabsCard>
        <TabsCard.TabItem title={t("description")} icon={DocumentTextIcon}>
          <p className="">{course?.description[lang]}</p>
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("videos")} icon={FolderIcon}>
          <Videos />
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("resources")} icon={DocumentIcon}>
          <Resources />
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("exams")} icon={DocumentIcon}>
          <ExamComponent />
        </TabsCard.TabItem>
      </TabsCard>
    </BgCard>
  );
}
