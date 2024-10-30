import { useTranslation } from "react-i18next";
import BgCard from "../../../../../../components/cards/bg";
import { TabsCard } from "../../../../../../components/tabs";
import Courses from "./courses";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function Tabs() {
  const { t } = useTranslation("students");
  return (
    <BgCard>
      <TabsCard>
        <TabsCard.TabItem title={t("courses")} icon={AcademicCapIcon}>
          <Courses />
        </TabsCard.TabItem>
      </TabsCard>
    </BgCard>
  );
}
