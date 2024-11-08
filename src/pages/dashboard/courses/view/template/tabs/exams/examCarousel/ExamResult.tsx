// import { useTranslation } from "react-i18next";
import { TabsCard } from "../../../../../../../../components/tabs";
// import { useAppDispatch } from "../../../../../../../../store";

export default function ExamResult() {
  // const dispatch = useAppDispatch();
  // const { t } = useTranslation("viewCourse");
  const handleTabChange = (tab: number) => {
    if (tab === 2) {
      // dispatch(showSideNav());
    } else {
      // dispatch(hideSideNav());
    }
    
  };
  return (
    <TabsCard handleActiveTabchange={(tabIndex) => handleTabChange(tabIndex)}>
        <TabsCard.TabItem title="report">
          {/* <Videos /> */}
          <h3>report</h3>
        </TabsCard.TabItem>
        <TabsCard.TabItem title="details">
          {/* <Resources /> */}
          <h3>details</h3>
        </TabsCard.TabItem>
      </TabsCard>
  );
}
