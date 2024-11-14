import { useTranslation } from "react-i18next";
import { Tabs } from "flowbite-react";
import Details from "./Details";
import Report from "./Report";
import Review from "./Review";
// import { TabsCard } from "../../../../../../../../../components/tabs";
// import { useAppDispatch } from "../../../../../../../../store";

export default function ExamResult() {
  // const dispatch = useAppDispatch();
  const { t } = useTranslation("exams");
  const handleTabChange = (tab: number) => {
    if (tab === 2) {
      // dispatch(showSideNav());
    } else {
      // dispatch(hideSideNav());
    }
    
  };
  return (
    <Tabs aria-label="Default tabs" variant="default" onActiveTabChange={handleTabChange}>
      <Tabs.Item active title={t("resultReport")}>
        <Report />
      </Tabs.Item>
      <Tabs.Item title={t("details")}>
        <Details />
      </Tabs.Item>
      <Tabs.Item title={t("review")}>
        <Review />
      </Tabs.Item>
    </Tabs>
  );
}
