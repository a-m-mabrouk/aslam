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
import Exams from "./exams";
import { useCallback, useContext, useState } from "react";
import { ViewCourseContext } from "../..";
import useGetLang from "../../../../../../hooks/useGetLang";

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
    <div>
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
          <TabsCard.TabItem title={t("exams")} icon={DocumentTextIcon} active={activeTabIndex === 3}>
            <Exams />
          </TabsCard.TabItem>
        </TabsCard>
      </BgCard>
    </div>
  );
}
