import { useCallback, useEffect } from "react";
import UploadQuestions from "./uploadQuestions";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import ExamCarousel from "./examCarousel";
import { hideSideNav, setExamQuestions } from "../../../../../../../store/reducers/exams";
import TitleSection from "../../../../../../../components/title";
import { useTranslation } from "react-i18next";
// import Calculator from "../../../../../../../components/calculator";

export default function Exams() {
  const dispatch = useAppDispatch();
  const examQuestions = useAppSelector(({exams}) => exams.examQuestions)
  const { t } = useTranslation("viewCourse");
  console.log(examQuestions);
  

  const handleSetQuestions = useCallback((ques: Question[]) => {
    dispatch(setExamQuestions(ques));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(hideSideNav());
    };
  }, [dispatch]);
  return (
    <div>
      <div className="grid gap-4">
      <div className="flex justify-between gap-2">
        <TitleSection title={t("exams")} />
      </div>
      
    </div>
      <ExamCarousel questions={examQuestions || []} />
      <UploadQuestions onAddQuestions={handleSetQuestions} />
      {/* <Calculator /> */}
    </div>
  );
}
