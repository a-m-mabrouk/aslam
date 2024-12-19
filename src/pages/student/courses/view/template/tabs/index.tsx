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
import { useCallback, useContext, useState } from "react";
import useGetLang from "../../../../../../hooks/useGetLang";
import ExamComponent from "../../../../../dashboard/courses/view/template/tabs/exams";

export default function Tabs() {
  const localstorageTabIndex = Number(localStorage.getItem('tabIndex'));
  const [activeTabIndex, setActiveTabIndex] = useState<number>(localstorageTabIndex || 0)
  const { t } = useTranslation("viewCourse");
  const setTabsLocalstorage = useCallback((tabIndex: number) => {
    setActiveTabIndex(tabIndex);
    localStorage.setItem('tabIndex', JSON.stringify(tabIndex))
  }, [])
  const { lang } = useGetLang();
  const { course } = useContext(ViewCourseContext);
  return (
    <BgCard>
      <TabsCard handleActiveTabchange={e=> setTabsLocalstorage(e)}>
        <TabsCard.TabItem title={t("description")} icon={DocumentTextIcon} active={activeTabIndex === 0}>
          <pre
            style={{
              fontFamily: "unset",
              fontWeight: "bold",
              textWrap: "wrap",
            }}
          >
            {course?.description[lang]}
          </pre>
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("videos")} icon={FolderIcon} active={activeTabIndex === 1}>
          <Videos />
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("resources")} icon={DocumentIcon} active={activeTabIndex === 2}>
          <Resources />
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("exams")} icon={DocumentIcon} active={activeTabIndex === 3}>
          <ExamComponent />
        </TabsCard.TabItem>
      </TabsCard>
    </BgCard>
  );
}
