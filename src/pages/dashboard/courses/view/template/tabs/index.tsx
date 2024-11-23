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
import { useCallback, useState } from "react";

export default function Tabs() {
  const localstorageTabIndex = Number(localStorage.getItem('tabIndex'));
  const [activeTabIndex, setActiveTabIndex] = useState<number>(localstorageTabIndex || 0)
  const { t } = useTranslation("viewCourse");
  const setTabsLocalstorage = useCallback((tabIndex: number) => {
    setActiveTabIndex(tabIndex);
    localStorage.setItem('tabIndex', JSON.stringify(tabIndex))
  }, [])
  return (
    <div>
      <BgCard>
        <TabsCard handleActiveTabchange={e=> setTabsLocalstorage(e)}>
          <TabsCard.TabItem title={t("videos")} icon={FolderIcon} active={activeTabIndex === 0}>
            <Videos />
          </TabsCard.TabItem>
          <TabsCard.TabItem title={t("resources")} icon={DocumentIcon} active={activeTabIndex === 1}>
            <Resources />
          </TabsCard.TabItem>
          <TabsCard.TabItem title={t("exams")} icon={DocumentTextIcon} active={activeTabIndex === 2}>
            <Exams />
          </TabsCard.TabItem>
        </TabsCard>
      </BgCard>
    </div>
  );
}
