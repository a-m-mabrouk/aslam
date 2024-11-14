import { useTranslation } from "react-i18next";
import { Tabs } from "flowbite-react";
import Details from "./Details";
import Report from "./Report";
import Review from "./Review";

export default function ExamResult() {
  const { t } = useTranslation("exams");
  return (
    <Tabs aria-label="Default tabs" variant="default">
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
