import { useTranslation } from "react-i18next";
import BgCard from "../../../../../../components/cards/bg";
import { TabsCard } from "../../../../../../components/tabs";
import Chapters from "./chapters";
import Resources from "./resources";
import {
  DocumentIcon,
  DocumentTextIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import Exams from "./exams";

export default function Tabs() {
  const { t } = useTranslation("viewCourse");
  return (
    <BgCard>
      <TabsCard>
        <TabsCard.TabItem title={t("chapters")} icon={FolderIcon}>
          <Chapters />
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
