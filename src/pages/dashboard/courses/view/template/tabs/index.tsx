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
import { useAppDispatch } from "../../../../../../store";
import { hideSideNav, showSideNav } from "../../../../../../store/reducers/layout";

export default function Tabs() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("viewCourse");

  const handleTabChange = (tab: number) => {
    if (tab === 2) {
      dispatch(showSideNav());
    } else {
      dispatch(hideSideNav());
    }
    
  };
  return (
    <BgCard>
      <TabsCard handleActiveTabchange={(tabIndex) => handleTabChange(tabIndex)}>
        <TabsCard.TabItem title={t("videos")} icon={FolderIcon}>
          <Videos />
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("resources")} icon={DocumentIcon}>
          <Resources />
        </TabsCard.TabItem>
        <TabsCard.TabItem title={t("exams")} icon={DocumentTextIcon}>
          <Exams />
        </TabsCard.TabItem>
      </TabsCard>
    </BgCard>
  );
}
