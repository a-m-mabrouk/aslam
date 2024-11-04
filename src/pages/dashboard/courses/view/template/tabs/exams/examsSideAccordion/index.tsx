import { useTranslation } from "react-i18next";
// import useGetLang from "../../../../../../../../hooks/useGetLang";
import TitleSection from "../../../../../../../../components/title";

// import PlayerModal from "../../../../../../../../components/popupModal/player";
// import DescriptionLesson from "../../../../../../../student/courses/view/template/tabs/videos/description";


export default function ExamsSideAccordion() {
  const { t } = useTranslation("viewCourse");
  //   const { lang } = useGetLang();
  return (
    <div className="grid gap-4">
      <div className="flex justify-between gap-2">
        <TitleSection title={t("exams")} />
      </div>
      
    </div>
  );
}
